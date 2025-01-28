import useSWR from "swr";
import { instance } from "@/config";

const fetcher = (url: string) => instance.get(url).then((res) => res.data);

export const useProducts = (count: number) => {
  const { data, error } = useSWR(`/products?count=${count}`, fetcher);
  return {
    products: data,
    isLoading: !error && !data,
    isError: error,
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
  const { data, error } = useSWR(`/products/product/${id}`, fetcher);
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};
