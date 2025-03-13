"use client";
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  SubmitHandler,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../card";
import { Button } from "../button";
import { addressSchema } from "@/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Label } from "../label";
import { Input } from "../input";
import { useAddresses, Address } from "@/actions/users";
import { Checkbox } from "../checkbox";
import { Loader2, Trash2, PencilLine } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../dialog";

interface FormProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  control: Control<T>;
}
type AddressFormData = Omit<Address, "id" | "createdAt" | "updatedAt">;

export const AddressTab = () => {
  const { addresses, isLoading, createAddress, updateAddress, deleteAddress } =
    useAddresses();
  const [isEditing, setIsEditing] = useState(false);
  const [currentAddressId, setCurrentAddressId] = useState<string | null>(null);

  const {
    register: addressRegister,
    handleSubmit: handleAddressSubmit,
    formState: { errors: addressErrors, isSubmitting: isAddressSubmitting },
    reset: resetAddressForm,
    setValue,
    control,
  } = useForm<AddressFormData>({
    resolver: yupResolver(addressSchema),
    mode: "onBlur",
  });

  const handleAddAddress: SubmitHandler<AddressFormData> = async (data) => {
    try {
      if (isEditing && currentAddressId) {
        await updateAddress(currentAddressId, data);

        setIsEditing(false);
        setCurrentAddressId(null);
      } else {
        await createAddress(data);
      }
      resetAddressForm();
    } catch (error) {
      console.error("Error handling address:", error);
    }
  };

  const handleEditAddress = (address: Address) => {
    setIsEditing(true);
    setCurrentAddressId(address.id);

    Object.keys(addressSchema.fields).forEach((field) => {
      setValue(field as keyof AddressFormData, address[field as keyof Address]);
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentAddressId(null);
    resetAddressForm();
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await deleteAddress(id);
      if (currentAddressId === id) {
        setIsEditing(false);
        setCurrentAddressId(null);
        resetAddressForm();
      }
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? "Edit Address" : "Add New Address"}
          </CardTitle>
          <CardDescription>
            {isEditing
              ? "Update your delivery address details"
              : "Enter your delivery address details"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleAddressSubmit(handleAddAddress)}
            className="space-y-4"
          >
            <AddressForm
              register={addressRegister}
              errors={addressErrors}
              control={control}
            />
            <div className="flex space-x-4">
              <Button type="submit" disabled={isAddressSubmitting}>
                {isAddressSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditing ? "Update Address" : "Add Address"}
              </Button>
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Saved Addresses</CardTitle>
          <CardDescription>Your delivery locations</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : addresses.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
              {addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  onEdit={() => handleEditAddress(address)}
                  onDelete={() => handleDeleteAddress(address.id)}
                />
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No saved addresses yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const AddressForm: React.FC<FormProps<AddressFormData>> = ({
  register,
  errors,
  control,
}) => (
  <div className="grid gap-4 sm:grid-cols-2">
    {Object.keys(addressSchema.fields).map((field) => {
      if (field === "isDefault") {
        return (
          <div
            key={field}
            className="flex items-center space-x-2 space-y-2 sm:col-span-2"
          >
            <Controller
              name="isDefault"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <div className="flex items-center space-x-2 sm:col-span-2">
                  <Checkbox
                    id="isDefault"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label
                    htmlFor="isDefault"
                    className="cursor-pointer text-sm font-medium leading-none"
                  >
                    Set as default address
                  </Label>
                </div>
              )}
            />
          </div>
        );
      }

      return (
        <div key={field} className="space-y-2">
          <Label htmlFor={field} className="capitalize">
            {field
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}
          </Label>
          <Input
            id={field}
            {...register(field as keyof AddressFormData)}
            className={
              errors[field as keyof AddressFormData] ? "border-destructive" : ""
            }
          />
          {errors[field as keyof AddressFormData] && (
            <p className="text-xs text-destructive">
              {errors[field as keyof AddressFormData]?.message}
            </p>
          )}
        </div>
      );
    })}
  </div>
);

const AddressCard = ({
  address,
  onEdit,
  onDelete,
}: {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <Card>
    <CardContent className="p-4">
      <div className="space-y-1">
        {address.isDefault && (
          <span className="mb-2 inline-block rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            Default
          </span>
        )}
        <p className="font-medium">{address.street}</p>
        <p className="text-sm">
          {address.city}, {address.state} {address.zipCode}
        </p>
        <p className="text-sm text-muted-foreground">{address.country}</p>
      </div>
      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="sm" className="w-full" onClick={onEdit}>
          <PencilLine className="mr-1 h-4 w-4" /> Edit
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-destructive hover:text-destructive"
            >
              <Trash2 className="mr-1 h-4 w-4" /> Delete
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Are you sure you want to delete this address?</p>
              <p className="mt-2 text-sm text-muted-foreground">
                This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="destructive" onClick={onDelete}>
                  Delete
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </CardContent>
  </Card>
);
