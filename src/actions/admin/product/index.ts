import { instance } from "@/config";
import { CreateProductRequestInterface } from "@/types";

export const useCreateProduct = async (
  values: CreateProductRequestInterface,
) => {
  const { data } = await instance.post(`/admin/product/create`, values);

  return data;
};

export const useUpdateProduct = async (
  values: CreateProductRequestInterface,
  productId: string | undefined,
) => {
  const { data } = await instance.post(`/admin/product/update`, {
    ...values,
    id: productId,
  });

  return data;
};

export const useDeleProduct = async (productId: string | undefined) => {
  const { data } = await instance.post(`/admin/product/delete`, {
    id: productId || "",
  });

  return data;
};
