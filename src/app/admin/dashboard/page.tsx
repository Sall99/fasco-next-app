"use client";
import React, { useState } from "react";
import {
  LayoutGrid,
  Package,
  Tags,
  Users,
  ShoppingCart,
  Settings,
} from "lucide-react";

import {
  CategoriesSection,
  CustomersSection,
  OrdersSection,
  Overview,
  ProductsSection,
} from "@/components";
import { SettingsSection } from "@/components/ui/admin/settings";

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
}) => (
  <button
    onClick={() => onClick(id)}
    className={`flex w-full items-center space-x-2 rounded-lg p-2 transition-colors ${
      isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

interface NavigationProps {
  activeSection: SectionId;
  onSectionChange: (id: SectionId) => void;
}

const Navigation: React.FC<NavigationProps> = ({
  activeSection,
  onSectionChange,
}) => (
  <nav className="space-y-1">
    {NAV_ITEMS.map((item) => (
      <NavItem
        key={item.id}
        {...item}
        isActive={activeSection === item.id}
        onClick={onSectionChange}
      />
    ))}
  </nav>
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

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-white p-4">
        <h1 className="mb-4 text-xl font-bold">Admin Dashboard</h1>
        <Navigation
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </aside>
      <main className="flex-1 p-8">
        <MainContent activeSection={activeSection} />
      </main>
    </div>
  );
};

export default AdminDashboard;
