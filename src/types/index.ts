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

type DistributionItem = {
  id: string;
  name: string;
  slug?: string;
  count: number;
};

export type CategoriesType = {
  total: number;
  distribution: DistributionItem[];
};

export type OrderType = {
  id: string;
  totalAmount: number;
  itemsCount: number;
  status: string;
  currency: string;
  paymentIntentId: string;
  failureReason: string | null;
  createdAt: Date;
  updatedAt: Date;
  User: {
    id: string;
    name: string | null;
    email: string | null;
    phoneNumber: string | null;
  };
  OrderItem: {
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      brand: string;
      images: string[];
      category: {
        name: string;
        slug: string;
      };
    };
  }[];
  Shipping: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
    email: string;
  }[];

  customer: {
    id: string;
    email: string;
    name: string;
  };
};

export type CustomerType = {
  id: string;
  name: string | null;
  email: string | null;
  phoneNumber: string | null;
  image: string | null;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  orders: {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: Date;
    OrderItem: {
      quantity: number;
      price: number;
      product: {
        name: string;
      };
    }[];
  }[];
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
    items: OrderType[];
    totalRevenue: number;
  };
  customers: {
    total: number;
    new: number;
    data: CustomerType[];
  };
};
