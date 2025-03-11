import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../../libs";
import { authOptions } from "../../../../../libs/auth-options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        OrderItem: {
          include: {
            product: true,
          },
        },
        Shipping: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalOrders = orders.length;
    const recentOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return orderDate >= thirtyDaysAgo;
    });

    return NextResponse.json({
      allOrders: orders,
      recentOrders: recentOrders,
      totalOrders: totalOrders,
      recentOrdersCount: recentOrders.length,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
