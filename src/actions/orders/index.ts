import { fetcher, instance } from "@/config";
import useSWR from "swr";

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    images: string[];
    slug: string;
  };
}

export interface ShippingInfo {
  id: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
  email: string;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: "pending" | "processing" | "paid" | "failed" | "completed";
  paymentIntentId: string;
  currency: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
  OrderItem: OrderItem[];
  Shipping: ShippingInfo[];
}

export interface PaginatedResponse<T> {
  orders: Order[];
  data: T[];
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

export interface QueryParams {
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  startDate?: string;
  endDate?: string;
}

export const getOrders = async (
  params: QueryParams = {},
): Promise<PaginatedResponse<Order>> => {
  const { data } = await instance.get("/orders", { params });
  return data;
};

export const getOrder = async (orderId: string): Promise<Order> => {
  const { data } = await instance.get(`/orders/${orderId}`);
  return data;
};

export const useOrders = (params: QueryParams = {}) => {
  const queryString = new URLSearchParams(
    params as Record<string, string>,
  ).toString();

  return useSWR<PaginatedResponse<Order>>(
    `/api/orders?${queryString}`,
    () => getOrders(params),
    {
      revalidateOnFocus: false,
      refreshInterval: 30000,
    },
  );
};

export const useOrder = (orderId: string | null) => {
  return useSWR<Order>(
    orderId ? `/api/orders/${orderId}` : null,
    orderId ? () => getOrder(orderId) : null,
    {
      revalidateOnFocus: false,
    },
  );
};

export const getOrderStatusColor = (status: Order["status"]) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    paid: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    completed: "bg-purple-100 text-purple-800",
  };

  return statusColors[status] || "bg-gray-100 text-gray-800";
};

export const formatOrderDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatOrderAmount = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
};

export const useUserGetOrders = () => {
  const { data, error } = useSWR("/users/orders", fetcher);

  return {
    orders: data?.allOrders,
    recentOrders: data?.recentOrders,
    totalOrders: data?.totalOrders,
    recentOrdersCount: data?.recentOrdersCount,
    totalOrdersCount: data?.totalOrders,
    isLoading: !error && !data,
    isError: error,
  };
};
