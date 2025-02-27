"use client";
import React, { useState } from "react";
import {
  Users,
  Search,
  Mail,
  Phone,
  ShoppingBag,
  Calendar,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useOverview } from "@/actions";
import { DashboardOverview } from "@/types";
import { Badge } from "../badge";
import Typography from "@/components/typography";
import EmailModal from "./send-mail";

type Customer = DashboardOverview["customers"]["data"][0];
type ModalType = "details" | "orders" | "email" | null;

const OrderStatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Badge className={getStatusColor(status)} variant="outline">
      {status}
    </Badge>
  );
};

const OrdersModal = ({
  customer,
}: {
  customer: Customer;
  onClose: () => void;
}) => (
  <DialogContent className="max-w-4xl">
    <DialogHeader>
      <DialogTitle className="flex items-center justify-between">
        Orders for {customer.name}
      </DialogTitle>
    </DialogHeader>
    <div className="mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customer.orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-between text-sm text-gray-500">
        <span>Total Orders: {customer.orders.length}</span>
        <span>Total Spent: ${customer.totalSpent.toFixed(2)}</span>
      </div>
    </div>
  </DialogContent>
);

const CustomersSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  const { overview } = useOverview();

  const stats = {
    totalCustomers: overview?.customers.total || 0,
    activeCustomers: overview?.customers.new || 0,
    averageSpent:
      overview?.customers.data.reduce(
        (acc, curr) => acc + curr.totalSpent,
        0,
      ) || 0 / (overview?.customers.data.length || 1),
  };
  const handleModalOpen = (customer: Customer, type: ModalType) => {
    setSelectedCustomer(customer);
    setModalType(type);
  };

  const handleModalClose = () => {
    setSelectedCustomer(null);
    setModalType(null);
  };

  const CustomerDetails = ({ customer }: { customer: Customer }) => (
    <div className="space-y-6 font-poppins">
      <div className="flex items-center space-x-4">
        <Image
          src={customer.image || ""}
          alt={customer.name || ""}
          className="rounded-full"
          width={32}
          height={32}
        />
        <div>
          <h3 className="text-xl font-semibold text-gray-600">
            {customer.name}
          </h3>
          <div className="flex space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Mail className="mr-1 h-4 w-4" />
              {customer.email}
            </span>
            <span className="flex items-center">
              <Phone className="mr-1 h-4 w-4" />
              {customer.phoneNumber}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 font-poppins">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-500">Total Orders</div>
            <div className="text-xl font-semibold text-gray-600">
              {customer.totalOrders}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-500">Total Spent</div>
            <div className="text-xl font-semibold text-gray-600">
              ${customer.totalSpent.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-500">Last Order</div>
            <div className="text-xl font-semibold text-gray-600">
              {customer.lastOrder
                ? new Date(customer.lastOrder).toLocaleDateString()
                : "No orders"}
            </div>
          </CardContent>
        </Card>
      </div>

      {customer.orders && customer.orders.length > 0 && (
        <div className="mt-6">
          <h4 className="mb-4 text-lg font-semibold text-gray-600">
            Recent Orders
          </h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customer.orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell className="text-right">
                    ${order.totalAmount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Typography variant="h4">Customers</Typography>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {overview?.customers.total}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Customers
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-sky-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {overview?.customers.new}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Spent</CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              ${stats.averageSpent.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search customers..."
              className="bg-white pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">
                Customer
                <ArrowUpDown className="ml-2 inline h-4 w-4" />
              </TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Last Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {overview?.customers.data.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    <Image
                      src={customer.image || ""}
                      alt={customer.name || ""}
                      className="rounded-full"
                      width={32}
                      height={32}
                    />
                    <span>{customer.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <Mail className="mr-2 h-4 w-4" />
                      {customer.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="mr-2 h-4 w-4" />
                      {customer.phoneNumber}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{customer.totalOrders}</TableCell>
                <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                <TableCell>
                  {customer.lastOrder
                    ? new Date(customer.lastOrder).toLocaleDateString()
                    : "No orders"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Actions
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => handleModalOpen(customer, "details")}
                      >
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleModalOpen(customer, "orders")}
                      >
                        View Orders
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleModalOpen(customer, "email")}
                      >
                        Send Email
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={modalType !== null} onOpenChange={() => handleModalClose()}>
        {selectedCustomer && modalType === "details" && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
            </DialogHeader>
            <CustomerDetails customer={selectedCustomer} />
          </DialogContent>
        )}

        {selectedCustomer && modalType === "orders" && (
          <OrdersModal customer={selectedCustomer} onClose={handleModalClose} />
        )}

        {selectedCustomer && modalType === "email" && (
          <EmailModal
            customer={selectedCustomer}
            onClose={handleModalClose}
            open={modalType === "email"}
          />
        )}
      </Dialog>
    </div>
  );
};

export { CustomersSection };
