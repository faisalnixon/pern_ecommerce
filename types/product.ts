
export interface Rating {
  id: string;
  rating: number;
  review: string;
  userId: string;
  productId: string;
  orderId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Store {
  id: string;
  userId: string;
  name: string;
  description: string;
  username: string;
  address: string;
  status: string;
  isActive: boolean;
  logo: string;
  email: string;
  contact: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductWithRelations {
  id: string;
  name: string;
  description: string;
  mrp: number;
  price: number;
  images: string[];
  category: string;
  inStock: boolean;
  storeId: string;
  createdAt: string;
  updatedAt: string;

  rating: Rating[];
  store: Store;
}
