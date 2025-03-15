"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../card";
import {
  FieldErrors,
  FieldValues,
  SubmitHandler,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "../button";
import { Label } from "../label";
import { Input } from "../input";
import { Loader2, Edit } from "lucide-react";
import { useAuthType, useProfile } from "@/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../dialog";
import { passwordSchema } from "@/constants";

const nameSchema = yup.object({
  name: yup.string().required("Name is required"),
});

interface FormProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  onClose?: () => void;
}

type PasswordFormData = yup.InferType<typeof passwordSchema>;
type NameFormData = yup.InferType<typeof nameSchema>;

export const AccountTab = () => {
  const { isOAuthUser } = useAuthType();
  const { userData, isLoading, updateProfile } = useProfile();
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const {
    register: passwordRegister,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    reset: resetPasswordForm,
  } = useForm<PasswordFormData>({
    resolver: yupResolver(passwordSchema),
    mode: "onBlur",
    defaultValues: {
      name: userData?.name || "",
    },
  });

  const {
    register: nameRegister,
    handleSubmit: handleNameSubmit,
    formState: { errors: nameErrors, isSubmitting: isNameSubmitting },
    reset: resetNameForm,
  } = useForm<NameFormData>({
    resolver: yupResolver(nameSchema),
    mode: "onBlur",
    defaultValues: {
      name: userData?.name || "",
    },
  });

  useEffect(() => {
    if (userData) {
      resetNameForm({ name: userData.name });
      resetPasswordForm({
        name: userData.name,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [userData, resetNameForm, resetPasswordForm]);

  const handlePasswordUpdate: SubmitHandler<PasswordFormData> = async (
    data,
  ) => {
    try {
      await updateProfile(data.name, data.currentPassword, data.newPassword);
      setIsPasswordModalOpen(false);
      resetPasswordForm({
        name: userData?.name || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  const handleNameUpdate: SubmitHandler<NameFormData> = async (data) => {
    try {
      await updateProfile(data.name);
      setIsNameModalOpen(false);
      resetNameForm();
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

  if (isLoading || isOAuthUser === null) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            View and manage your account details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Name
                </p>
                <p className="text-base">{userData?.name || "Not set"}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  resetNameForm({ name: userData?.name || "" });
                  setIsNameModalOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" /> Modify
              </Button>
            </div>

            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-base">{userData?.email || "Not set"}</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Member Since
                </p>
                <p className="text-base">
                  {userData?.createdAt
                    ? new Date(userData.createdAt).toLocaleDateString()
                    : "Not available"}
                </p>
              </div>
            </div>

            {!isOAuthUser && (
              <div className="flex items-center justify-between pb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Password
                  </p>
                  <p className="text-base">••••••••</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    resetPasswordForm({
                      name: userData?.name || "",
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                    setIsPasswordModalOpen(true);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" /> Change
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isNameModalOpen} onOpenChange={setIsNameModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Name</DialogTitle>
            <DialogDescription>Change your display name</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleNameSubmit(handleNameUpdate)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                {...nameRegister("name")}
                className={nameErrors.name ? "border-destructive" : ""}
              />
              {nameErrors.name && (
                <p className="text-xs text-destructive">
                  {nameErrors.name.message}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsNameModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isNameSubmitting}>
                {isNameSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Name
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {!isOAuthUser && (
        <Dialog
          open={isPasswordModalOpen}
          onOpenChange={setIsPasswordModalOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Update your account password
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={handlePasswordSubmit(handlePasswordUpdate)}
              className="space-y-4"
            >
              <PasswordForm
                register={passwordRegister}
                errors={passwordErrors}
                onClose={() => setIsPasswordModalOpen(false)}
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsPasswordModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPasswordSubmitting}>
                  {isPasswordSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update Password
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

const PasswordForm: React.FC<FormProps<PasswordFormData>> = ({
  register,
  errors,
}) => (
  <div className="grid gap-4">
    <div className="space-y-2">
      <Label htmlFor="name">Name</Label>
      <Input
        id="name"
        type="text"
        {...register("name")}
        className={errors.name ? "border-destructive" : ""}
      />
      {errors.name && (
        <p className="text-xs text-destructive">{errors.name.message}</p>
      )}
    </div>
    <div className="space-y-2">
      <Label htmlFor="currentPassword">Current Password</Label>
      <Input
        id="currentPassword"
        type="password"
        {...register("currentPassword")}
        className={errors.currentPassword ? "border-destructive" : ""}
      />
      {errors.currentPassword && (
        <p className="text-xs text-destructive">
          {errors.currentPassword.message}
        </p>
      )}
    </div>
    <div className="space-y-2">
      <Label htmlFor="newPassword">New Password</Label>
      <Input
        id="newPassword"
        type="password"
        {...register("newPassword")}
        className={errors.newPassword ? "border-destructive" : ""}
      />
      {errors.newPassword && (
        <p className="text-xs text-destructive">{errors.newPassword.message}</p>
      )}
    </div>
    <div className="space-y-2">
      <Label htmlFor="confirmPassword">Confirm Password</Label>
      <Input
        id="confirmPassword"
        type="password"
        {...register("confirmPassword")}
        className={errors.confirmPassword ? "border-destructive" : ""}
      />
      {errors.confirmPassword && (
        <p className="text-xs text-destructive">
          {errors.confirmPassword.message}
        </p>
      )}
    </div>
  </div>
);
