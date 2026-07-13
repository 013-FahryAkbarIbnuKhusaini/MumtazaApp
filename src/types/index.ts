export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  images: string[];
  purity?: string;
  weight?: string;
  isBestSeller?: boolean;
  isNew?: boolean;
}
export interface CartItem {
  product: Product;
  quantity: number;
}
export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'placed' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}
