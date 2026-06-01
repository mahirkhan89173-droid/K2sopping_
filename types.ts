export interface Product {
  id: string;
  imageUrl: string;
  name: string;
  price: number;
  discount: number;
  extraCharge: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Banner {
  id: string;
  imageUrl: string;
  title: string;
}

export interface StoreData {
  products: Product[];
  banners: Banner[];
}
