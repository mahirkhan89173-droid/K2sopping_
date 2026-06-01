import { Product, Banner, StoreData, CartItem } from "./types";

const STORE_KEY = "k2_store_data";
const CART_KEY = "k2_cart";

const defaultData: StoreData = { products: [], banners: [] };

export function getStoreData(): StoreData {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultData;
    return JSON.parse(raw) as StoreData;
  } catch { return defaultData; }
}

export function saveStoreData(data: StoreData): void {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

export function addProduct(product: Product): void {
  const data = getStoreData();
  data.products.push(product);
  saveStoreData(data);
}

export function removeProduct(id: string): void {
  const data = getStoreData();
  data.products = data.products.filter((p) => p.id !== id);
  saveStoreData(data);
}

export function addBanner(banner: Banner): void {
  const data = getStoreData();
  data.banners.push(banner);
  saveStoreData(data);
}

export function removeBanner(id: string): void {
  const data = getStoreData();
  data.banners = data.banners.filter((b) => b.id !== id);
  saveStoreData(data);
}

export function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch { return []; }
}

export function saveCart(cart: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(product: Product): void {
  const cart = getCart();
  const existing = cart.find((c) => c.id === product.id);
  if (existing) { existing.quantity += 1; }
  else { cart.push({ ...product, quantity: 1 }); }
  saveCart(cart);
}

export function removeFromCart(id: string): void {
  saveCart(getCart().filter((c) => c.id !== id));
}

export function clearCart(): void { saveCart([]); }

export function getFinalPrice(product: Product): number {
  const afterDiscount = product.price - (product.price * product.discount) / 100;
  return afterDiscount + product.extraCharge;
}

export function buildWhatsAppMessage(items: CartItem[]): string {
  const lines = items.map((item) => {
    const final = getFinalPrice(item);
    return `• ${item.name} x${item.quantity} = ₹${(final * item.quantity).toFixed(0)}`;
  });
  const total = items.reduce((sum, i) => sum + getFinalPrice(i) * i.quantity, 0);
  return `*K² Clothes Order*\n\n${lines.join("\n")}\n\n*Total: ₹${total.toFixed(0)}*\n\nPlease confirm my order.`;
}

export function openWhatsApp(message: string): void {
  const phone = "919950701758";
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
}
