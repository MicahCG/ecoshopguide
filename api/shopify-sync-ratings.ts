import {
  ShopifyAdminRequestError,
  isShopifyAdminConfigured,
  shopifyAdminRequest,
} from "../server/shopify-admin.js";
import { appendRatingCss, syncVerifiedCollectiveRatings } from "../server/shopify-ratings-sync.js";

type Theme = { id: string; name: string; role: string };

type ThemeFileResponse = {
  theme: {
    files: {
      nodes: Array<{ filename?: string; body?: { content?: string } | null }>;
    } | null;
  } | null;
};

async function readThemeFile(themeId: string, filename: string) {
  const data = await shopifyAdminRequest<ThemeFileResponse>(
    `query StoreManagerThemeFile($themeId: ID!, $filenames: [String!]!) {
      theme(id: $themeId) {
        files(filenames: $filenames) {
          nodes {
            filename
            body {
              ... on OnlineStoreThemeFileBodyText {
                content
              }
            }
          }
        }
      }
    }`,
    { themeId, filenames: [filename] },
  );
  return data.theme?.files?.nodes[0]?.body?.content ?? null;
}

async function upsertThemeFiles(
  themeId: string,
  files: Array<{ filename: string; content: string }>,
) {
  const result = await shopifyAdminRequest<{
    themeFilesUpsert: {
      upsertedThemeFiles: Array<{ filename: string }>;
      userErrors: Array<{ message: string }>;
    };
  }>(
    `mutation StoreManagerRatingThemeFiles($themeId: ID!, $files: [OnlineStoreThemeFilesUpsertFileInput!]!) {
      themeFilesUpsert(themeId: $themeId, files: $files) {
        upsertedThemeFiles { filename }
        userErrors { message }
      }
    }`,
    {
      themeId,
      files: files.map((file) => ({
        filename: file.filename,
        body: { type: "TEXT", value: file.content },
      })),
    },
  );

  const errorMessages = result.themeFilesUpsert.userErrors
    .map(({ message }) => message.trim())
    .filter(Boolean);
  if (errorMessages.length) {
    throw new ShopifyAdminRequestError(errorMessages.join(" "));
  }

  return result.themeFilesUpsert.upsertedThemeFiles.map((file) => file.filename);
}

export default async function handler(request: any, response: any) {
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!isShopifyAdminConfigured()) {
    response.status(503).json({ ok: false, error: "Shopify Admin API is not configured." });
    return;
  }

  try {
    const includeTheme = request.query?.theme !== "0";
    let themeId: string | null = null;
    let premiumStylesheet: string | undefined;

    if (includeTheme) {
      const themes = await shopifyAdminRequest<{ themes: { nodes: Theme[] } }>(
        "query StoreManagerThemes { themes(first: 20) { nodes { id name role } } }",
      );
      const requestedThemeId =
        typeof request.query?.themeId === "string" ? request.query.themeId : null;
      const theme = requestedThemeId
        ? themes.themes.nodes.find(
            (candidate) =>
              candidate.id === requestedThemeId ||
              candidate.id.endsWith(`/${requestedThemeId}`),
          )
        : themes.themes.nodes.find((candidate) => candidate.role === "MAIN");
      if (!theme) {
        throw new ShopifyAdminRequestError("No published Shopify theme was found.");
      }
      themeId = theme.id;
      premiumStylesheet =
        (await readThemeFile(theme.id, "assets/ecoshopguide-premium.css")) ?? undefined;
      if (!premiumStylesheet) {
        premiumStylesheet = appendRatingCss("");
      }
    }

    const result = await syncVerifiedCollectiveRatings({
      themeId,
      premiumStylesheet,
      readThemeFile: themeId ? readThemeFile : undefined,
      upsertThemeFiles: themeId ? upsertThemeFiles : undefined,
    });

    response.status(200).json({ ok: true, ...result });
  } catch (error) {
    const message =
      error instanceof ShopifyAdminRequestError
        ? error.message
        : "Unable to sync verified product ratings.";
    response.status(503).json({ ok: false, error: message });
  }
}
