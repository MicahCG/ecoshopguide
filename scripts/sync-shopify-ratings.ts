import { readFileSync } from "node:fs";
import { isShopifyAdminConfigured } from "../server/shopify-admin.js";
import { syncVerifiedCollectiveRatings } from "../server/shopify-ratings-sync.js";
import { shopifyAdminRequest } from "../server/shopify-admin.js";

function loadEnv(path: string) {
  try {
    for (const line of readFileSync(path, "utf8").split("\n")) {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (!match) continue;
      let value = match[2].trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      process.env[match[1]] ??= value;
    }
  } catch {
    // optional env files
  }
}

loadEnv(".env.local");
loadEnv(".env");

async function readThemeFile(themeId: string, filename: string) {
  const data = await shopifyAdminRequest<{
    theme: { files: { nodes: Array<{ body?: { content?: string } | null }> } | null } | null;
  }>(
    `query ThemeFile($themeId: ID!, $filenames: [String!]!) {
      theme(id: $themeId) {
        files(filenames: $filenames) {
          nodes { body { ... on OnlineStoreThemeFileBodyText { content } } }
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
    `mutation UpsertThemeFiles($themeId: ID!, $files: [OnlineStoreThemeFilesUpsertFileInput!]!) {
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
  if (result.themeFilesUpsert.userErrors.length) {
    throw new Error(result.themeFilesUpsert.userErrors.map((error) => error.message).join(" "));
  }
  return result.themeFilesUpsert.upsertedThemeFiles.map((file) => file.filename);
}

async function main() {
  if (!isShopifyAdminConfigured()) {
    console.error("Shopify Admin API credentials are not configured.");
    process.exit(1);
  }

  const themes = await shopifyAdminRequest<{ themes: { nodes: Array<{ id: string; role: string }> } }>(
    "query { themes(first: 20) { nodes { id role } } }",
  );
  const theme = themes.themes.nodes.find((candidate) => candidate.role === "MAIN");
  if (!theme) throw new Error("No published theme found.");

  const premiumStylesheet =
    (await readThemeFile(theme.id, "assets/ecoshopguide-premium.css")) ?? "";

  const result = await syncVerifiedCollectiveRatings({
    themeId: theme.id,
    premiumStylesheet,
    readThemeFile,
    upsertThemeFiles,
  });

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
