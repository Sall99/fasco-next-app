import React from "react";
import { Input, Typography, Button } from "@/components";
import { FcGoogle } from "react-icons/fc";
import { VscGithubInverted } from "react-icons/vsc";
import Link from "next/link";

type InputType = "text" | "email" | "password" | "tel";

const formFields: Array<{
  name: string;
  label: string;
  placeholder: string;
  type: InputType;
  multiline: boolean;
}> = [
  {
    name: "fName",
    label: "First Name",
    placeholder: "First Name",
    type: "text",
    multiline: false,
  },
  {
    name: "lName",
    label: "Last Name",
    placeholder: "Last Name",
    type: "text",
    multiline: false,
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Email Address",
    type: "email",
    multiline: false,
  },
  {
    name: "phone",
    label: "Phone Number",
    placeholder: "Phone Number",
    type: "tel",
    multiline: false,
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Password",
    type: "password",
    multiline: false,
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    placeholder: "Confirm Password",
    type: "password",
    multiline: false,
  },
];

export function SignupForm() {
  return (
    <div className="w-full">
      <Typography variant="h2" font="primary">
        FASCO
      </Typography>

      <div className="mt-6">
        <Typography variant="h5" font="primary" className="mb-7">
          Create Account
        </Typography>

        <div className="mb-5 flex flex-col gap-5 xl:flex-row">
          <Button variant="outline" fullWidth leftIcon={<FcGoogle size={20} />}>
            <Typography variant="p-16" font="default">
              Sign up with Google
            </Typography>
          </Button>
          <Button
            variant="outline"
            fullWidth
            leftIcon={<VscGithubInverted size={20} />}
          >
            <Typography variant="p-16" font="default">
              Sign up with Github
            </Typography>
          </Button>
        </div>
        <div className="m-auto mb-5 w-14">
          <div className="or-container">
            <span className="line"></span>
            <span className="or-text font-poppins">OR</span>
            <span className="line"></span>
          </div>
        </div>
      </div>

      <form>
        <div className="grid gap-4 xl:grid-cols-2">
          {formFields.map(({ name, type, placeholder }, key) => (
            <Input
              key={key}
              name={name}
              type={type}
              placeholder={placeholder}
            />
          ))}
        </div>

        <div className="mt-10 px-10">
          <Button fullWidth>
            <Typography color="white" variant="p-16" font="default">
              Create Account
            </Typography>
          </Button>
        </div>
      </form>
      <Typography variant="p-12" alignment="center" className="mt-5">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-blue-500 underline">
          Login
        </Link>
      </Typography>

      <Typography variant="p-12" alignment="right" className="mt-10 lg:mt-0">
        <Link href="/terms-conditions">FASCO Terms & Codnitions</Link>
      </Typography>
    </div>
  );
}
