import useSWR from "swr";
import { instance } from "@/config";

export const fetcher = (url: string) =>
  instance.get(url).then((res) => res.data);

export const useProducts = (page: number, limit: number) => {
  const { data, error, isValidating } = useSWR(
    `/products?page=${page}&limit=${limit}`,
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

  return {
    products: data?.products,
    total: data?.total,
    isLoading: !error && !data,
    isError: error,
    isValidating,
  };
};

export const useProductsByCategory = (category: string, count: number) => {
  const { data, error } = useSWR(
    `/products/category?category=${category}&count=${count}`,
    fetcher,
  );
  return {
    products: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useGetProduct = (id: string) => {
  const { data, error } = useSWR(`/products/product?id=${id}`, fetcher);
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};
