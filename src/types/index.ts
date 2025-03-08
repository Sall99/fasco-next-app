import { CartItem } from "@/store/slices/cart";
import { z } from "zod";

export type SignupFormData = {
  fName: string;
  lName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image: string;
}
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
export interface MinimalCartItem {
  id: string;
  qty: number;
  price: number;
}

export type ProductType = {
  id: string;
  name: string;
  brand: string;
  price: number;
  viewersCount: number;
  isAlmostSoldOut: boolean;
  tags: string[];
  images: string[];
  description: string;
  category: {
    id: string;
    name: string;
    slug?: string;
  };
  rating: {
    average: number;
    reviewsCount: number;
  } | null;
  stock: {
    quantity: number;
    lowStockThreshold: number;
  } | null;
};

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    brand: string;
    image: string | null;
    category: {
      name: string;
      slug: string;
    };
  };
};

type ShippingInfo = {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
};

export type OrderType = {
  id: string;
  totalAmount: number;
  status: string;
  currency: string;
  paymentIntentId: string;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    name: string;
    email: string | null;
    phoneNumber: string | null;
  };
  items: OrderItem[];
  shipping: ShippingInfo | null;
  itemsCount: number;
  totalProducts: number;
};

export type CustomerType = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  image: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: Date | null;
  orders: Array<{
    id: string;
    totalAmount: number;
    status: string;
    createdAt: Date;
  }>;
};

export type DashboardOverview = {
  products: {
    total: number;
    lowStock: number;
    topViewed: Array<{
      id: string;
      name: string;
      viewersCount: number;
    }>;
    allProducts: ProductType[];
  };
  categories: {
    total: number;
    distribution: Array<{
      id: string;
      name: string;
      slug?: string;
      count: number;
    }>;
  };
  orders: {
    total: number;
    totalRevenue: number;
    items: OrderType[];
  };
  customers: {
    total: number;
    new: number;
    data: CustomerType[];
  };
};

type DistributionItem = {
  id: string;
  name: string;
  slug?: string;
  count: number;
};
export interface Review {
  id: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
  score: number;
  comment: string;
  title: string;
  pros: string[];
  cons: string[];
  createdAt: string;
}

export type CategoriesType = {
  total: number;
  distribution: DistributionItem[];
};

export interface CreateProductRequestInterface {
  name: string;
  brand: string;
  price: number;
  description: string;
  tags: string[];
  images: string[];
  category: {
    id: string;
    name: string;
    slug?: string;
  };
  stock: {
    quantity: number | null;
    lowStockThreshold: number | null;
  };
}

export const CreateCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Slug is required"),
});

export const UpdateCategorySchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
});

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;

export interface EmailRequest {
  to: string;
  subject: string;
  message: string;
}
