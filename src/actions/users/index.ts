import useSWR, { mutate } from "swr";
import { fetcher, instance } from "@/config";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error-handlers";

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useAddresses() {
  const { data, error, isLoading } = useSWR<Address[]>(
    "/users/addresses",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  );

  const createAddress = async (
    addressData: Omit<Address, "id" | "createdAt" | "updatedAt">,
  ) => {
    try {
      const response = await instance.post(
        "/users/addresses/create",
        addressData,
      );

      await mutate("/users/addresses");
      toast.success("Address added successfully");
      return response.data;
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Failed to create address");
      toast.error(errorMessage);
      throw error;
    }
  };

  const updateAddress = async (id: string, addressData: Partial<Address>) => {
    try {
      const response = await instance.post(
        `/users/addresses/${id}/update`,
        addressData,
      );

      await mutate("/users/addresses");
      toast.success("Address updated successfully");
      return response.data;
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Failed to update address");
      toast.error(errorMessage);
      throw error;
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      await instance.post(`/users/addresses/${id}/delete`);

      await mutate("/users/addresses");
      toast.success("Address deleted successfully");
      return true;
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Failed to delete address");
      toast.error(errorMessage);
      throw error;
    }
  };

  return {
    addresses: data || [],
    isLoading,
    error,
    createAddress,
    updateAddress,
    deleteAddress,
  };
}
