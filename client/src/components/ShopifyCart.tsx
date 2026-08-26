import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import { MapPin, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck } from "lucide-react";
import type { ShopifyCart, ShopifyVariant, SupportedCollectionHandle } from "@shared/shopify";
import { collectAttribution, formatMoney } from "@/lib/shopify-ui";
import { ecoTrack } from "@/lib/analytics";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

async function cartRequest(path: string, method = "GET", body?: unknown): Promise<ShopifyCart | null> {
  const response = await fetch(path, {
    method,
    credentials: "same-origin",
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Cart request failed.");
  return data;
}

function attribution() {
  return collectAttribution(window.location.search, window.location.pathname, sessionStorage);
}

interface CartValue {
  cart?: ShopifyCart;
  loading: boolean;
  error?: string;
  open: boolean;
  setOpen(value: boolean): void;
  refresh(): Promise<void>;
  add(variant: ShopifyVariant, product: { id: string; title: string; collection?: SupportedCollectionHandle }): Promise<void>;
  update(lineId: string, quantity: number): Promise<void>;
  remove(lineId: string): Promise<void>;
  checkout(): Promise<void>;
}

const CartContext = createContext<CartValue | null>(null);

export function useShopifyCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("Cart provider missing");
  return value;
}

export function ShopifyCartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [open, setOpen] = useState(false);

  async function refresh() {
    collectAttribution(window.location.search, window.location.pathname, sessionStorage);
    setLoading(true);
    setError(undefined);
    try {
      const next = await cartRequest("/api/shopify/cart");
      setCart(next || undefined);
    } catch {
      setError("We couldn’t load your cart. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void refresh(); }, []);

  async function mutate(path: string, method: string, body: unknown) {
    setLoading(true);
    setError(undefined);
    try {
      const next = await cartRequest(path, method, body);
      setCart(next || undefined);
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Cart request failed.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function add(variant: ShopifyVariant, product: { id: string; title: string; collection?: SupportedCollectionHandle }) {
    const added = await mutate("/api/shopify/cart/lines", "POST", {
      variantId: variant.id,
      quantity: 1,
      attribution: attribution(),
    });
    if (!added) return;
    setOpen(true);
    ecoTrack("add_to_cart", {
      value: Number(variant.price.amount),
      currency: variant.price.currencyCode,
      ...(product.collection ? { collection: product.collection } : {}),
      items: [{ item_id: variant.id, item_name: product.title, item_variant: variant.title, price: Number(variant.price.amount), quantity: 1, shopify_product_id: product.id }],
    });
  }

  async function checkout() {
    if (!cart) return;
    setLoading(true);
    setError(undefined);
    try {
      const response = await fetch("/api/shopify/cart/checkout", {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ attribution: attribution() }),
      });
      const data = await response.json();
      if (!response.ok || !data.checkoutUrl || !data.cart) throw new Error(data.error || "Checkout is unavailable.");
      const checkoutCart = data.cart as ShopifyCart;
      ecoTrack("begin_checkout", {
        value: Number(checkoutCart.cost.subtotalAmount.amount),
        currency: checkoutCart.cost.subtotalAmount.currencyCode,
        items: checkoutCart.lines.map((line) => ({ item_id: line.merchandise.id, item_name: line.merchandise.product.title, item_variant: line.merchandise.title, price: Number(line.merchandise.price.amount), quantity: line.quantity, shopify_product_id: line.merchandise.product.id })),
      });
      window.location.assign(data.checkoutUrl);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Checkout is unavailable.");
    } finally {
      setLoading(false);
    }
  }

  const value: CartValue = {
    cart,
    loading,
    error,
    open,
    setOpen,
    refresh,
    add,
    update: async (lineId, quantity) => { await mutate("/api/shopify/cart/lines", "PATCH", { lineId, quantity }); },
    remove: async (lineId) => { await mutate("/api/shopify/cart/lines", "DELETE", { lineId }); },
    checkout,
  };

  return <CartContext.Provider value={value}>{children}<CartDrawer /></CartContext.Provider>;
}

function CartDrawer() {
  const { cart, loading, error, open, setOpen, refresh, update, remove, checkout } = useShopifyCart();
  const [location] = useLocation();
  const showButton = Boolean(cart?.totalQuantity)
    || location.startsWith("/shop-the-look/")
    || location.startsWith("/collections/")
    || location.startsWith("/products/");

  return <>
    {showButton && <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={`Open cart, ${cart?.totalQuantity ?? 0} items`}
      className="fixed right-4 bottom-4 z-40 min-h-11 rounded-full bg-[#294b3a] px-4 text-white shadow-xl flex items-center gap-2"
    >
      <ShoppingBag className="w-5 h-5" aria-hidden="true" />
      <span className="font-semibold">{cart?.totalQuantity ?? 0}</span>
    </button>}
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full max-w-md bg-[#fffdf9] overflow-y-auto">
        <SheetHeader className="border-b pb-4 text-left">
          <SheetTitle className="font-serif text-2xl">Your cart</SheetTitle>
          <SheetDescription>Review your items before continuing to Shopify checkout.</SheetDescription>
        </SheetHeader>
        {loading && <p role="status" className="py-4">Updating your cart…</p>}
        {error && <div role="alert" className="py-3 text-red-700"><p>{error}</p><button type="button" className="mt-2 min-h-11 underline" onClick={() => void refresh()}>Try again</button></div>}
        {!cart?.lines.length && !loading
          ? <p className="py-10 text-center text-muted-foreground">Your cart is empty.</p>
          : <div className="divide-y">{cart?.lines.map((line) => <div key={line.id} className="py-4 flex gap-3">
            <img
              src={line.merchandise.image?.url || line.merchandise.product.featuredImage?.url || "/placeholder-product.svg"}
              alt={line.merchandise.image?.altText || line.merchandise.product.title}
              className="w-20 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <p className="font-semibold">{line.merchandise.product.title}</p>
              {line.merchandise.title !== "Default Title" && <p className="text-sm text-muted-foreground">{line.merchandise.title}</p>}
              <p className="mt-1">{formatMoney(line.cost.totalAmount)}</p>
              <div className="flex items-center gap-1 mt-2">
                <button className="min-w-11 min-h-11 grid place-items-center" disabled={loading || line.quantity <= 1} onClick={() => void update(line.id, line.quantity - 1)} aria-label="Decrease quantity"><Minus className="w-4" /></button>
                <span className="min-w-8 text-center" aria-label="Quantity">{line.quantity}</span>
                <button className="min-w-11 min-h-11 grid place-items-center" disabled={loading || line.quantity >= 100} onClick={() => void update(line.id, line.quantity + 1)} aria-label="Increase quantity"><Plus className="w-4" /></button>
                <button className="ml-auto min-w-11 min-h-11 grid place-items-center" disabled={loading} onClick={() => void remove(line.id)} aria-label={`Remove ${line.merchandise.product.title}`}><Trash2 className="w-4" /></button>
              </div>
            </div>
          </div>)}</div>}
        {cart?.lines.length ? <div className="border-t pt-5 mt-3">
          <div className="flex justify-between font-semibold text-lg"><span>Subtotal</span><span>{formatMoney(cart.cost.subtotalAmount)}</span></div>
          <p className="text-xs text-muted-foreground mt-1">Taxes and shipping are calculated during checkout.</p>
          <div className="mt-4 space-y-2 rounded-lg bg-[#f4f0e7] p-3 text-xs text-[#435047]">
            <p className="flex gap-2"><Truck className="h-4 w-4 shrink-0 text-[#294b3a]" aria-hidden="true"/>Delivery options and expected arrival are confirmed for your address at checkout.</p>
            <p className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-[#294b3a]" aria-hidden="true"/>Items ship directly from our curated brand partners.</p>
            <p className="flex gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-[#294b3a]" aria-hidden="true"/>Secure payment and live inventory verification through Shopify.</p>
          </div>
          <button disabled={loading} onClick={() => void checkout()} className="mt-4 w-full rounded-full bg-[#294b3a] text-white py-3.5 font-semibold disabled:opacity-50">Continue to secure checkout</button>
        </div> : null}
      </SheetContent>
    </Sheet>
  </>;
}
