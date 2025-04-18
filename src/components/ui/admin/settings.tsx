"use client";
import React from "react";
import { Store, CreditCard, Bell, Truck, Shield, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const SettingsSection = () => {
  const [settings, setSettings] = React.useState({
    storeName: "My Store",
    storeEmail: "store@example.com",
    supportEmail: "support@example.com",
    currency: "USD",
    orderPrefix: "ORD-",
    lowStockThreshold: "5",
    orderNotifications: true,
    stockNotifications: true,
    automaticTaxCalculation: true,
    requireSignedDelivery: false,
    maintenanceMode: false,
  });

  const handleSettingChange = (key: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Saving settings:", settings);
  };

  const FormSection: React.FC<{
    label: string;
    description?: string;
    children: React.ReactNode;
  }> = ({ label, description, children }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  );

  const GeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <FormSection label="Store Name">
          <Input
            value={settings.storeName}
            onChange={(e) => handleSettingChange("storeName", e.target.value)}
          />
        </FormSection>

        <FormSection label="Store Email">
          <Input
            value={settings.storeEmail}
            onChange={(e) => handleSettingChange("storeEmail", e.target.value)}
          />
        </FormSection>

        <FormSection label="Currency">
          <Select
            value={settings.currency}
            onValueChange={(value) => handleSettingChange("currency", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">US Dollar (USD)</SelectItem>
              <SelectItem value="EUR">Euro (EUR)</SelectItem>
              <SelectItem value="GBP">British Pound (GBP)</SelectItem>
            </SelectContent>
          </Select>
        </FormSection>

        <FormSection
          label="Order Prefix"
          description="This will be added before order numbers"
        >
          <Input
            value={settings.orderPrefix}
            onChange={(e) => handleSettingChange("orderPrefix", e.target.value)}
          />
        </FormSection>
      </div>

      <FormSection
        label="Maintenance Mode"
        description="Temporarily disable your store for maintenance"
      >
        <div className="flex items-center space-x-2">
          <Switch
            checked={settings.maintenanceMode}
            onCheckedChange={(checked) =>
              handleSettingChange("maintenanceMode", checked)
            }
          />
          <Label>Enable maintenance mode</Label>
        </div>
      </FormSection>
    </div>
  );

  const NotificationSettings = () => (
    <div className="space-y-6">
      <FormSection
        label="Order Notifications"
        description="Receive notifications for new orders"
      >
        <div className="flex items-center space-x-2">
          <Switch
            checked={settings.orderNotifications}
            onCheckedChange={(checked) =>
              handleSettingChange("orderNotifications", checked)
            }
          />
          <Label>Enable order notifications</Label>
        </div>
      </FormSection>

      <FormSection
        label="Low Stock Alerts"
        description="Get notified when products are running low"
      >
        <div className="flex items-center space-x-2">
          <Switch
            checked={settings.stockNotifications}
            onCheckedChange={(checked) =>
              handleSettingChange("stockNotifications", checked)
            }
          />
          <Label>Enable stock alerts</Label>
        </div>
      </FormSection>

      <FormSection
        label="Support Email"
        description="Email address for customer support inquiries"
      >
        <Input
          value={settings.supportEmail}
          onChange={(e) => handleSettingChange("supportEmail", e.target.value)}
        />
      </FormSection>
    </div>
  );

  const ShippingSettings = () => (
    <div className="space-y-6">
      <FormSection
        label="Require Signed Delivery"
        description="Require signature for all deliveries"
      >
        <div className="flex items-center space-x-2">
          <Switch
            checked={settings.requireSignedDelivery}
            onCheckedChange={(checked) =>
              handleSettingChange("requireSignedDelivery", checked)
            }
          />
          <Label>Enable signed delivery</Label>
        </div>
      </FormSection>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-primary-600">Settings</h2>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="shipping" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Shipping
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <div className="rounded-lg border p-4">
          <TabsContent value="general">
            <GeneralSettings />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="shipping">
            <ShippingSettings />
          </TabsContent>

          <TabsContent value="payment">
            <h3 className="text-lg font-semibold">Payment Settings</h3>
          </TabsContent>

          <TabsContent value="security">
            <h3 className="text-lg font-semibold">Security Settings</h3>
          </TabsContent>
        </div>
      </Tabs>
    </form>
  );
};

export { SettingsSection };
