export interface ShopifyMoney { amount: string; currencyCode: string }
export interface ShopifyImage { url: string; altText?: string; width?: number; height?: number }
export interface ShopifyReview { rating: number; count: number }
export interface ShopifyOption { name: string; values: string[] }
export interface ShopifyVariant {
  id: string; title: string; availableForSale: boolean; price: ShopifyMoney;
  selectedOptions: Array<{ name: string; value: string }>; image?: ShopifyImage;
}
export interface ShopifyProduct {
  id: string; handle: string; title: string; description: string; descriptionHtml: string;
  availableForSale: boolean; featuredImage?: ShopifyImage; images: ShopifyImage[];
  price: ShopifyMoney; options: ShopifyOption[]; variants: ShopifyVariant[]; review?: ShopifyReview;
}
export interface ShopifyCollection { id: string; handle: string; title: string; description: string; image?: ShopifyImage; products: ShopifyProduct[] }
export interface ShopifyCartLine { id: string; quantity: number; merchandise: ShopifyVariant & { product: Pick<ShopifyProduct, "id" | "handle" | "title" | "featuredImage"> }; cost: { totalAmount: ShopifyMoney } }
export interface ShopifyCart { checkoutUrl: string; totalQuantity: number; lines: ShopifyCartLine[]; cost: { subtotalAmount: ShopifyMoney; totalAmount: ShopifyMoney } }
export interface ApiError { error: string }
