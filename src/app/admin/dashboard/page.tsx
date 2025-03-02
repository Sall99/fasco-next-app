"use client";
import React, { useState } from "react";
import {
  LayoutGrid,
  Package,
  Tags,
  Users,
  ShoppingCart,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  CategoriesSection,
  CustomersSection,
  OrdersSection,
  Overview,
  ProductsSection,
} from "@/components";
import { SettingsSection } from "@/components/ui/admin/settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type SectionId =
  | "overview"
  | "products"
  | "categories"
  | "customers"
  | "orders"
  | "settings";

interface NavItem {
  id: SectionId;
  label: string;
  icon: React.ReactNode;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  id: SectionId;
  isActive: boolean;
  onClick: (id: SectionId) => void;
  isCollapsed: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "overview",
    label: "Overview",
    icon: <LayoutGrid className="h-5 w-5" />,
  },
  {
    id: "products",
    label: "Products",
    icon: <Package className="h-5 w-5" />,
  },
  {
    id: "categories",
    label: "Categories",
    icon: <Tags className="h-5 w-5" />,
  },
  {
    id: "customers",
    label: "Customers",
    icon: <Users className="h-5 w-5" />,
  },
  {
    id: "orders",
    label: "Orders",
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  id,
  isActive,
  onClick,
  isCollapsed,
}) => {
  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              size="icon"
              className="my-1 h-10 w-10"
              onClick={() => onClick(id)}
            >
              {icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "my-1 h-10 w-full justify-start gap-2",
        isActive ? "font-medium" : "font-normal",
      )}
      onClick={() => onClick(id)}
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
};

interface NavigationProps {
  activeSection: SectionId;
  onSectionChange: (id: SectionId) => void;
  isCollapsed: boolean;
}

const Navigation: React.FC<NavigationProps> = ({
  activeSection,
  onSectionChange,
  isCollapsed,
}) => (
  <ScrollArea className={cn("px-2", isCollapsed ? "py-2" : "py-0")}>
    <div className={cn("space-y-1", isCollapsed ? "py-2" : "py-0")}>
      {NAV_ITEMS.map((item) => (
        <NavItem
          key={item.id}
          {...item}
          isActive={activeSection === item.id}
          onClick={onSectionChange}
          isCollapsed={isCollapsed}
        />
      ))}
    </div>
  </ScrollArea>
);

interface MainContentProps {
  activeSection: SectionId;
}

const MainContent: React.FC<MainContentProps> = ({ activeSection }) => {
  const sectionComponents = {
    overview: <Overview />,
    products: <ProductsSection />,
    categories: <CategoriesSection />,
    customers: <CustomersSection />,
    orders: <OrdersSection />,
    settings: <SettingsSection />,
  };

  return <div className="space-y-4">{sectionComponents[activeSection]}</div>;
};

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="mt-10 flex min-h-screen bg-background">
      <aside
        className={cn(
          "flex h-screen flex-col border-r bg-card transition-all duration-300",
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
                <AvatarImage src="/logo.png" alt="Logo" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <span className="font-semibold">Admin Panel</span>
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

        <div className="flex-1 overflow-auto">
          <Navigation
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            isCollapsed={isCollapsed}
          />
        </div>

        {!isCollapsed && (
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/avatar.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
            </div>
          </div>
        )}
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <Card>
            <CardContent className="p-6">
              <MainContent activeSection={activeSection} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
