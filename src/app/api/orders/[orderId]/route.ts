import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../../../libs/auth-options";
import { prisma } from "../../../../../libs";
import { SessionUser } from "@/types";

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } },
) {
  try {
    const session = (await getServerSession(authOptions)) as {
      user: SessionUser;
    };

    if (!session?.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: params.orderId,
        userId: session.user.id,
      },
      include: {
        OrderItem: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
                slug: true,
                brand: true,
                category: {
                  select: {
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
        Shipping: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Error fetching order" },
      { status: 500 },
    );
  }
}
