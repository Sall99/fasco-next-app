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
import {
  Menu,
  Home,
  ShoppingBag,
  MapPin,
  User,
  Heart,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Tab =
  | "dashboard"
  | "orders"
  | "addresses"
  | "account"
  | "wishlist"
  | "logout";
type Address = yup.InferType<typeof addressSchema>;
type Profile = yup.InferType<typeof profileSchema>;
type Order = {
  id: number;
  date: string;
  total: number;
  status: string;
};

interface NavItem {
  id: Tab;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <Home className="h-5 w-5" />,
  },
  {
    id: "orders",
    label: "Orders",
    icon: <ShoppingBag className="h-5 w-5" />,
  },
  {
    id: "addresses",
    label: "Addresses",
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    id: "account",
    label: "Account",
    icon: <User className="h-5 w-5" />,
  },
  {
    id: "wishlist",
    label: "Wishlist",
    icon: <Heart className="h-5 w-5" />,
  },
  {
    id: "logout",
    label: "Logout",
    icon: <LogOut className="h-5 w-5" />,
  },
];

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
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
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Overview of your recent actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-poppins text-sm text-muted-foreground">
                  Welcome back! You have {orders.length} recent orders.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case "orders":
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>Your recent purchases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                  {orders.map((order) => (
                    <Card key={order.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">
                            Order #{order.id}
                          </CardTitle>
                          <Badge
                            variant={
                              order.status === "Delivered"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            <span className="font-poppins">{order.status}</span>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-poppins text-muted-foreground">
                            {order.date}
                          </span>
                          <span className="font-poppins font-medium">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button variant="outline" size="sm" className="w-full">
                          <span className="font-poppins">View Details</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "addresses":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Address</CardTitle>
                <CardDescription>
                  Enter your delivery address details
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
                  />
                  <Button type="submit" disabled={isAddressSubmitting}>
                    Add Address
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Saved Addresses</CardTitle>
                <CardDescription>Your delivery locations</CardDescription>
              </CardHeader>
              <CardContent>
                {addresses.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                    {addresses.map((address, index) => (
                      <AddressCard key={index} address={address} />
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

      case "account":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleProfileSubmit(handleProfileUpdate)}
                  className="space-y-4"
                >
                  <ProfileForm
                    register={profileRegister}
                    errors={profileErrors}
                  />
                  <Button type="submit" disabled={isProfileSubmitting}>
                    Update Profile
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        );

      case "wishlist":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Wishlist</CardTitle>
                <CardDescription>
                  Items you&apos;ve saved for later
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="py-12 text-center text-sm text-muted-foreground">
                  Your wishlist is empty
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case "logout":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Log Out</CardTitle>
              <CardDescription>Sign out of your account</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="mb-6 text-center">
                Are you sure you want to logout?
              </p>
              <Button
                variant="destructive"
                onClick={() => {
                  signOut();
                }}
              >
                Logout
              </Button>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                You will be redirected to the login page
              </p>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mt-10 flex min-h-screen bg-background">
      <aside
        className={cn(
          "hidden h-screen flex-col border-r bg-card transition-all duration-300 lg:flex",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        <div
          className={cn(
            "flex h-14 items-center border-b px-4",
            isCollapsed ? "justify-center" : "justify-between",
          )}
        >
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/profile.png" alt="Profile" />
                <AvatarFallback>UP</AvatarFallback>
              </Avatar>
              <span className="font-semibold">My Profile</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle sidebar"
            className="h-8 w-8"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="px-2 py-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;

              if (isCollapsed) {
                return (
                  <TooltipProvider key={item.id} delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          size="icon"
                          className="my-1 h-10 w-10"
                          onClick={() => setActiveTab(item.id)}
                        >
                          {item.icon}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="font-medium">
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              }

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className="my-1 w-full justify-start gap-2"
                  onClick={() => setActiveTab(item.id)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </div>
        </ScrollArea>

        {!isCollapsed && (
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/avatar.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">
                  john@example.com
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed left-4 top-4 z-50 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 pt-10">
          <div className="mb-8 flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/profile.png" alt="Profile" />
              <AvatarFallback>UP</AvatarFallback>
            </Avatar>
            <span className="font-poppins font-semibold">My Profile</span>
          </div>

          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-1 py-2">
              {NAV_ITEMS.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "secondary" : "ghost"}
                  className="my-1 w-full justify-start gap-2"
                  onClick={() => setActiveTab(item.id)}
                >
                  {item.icon}
                  <span className="font-poppins">{item.label}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>

          <div className="absolute bottom-4 left-4 right-4 border-t pt-4 font-poppins">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/avatar.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">
                  john@example.com
                </p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto">
          <h1 className="mb-6 font-poppins text-2xl font-semibold tracking-tight">
            {NAV_ITEMS.find((item) => item.id === activeTab)?.label}
          </h1>
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

interface FormProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

const AddressForm: React.FC<FormProps<Address>> = ({ register, errors }) => (
  <div className="grid gap-4 sm:grid-cols-2">
    {Object.keys(addressSchema.fields).map((field) => (
      <div key={field} className="space-y-2">
        <Label htmlFor={field} className="capitalize">
          {field
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())}
        </Label>
        <Input
          id={field}
          {...register(field as keyof Address)}
          className={errors[field as keyof Address] ? "border-destructive" : ""}
        />
        {errors[field as keyof Address] && (
          <p className="text-xs text-destructive">
            {errors[field as keyof Address]?.message}
          </p>
        )}
      </div>
    ))}
  </div>
);

const ProfileForm: React.FC<FormProps<Profile>> = ({ register, errors }) => (
  <div className="grid gap-4 sm:grid-cols-2">
    {Object.keys(profileSchema.fields).map((field) => (
      <div key={field} className="space-y-2">
        <Label htmlFor={field} className="capitalize">
          {field
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())}
        </Label>
        <Input
          id={field}
          {...register(field as keyof Profile)}
          className={errors[field as keyof Profile] ? "border-destructive" : ""}
        />
        {errors[field as keyof Profile] && (
          <p className="text-xs text-destructive">
            {errors[field as keyof Profile]?.message}
          </p>
        )}
      </div>
    ))}
  </div>
);

const AddressCard = ({ address }: { address: Address }) => (
  <Card>
    <CardContent className="p-4">
      <div className="space-y-1">
        <p className="font-medium">{address.street}</p>
        <p className="text-sm">
          {address.city}, {address.state} {address.zipCode}
        </p>
        <p className="text-sm text-muted-foreground">{address.country}</p>
      </div>
      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="sm" className="w-full">
          Edit
        </Button>
        <Button variant="outline" size="sm" className="w-full">
          Delete
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default ProfilePage;
