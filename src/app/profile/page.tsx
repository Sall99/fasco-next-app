"use client";
import React, { useState } from "react";
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
  CardDescription,
} from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useUserGetOrders } from "@/actions";
import {
  AccountTab,
  AddressTab,
  DashboardTab,
  OrdersTab,
  WishlistTab,
} from "@/components";

type Tab =
  | "dashboard"
  | "orders"
  | "addresses"
  | "account"
  | "wishlist"
  | "logout";

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

  const [isCollapsed, setIsCollapsed] = useState(false);
  const { orders, recentOrdersCount } = useUserGetOrders();

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab recentOrdersCount={recentOrdersCount} />;

      case "orders":
        return <OrdersTab orders={orders} />;

      case "addresses":
        return <AddressTab />;

      case "account":
        return <AccountTab />;

      case "wishlist":
        return <WishlistTab />;

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

export default ProfilePage;
