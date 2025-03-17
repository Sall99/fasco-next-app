"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../dialog";
import { ScrollArea } from "../scroll-area";
import { Separator } from "../separator";
import { Badge } from "../badge";
import { Button } from "../button";
import { formatPrice } from "@/utils";
import Image from "next/image";
import Typography from "@/components/typography";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  description: string;
  brand: string;
}

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  orderId: string;
  price: number;
  product: Product;
}

interface Shipping {
  id: string;
  orderId: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: string;
  paymentIntentId: string;
  currency: string;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
  OrderItem: OrderItem[];
  Shipping: Shipping[];
}

interface OrdersTabProps {
  orders: Order[];
}

export const OrdersTab: React.FC<OrdersTabProps> = ({ orders }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>Your recent purchases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {orders &&
              orders.map((order: Order) => (
                <Card
                  key={order.id}
                  className="shadow-sm transition-shadow hover:shadow"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        Order #{order.id.slice(-8)}
                      </CardTitle>
                      <Badge
                        variant={
                          order.status === "delivered" ? "secondary" : "outline"
                        }
                        className="capitalize"
                      >
                        <span className="font-poppins">{order.status}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-primary-600">
                      <span className="font-poppins text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span className="font-poppins font-medium">
                        {formatCurrency(order.totalAmount, order.currency)}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {order.OrderItem.length}{" "}
                      {order.OrderItem.length === 1 ? "item" : "items"}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleViewDetails(order)}
                    >
                      <span className="font-poppins text-primary-600">
                        View Details
                      </span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </CardContent>
      </Card>

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!order) return null;

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const shipping =
    order.Shipping && order.Shipping.length > 0 ? order.Shipping[0] : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order #{order.id.slice(-8)}</span>
            <Badge
              variant={order.status === "delivered" ? "secondary" : "outline"}
              className="mr-4 capitalize"
            >
              {order.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>Placed on {formattedDate}</DialogDescription>
        </DialogHeader>

        <div className="py-4 font-poppins text-primary-600">
          <div className="mb-2 flex justify-between">
            <span className="text-sm font-medium">Order Total</span>
            <span className="font-semibold">
              {formatPrice(order.totalAmount)}
            </span>
          </div>

          <Separator className="my-4" />

          {shipping && (
            <>
              <div className="mb-4">
                <Typography variant="h6" className="mb-2 text-sm font-semibold">
                  Shipping Address
                </Typography>
                <div className="text-sm text-muted-foreground">
                  <Typography variant="p-14" className="font-medium">
                    {shipping.address}
                  </Typography>
                  <Typography variant="p-14" className="font-medium">
                    {shipping.city}, {shipping.postalCode}
                  </Typography>
                  <Typography variant="p-14" className="font-medium">
                    {shipping.country}
                  </Typography>
                  <Typography variant="p-14" className="font-medium">
                    {shipping.phone && <p>Phone: {shipping.phone}</p>}
                  </Typography>

                  <Typography variant="p-14" className="font-medium">
                    Email: {shipping.email}
                  </Typography>
                </div>
              </div>
              <Separator className="my-4" />
            </>
          )}

          <div>
            <Typography variant="h6" className="mb-2 text-sm font-semibold">
              Items
            </Typography>
            <ScrollArea className="h-48">
              {order.OrderItem && order.OrderItem.length > 0 ? (
                <div className="space-y-4">
                  {order.OrderItem.map((item) => (
                    <div key={item.id} className="flex gap-4 py-2">
                      {item.product.images &&
                        item.product.images.length > 0 && (
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded">
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              layout="responsive"
                              width={64}
                              height={64}
                            />
                          </div>
                        )}
                      <div className="flex-1">
                        <div className="font-medium">{item.product.name}</div>
                        <div className="text-xs text-muted-foreground">
                          <Typography variant="p-14">
                            Brand: {item.product.brand}
                          </Typography>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <Typography variant="p-14">
                            Qty: {item.quantity}
                          </Typography>
                        </div>
                      </div>
                      <div className="font-medium">
                        <Typography variant="p-14" className="font-semibold">
                          {formatPrice(item.price)}
                        </Typography>
                        <div className="text-xs text-muted-foreground">
                          <Typography variant="p-14" className="font-medium">
                            per unit
                          </Typography>
                        </div>
                        <div className="mt-1 text-sm font-semibold">
                          <Typography variant="p-14" className="font-semibold">
                            {formatPrice(item.price * item.quantity)}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No items information available
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {order.status !== "delivered" && <Button>Track Order</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
