import useSWR from "swr";
import { fetcher } from "@/config";
import { DashboardOverview } from "@/types";

export const useOverview = () => {
  const { data, error, isValidating, mutate } = useSWR<DashboardOverview>(
    "/admin/dashboard/overview",
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 30000,
    },
  );

  return {
    overview: data,
    isLoading: !error && !data,
    isError: error,
    isValidating,
    mutate,
  };
};

export const useProductStats = () => {
  const { overview, ...rest } = useOverview();
  return {
    productStats: overview?.products,
    ...rest,
  };
};

export const useCategoryStats = () => {
  const { overview, ...rest } = useOverview();
  return {
    categoryStats: overview?.categories,
    ...rest,
  };
};

export const useOrderStats = () => {
  const { overview, ...rest } = useOverview();
  return {
    orderStats: overview?.orders,
    ...rest,
  };
};

export const useCustomerStats = () => {
  const { overview, ...rest } = useOverview();
  return {
    customerStats: overview?.customers,
    ...rest,
  };
};
export const useDashboardProducts = () => {
  const { overview, ...rest } = useOverview();
  return {
    products: overview?.products.allProducts,
    ...rest,
  };
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};
