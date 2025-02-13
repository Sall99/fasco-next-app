"use client";

import { useState } from "react";
import { FieldError, useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CartItem,
  selectCartItems,
  selectTotalPrice,
  clearCart,
} from "@/store/slices/cart";
import { Button, Typography } from "@/components";
import { toast } from "sonner";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  saveInfo: boolean;
}

const CheckoutForm = ({ totalPrice }: { totalPrice: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const cartItems = useSelector(selectCartItems);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>();

  const handleCheckout = async (formData: CheckoutFormData) => {
    if (!stripe || !elements) {
      return;
    }

    try {
      setIsProcessing(true);

      const response = await fetch("/api/stripe/payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalPrice,
          shipping: formData,
          cartItems,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      const { clientSecret } = await response.json();

      const { error: paymentError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              address: {
                line1: formData.address,
                city: formData.city,
                country: formData.country,
                postal_code: formData.zipCode,
              },
            },
          },
        });

      if (paymentError) {
        throw new Error(paymentError.message);
      }

      if (paymentIntent.status === "succeeded") {
        dispatch(clearCart());
        toast.success("Payment successful!");
        router.push("/checkout/success");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleCheckout)} className="space-y-6">
      <Section title="Shipping Information">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="First Name"
            {...register("firstName", { required: true })}
            error={errors.firstName}
          />
          <Input
            label="Last Name"
            {...register("lastName", { required: true })}
            error={errors.lastName}
          />
        </div>
        <Input
          label="Email Address"
          type="email"
          {...register("email", { required: true })}
          error={errors.email}
        />
        <Input
          label="Street Address"
          {...register("address", { required: true })}
          error={errors.address}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="City"
            {...register("city", { required: true })}
            error={errors.city}
          />
          <Input
            label="Country"
            {...register("country", { required: true })}
            error={errors.country}
          />
          <Input
            label="ZIP Code"
            {...register("zipCode", { required: true })}
            error={errors.zipCode}
          />
        </div>
      </Section>

      <Section title="Payment Details">
        <div className="rounded border p-2">
          <CardElement options={{ style: cardElementStyle }} />
        </div>
      </Section>

      <Button type="submit" className="w-full" disabled={isProcessing}>
        {isProcessing ? "Processing..." : `Pay $${totalPrice.toFixed(2)}`}
      </Button>
    </form>
  );
};

const OrderSummary = ({
  cartItems,
  totalPrice,
}: {
  cartItems: CartItem[];
  totalPrice: number;
}) => (
  <Section title="Order Summary">
    <div className="space-y-4">
      {cartItems.map((item) => (
        <OrderItem key={item.productId} item={item} />
      ))}
    </div>
    <div className="mt-6 space-y-4 border-t pt-4">
      <SummaryRow label="Subtotal" value={`$${totalPrice.toFixed(2)}`} />
      <SummaryRow label="Shipping" value="Free" />
      <SummaryRow label="Total" value={`$${totalPrice.toFixed(2)}`} bold />
    </div>
  </Section>
);

const CheckoutPage = () => {
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectTotalPrice);

  if (cartItems.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Typography variant="h4">Your cart is empty</Typography>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <div className="mt-20 min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          <CheckoutForm totalPrice={totalPrice} />
          <OrderSummary cartItems={cartItems} totalPrice={totalPrice} />
        </div>
      </div>
    </Elements>
  );
};

export default CheckoutPage;

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-lg bg-white p-6 shadow-sm">
    <Typography variant="h5" className="mb-6">
      {title}
    </Typography>
    {children}
  </div>
);

const Input = ({
  label,
  error,
  ...props
}: {
  label: string;
  error?: FieldError;
  [key: string]: unknown;
}) => (
  <div>
    <label className="mb-2 block font-poppins text-sm">{label}</label>
    <input {...props} className="mb-5 w-full rounded border p-2" />
    {error && (
      <Typography variant="p-12" className="text-red-500">
        Required field
      </Typography>
    )}
  </div>
);

const OrderItem = ({ item }: { item: CartItem }) => (
  <div className="flex items-center border-b pb-4">
    <div className="relative h-20 w-20 flex-shrink-0">
      <Image src={item.image} alt={item.name} fill className="object-cover" />
    </div>
    <div className="ml-4 flex-1">
      <Typography variant="p-14" className="font-medium">
        {item.name}
      </Typography>
      <Typography variant="p-12" className="text-gray-500">
        Quantity: {item.quantity}
      </Typography>
    </div>
    <Typography variant="p-14" className="font-medium">
      ${(item.price * item.quantity).toFixed(2)}
    </Typography>
  </div>
);

const SummaryRow = ({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) => (
  <div className="flex justify-between">
    <Typography variant={bold ? "h6" : "p-14"}>{label}</Typography>
    <Typography variant={bold ? "h6" : "p-14"}>{value}</Typography>
  </div>
);

const cardElementStyle = {
  base: {
    fontSize: "16px",
    color: "#424770",
    "::placeholder": { color: "#aab7c4" },
  },
  invalid: { color: "#9e2146" },
};
