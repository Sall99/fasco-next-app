import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../libs/auth-options";
import {
  CreatePaymentIntentPayload,
  MinimalCartItem,
  SessionUser,
} from "@/types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(req: Request) {
  try {
    const session = (await getServerSession(authOptions)) as {
      user: SessionUser;
    };

    if (!session?.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as CreatePaymentIntentPayload;
    const { amount, shipping, cartItems } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const minimalCartItems: MinimalCartItem[] = cartItems.map((item) => ({
      id: item.productId,
      qty: item.quantity,
      price: item.price,
    }));

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: session.user.id,
        shipping: JSON.stringify(shipping),
        cartItems: JSON.stringify(minimalCartItems),
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Error creating payment intent" },
      { status: 500 },
    );
  }
}
