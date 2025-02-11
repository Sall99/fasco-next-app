"use client";
import React, { useState } from "react";
import {
  useForm,
  SubmitHandler,
  FieldErrors,
  FieldValues,
  UseFormRegister,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { addressSchema, profileSchema } from "@/constants";
import { Button, Typography } from "@/components";
import { Menu } from "lucide-react";

type Tab = "dashboard" | "orders" | "addresses" | "account" | "wishlist";
type Address = yup.InferType<typeof addressSchema>;
type Profile = yup.InferType<typeof profileSchema>;
type Order = {
  id: number;
  date: string;
  total: number;
  status: string;
};

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [orders] = useState<Order[]>([
    { id: 1, date: "2023-01-15", total: 99.99, status: "Delivered" },
    { id: 2, date: "2023-02-20", total: 149.99, status: "Processing" },
  ]);

  const {
    register: profileRegister,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm<Profile>({
    resolver: yupResolver(profileSchema),
    mode: "onBlur",
  });

  const {
    register: addressRegister,
    handleSubmit: handleAddressSubmit,
    formState: { errors: addressErrors, isSubmitting: isAddressSubmitting },
    reset: resetAddressForm,
  } = useForm<Address>({
    resolver: yupResolver(addressSchema),
    mode: "onBlur",
  });

  const handleProfileUpdate: SubmitHandler<Profile> = (data) => {
    console.log("Profile updated:", data);
  };

  const handleAddAddress: SubmitHandler<Address> = (data) => {
    setAddresses([...addresses, data]);
    resetAddressForm();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-4">
            <Typography variant="h6">Recent Activity</Typography>
            <div className="rounded-lg bg-white p-4 shadow">
              <Typography variant="p-16">
                Welcome back! You have {orders.length} recent orders.
              </Typography>
            </div>
          </div>
        );
      case "orders":
        return (
          <div className="space-y-4">
            <Typography variant="h6">Order History</Typography>
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
              {orders.map((order) => (
                <div key={order.id} className="rounded-lg bg-white p-4 shadow">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span>Order #{order.id}</span>
                    <span>${order.total}</span>
                  </div>
                  <div className="mt-2 flex flex-col text-sm text-gray-500 sm:flex-row sm:justify-between">
                    <span>{order.date}</span>
                    <span>{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "addresses":
        return (
          <div className="space-y-6">
            <Typography variant="h6">Saved Addresses</Typography>
            <form
              onSubmit={handleAddressSubmit(handleAddAddress)}
              className="space-y-4"
            >
              <AddressForm register={addressRegister} errors={addressErrors} />
              <Button type="submit" disabled={isAddressSubmitting}>
                Add Address
              </Button>
            </form>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
              {addresses.map((address, index) => (
                <AddressCard key={index} address={address} />
              ))}
            </div>
          </div>
        );
      case "account":
        return (
          <form
            onSubmit={handleProfileSubmit(handleProfileUpdate)}
            className="space-y-4"
          >
            <ProfileForm register={profileRegister} errors={profileErrors} />
            <Button type="submit" disabled={isProfileSubmitting}>
              Update Profile
            </Button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 pt-10">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed left-4 top-4 z-50 rounded-md bg-white p-2 shadow-lg lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-4xl">
            <Typography
              variant="h4"
              className="mb-6 text-xl font-bold sm:text-2xl"
            >
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </Typography>
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
}: {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => (
  <div
    className={`fixed left-0 top-0 z-40 h-screen w-64 transform bg-white p-4 pt-20 shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    }`}
  >
    <h2 className="mb-4 text-lg font-semibold">My Account</h2>
    <nav>
      <ul className="space-y-2">
        {["dashboard", "orders", "addresses", "account"].map((tab) => (
          <li key={tab}>
            <button
              onClick={() => {
                setActiveTab(tab as Tab);
                setIsOpen(false);
              }}
              className={`w-full rounded-md px-4 py-2 text-left ${
                activeTab === tab
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  </div>
);

const AddressCard = ({ address }: { address: Address }) => (
  <div className="rounded-lg bg-white p-4 shadow">
    <p>{address.street}</p>
    <p>
      {address.city}, {address.state} {address.zipCode}
    </p>
    <p>{address.country}</p>
  </div>
);

interface FormProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

const AddressForm: React.FC<FormProps<Address>> = ({ register, errors }) => (
  <div className="grid gap-4 sm:grid-cols-2">
    {Object.keys(addressSchema.fields).map((field) => (
      <Input
        key={field}
        label={field}
        {...register(field as keyof Address)}
        error={errors[field as keyof Address]?.message}
      />
    ))}
  </div>
);

const ProfileForm: React.FC<FormProps<Profile>> = ({ register, errors }) => (
  <div className="grid gap-4 sm:grid-cols-2">
    {Object.keys(profileSchema.fields).map((field) => (
      <Input
        key={field}
        label={field}
        {...register(field as keyof Profile)}
        error={errors[field as keyof Profile]?.message}
      />
    ))}
  </div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  const formattedLabel = label
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());

  return (
    <div>
      <label className="mb-2 block font-poppins text-sm font-medium text-gray-700">
        {formattedLabel}
      </label>
      <input
        {...props}
        className={`w-full rounded border p-2 focus:border-blue-500 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && (
        <Typography variant="p-12" className="mt-1 block text-sm text-red-500">
          {error}
        </Typography>
      )}
    </div>
  );
};

export default ProfilePage;
