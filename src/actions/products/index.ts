import useSWR from "swr";
import { fetcher, instance } from "@/config";
import { ProductType } from "@/types";

interface ProductsResponse {
  products: ProductType[];
  total: number;
  page: number;
  pages: number;
}

interface UseProductsParams {
  page?: number;
  limit?: number;
  query?: string;
  categoryId?: string;
  brand?: string[];
  priceRange?: [number, number];
  sortBy?: string;
  search?: boolean;
}

export function useProducts({
  page = 1,
  limit = 12,
  query = "",
  categoryId,
  brand,
  priceRange,
  sortBy = "featured",
  search = false,
}: UseProductsParams = {}) {
  const params = new URLSearchParams();

  params.set("page", page.toString());
  params.set("limit", limit.toString());

  if (query) {
    params.set("query", query);
  }

  if (categoryId) {
    params.set("category", categoryId);
  }

  if (brand && brand.length > 0) {
    brand.forEach((b) => params.append("brand", b));
  }

  if (priceRange) {
    const [min, max] = priceRange;
    if (min > 0) params.set("minPrice", min.toString());
    if (max < 1000) params.set("maxPrice", max.toString());
  }

  params.set("sortBy", sortBy);

  const endpoint = search
    ? "/products/search"
    : `/products/search?page=${page}&limit=${limit}`;
  const url = `${endpoint}?${params.toString()}`;

  const { data, error, isLoading, isValidating, mutate } =
    useSWR<ProductsResponse>(url, fetcher);

  return {
    products: data?.products || [],
    total: data?.total || 0,
    isLoading,
    isError: error,
    isValidating,
    mutate,
  };
}

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

export const useGetProductReviews = (
  productId: string,
  page: number,
  limit: number,
) => {
  const { data, error } = useSWR(
    `/products/product/${productId}/reviews?page=${page}&limit=${limit}`,
    fetcher,
  );
  return {
    reviews: data?.reviews,
    pagination: data?.pagination,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useCreateReview = async (
  productId: string,
  score: number,
  title: string,
  comment: string,
  pros: string[],
  cons: string[],
) => {
  const { data } = await instance.post(
    `/products/product/${productId}/reviews/create`,
    {
      score,
      title,
      comment,
      pros,
      cons,
    },
  );

  return data;
};

export const useHelpfulVote = async (reviewId: string, isHelpful: boolean) => {
  const { data } = await instance.post(`/reviews/${reviewId}/helpful`, {
    isHelpful,
  });

  return data;
};

export const useGetHelpfulVote = (reviewId: string) => {
  const { data, error } = useSWR(`/reviews/${reviewId}/get-helpful`, fetcher);
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useGetHelpfulVotes = (reviewIds: string[]) => {
  const shouldFetch = reviewIds && reviewIds.length > 0;

  const queryString = shouldFetch
    ? `/helpful-votes?reviewIds=${reviewIds.join(",")}`
    : null;

  const { data, error } = useSWR(queryString, fetcher);

  return {
    data: data?.votes || [],
    isLoading: shouldFetch && !error && !data,
    isError: error,
  };
};
