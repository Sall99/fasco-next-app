import { instance } from "@/config";
import { SignupFormData } from "@/types";
import { getErrorMessage } from "@/utils/error-handlers";
import { toast } from "sonner";

export const signupAction = async (values: SignupFormData) => {
  const { data } = await instance.post(`/auth/signup`, values);

  return data;
};

export const useForgotPassword = async (email: string) => {
  try {
    const { data } = await instance.post("/auth/forgot-password", { email });
    toast.success(data.message);
    return data;
  } catch (error) {
    const errorMessage = getErrorMessage(error, "Failed to send the email");
    toast.error(errorMessage);
  }
};
