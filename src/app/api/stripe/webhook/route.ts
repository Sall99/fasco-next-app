import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "../../../../../libs";
import { CartItem } from "@/store/slices/cart";
import { MinimalCartItem } from "@/types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      console.error("Missing Stripe signature");
      return NextResponse.json(
        { error: "Missing stripe signature" },
        { status: 400 },
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 },
      );
    }

    const isPaymentIntent = (obj: unknown): obj is Stripe.PaymentIntent => {
      return (obj as { object: string })?.object === "payment_intent";
    };

    if (!event.type.startsWith("payment_intent.")) {
      console.log(`Skipping non-payment intent event: ${event.type}`);
      return NextResponse.json({ received: true });
    }

    try {
      switch (event.type) {
        case "payment_intent.succeeded": {
          const paymentIntent = event.data.object;

          if (!isPaymentIntent(paymentIntent)) {
            throw new Error("Invalid payment intent object");
          }

          if (
            !paymentIntent.metadata?.userId ||
            !paymentIntent.metadata?.cartItems
          ) {
            throw new Error("Missing required metadata");
          }

          const shippingInfo: ShippingInfo = JSON.parse(
            paymentIntent.metadata.shipping,
          );
          const cartItems: MinimalCartItem[] = JSON.parse(
            paymentIntent.metadata.cartItems,
          );

          await prisma.order.create({
            data: {
              userId: paymentIntent.metadata.userId,
              totalAmount: paymentIntent.amount / 100,
              status: "paid",
              paymentIntentId: paymentIntent.id,
              currency: paymentIntent.currency,

              Shipping: {
                create: {
                  address: shippingInfo.address,
                  city: shippingInfo.city,
                  country: shippingInfo.country,
                  postalCode: shippingInfo.zipCode,
                  phone: "",
                  email: shippingInfo.email,
                },
              },

              OrderItem: {
                create: cartItems.map((item) => ({
                  productId: item.id,
                  quantity: item.qty,
                  price: item.price,
                })),
              },
            },
          });

          console.log(
            `Successfully processed payment intent: ${paymentIntent.id}`,
          );
          break;
        }

        case "payment_intent.payment_failed": {
          const failedPayment = event.data.object;

          if (!isPaymentIntent(failedPayment)) {
            throw new Error("Invalid payment intent object");
          }

          if (!failedPayment.metadata?.userId) {
            throw new Error("Missing userId in payment intent metadata");
          }

          const shippingInfo: ShippingInfo = failedPayment.metadata.shipping
            ? JSON.parse(failedPayment.metadata.shipping)
            : null;

          if (!shippingInfo) {
            throw new Error("Missing shipping information");
          }

          const cartItems: CartItem[] = JSON.parse(
            failedPayment.metadata.cartItems,
          );

          await prisma.order.create({
            data: {
              userId: failedPayment.metadata.userId,
              totalAmount: failedPayment.amount / 100,
              status: "failed",
              paymentIntentId: failedPayment.id,
              currency: failedPayment.currency,

              Shipping: {
                create: {
                  address: shippingInfo.address,
                  city: shippingInfo.city,
                  country: shippingInfo.country,
                  postalCode: shippingInfo.zipCode,
                  phone: "",
                  email: shippingInfo.email,
                },
              },

              OrderItem: {
                create: cartItems.map((item) => ({
                  productId: item.productId,
                  quantity: item.quantity,
                  price: item.price,
                })),
              },
            },
          });
          console.log(`Recorded failed payment intent: ${failedPayment.id}`);
          break;
        }

        default: {
          console.log(`Unhandled payment intent event type: ${event.type}`);
        }
      }

      return NextResponse.json({ received: true });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(
        `Error processing payment intent event ${event.type}:`,
        errorMessage,
      );

      return NextResponse.json(
        {
          error: `Error processing ${event.type}`,
          details: errorMessage,
        },
        { status: 200 },
      );
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error processing webhook:", errorMessage);
    return NextResponse.json(
      { error: "Error processing webhook", details: errorMessage },
      { status: 500 },
    );
  }
}
