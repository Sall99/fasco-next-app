import { instance } from "@/config";
import { SignupFormData } from "@/types";

export const signupAction = async (values: SignupFormData) => {
  const { data } = await instance.post(`/auth/signup`, values);

  return data;
};
