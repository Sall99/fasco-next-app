import useSWR from "swr";
import { fetcher, instance } from "@/config";

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
