export interface ProductApi {
  id: number;
  tipe: string | null;
  name: string; // e.g., "Kalung", "Cincin", "gelang"
  berat: string; // weight
  karat: string; // purity
  type_id: number;
  code: string;
  image: string; // filename, e.g., "1773203795.jpeg"
  status: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  image: string;
  karat: string;
  berat: string;
  isBestSeller?: boolean;
  isNew?: boolean;
  size?: 'large' | 'small';
  badge?: 'BEST SELLER' | 'INVESTMENT' | 'NEW';
  isFavorited?: boolean;
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
