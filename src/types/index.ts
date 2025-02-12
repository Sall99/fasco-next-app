import { CartItem } from "@/store/slices/cart";

export type ProductType = {
  id: string;
  name: string;
  brand: string;
  price: number;
  viewersCount: number;
  category: string;
  rating: {
    average: number;
    reviewsCount: number;
  };
  stock: {
    quantity: number;
    lowStockThreshold: number;
  };
  isAlmostSoldOut: boolean;
  tags: string[];
  images: string[];
  description: string;
};

export type SignupFormData = {
  fName: string;
  lName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export interface CreatePaymentIntentPayload {
  amount: number;
  shipping: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    country: string;
    zipCode: string;
  };
  cartItems: CartItem[];
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image: string;
}
export interface MinimalCartItem {
  id: string;
  qty: number;
  price: number;
}
