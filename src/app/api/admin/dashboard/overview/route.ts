import { NextResponse } from "next/server";
import { prisma } from "../../../../../../libs";
import { DashboardOverview } from "@/types";

export async function GET() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      productsStats,
      lowStockProducts,
      topViewedProducts,
      categoriesWithCount,
      ordersStats,
      recentOrders,
      customersStats,
      newCustomers,
      allProducts,
      detailedCustomers,
    ] = await Promise.all([
      prisma.product.count(),

      prisma.product.count({
        where: {
          isAlmostSoldOut: true,
        },
      }),

      prisma.product.findMany({
        select: {
          id: true,
          name: true,
          viewersCount: true,
        },
        orderBy: {
          viewersCount: "desc",
        },
        take: 5,
      }),

      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          _count: {
            select: {
              products: true,
            },
          },
        },
      }),

      prisma.order.aggregate({
        _count: {
          id: true,
        },
        _sum: {
          totalAmount: true,
        },
      }),

      // Updated recent orders query with shipping and payment info
      prisma.order.findMany({
        select: {
          id: true,
          totalAmount: true,
          status: true,
          currency: true,
          paymentIntentId: true,
          failureReason: true,
          createdAt: true,
          updatedAt: true,
          User: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
            },
          },
          OrderItem: {
            select: {
              id: true,
              quantity: true,
              price: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  brand: true,
                  images: true,
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
          Shipping: {
            select: {
              address: true,
              city: true,
              postalCode: true,
              country: true,
              phone: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      }),

      prisma.user.count(),

      prisma.user.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      }),

      prisma.product.findMany({
        select: {
          id: true,
          name: true,
          brand: true,
          price: true,
          viewersCount: true,
          category: true,
          rating: {
            select: {
              average: true,
              reviewsCount: true,
            },
          },
          stock: {
            select: {
              quantity: true,
              lowStockThreshold: true,
            },
          },
          isAlmostSoldOut: true,
          tags: true,
          images: true,
          description: true,
        },
        orderBy: {
          viewersCount: "desc",
        },
      }),

      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          image: true,
          Order: {
            select: {
              id: true,
              totalAmount: true,
              status: true,
              createdAt: true,
              OrderItem: {
                select: {
                  quantity: true,
                  price: true,
                  product: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
        where: {
          Order: {
            some: {},
          },
        },
        orderBy: {
          Order: {
            _count: "desc",
          },
        },
        take: 10,
      }),
    ]);

    const processedRecentOrders = recentOrders.map((order) => ({
      id: order.id,
      totalAmount: order.totalAmount,
      status: order.status,
      currency: order.currency,
      paymentIntentId: order.paymentIntentId,
      failureReason: order.failureReason,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      customer: {
        id: order.User.id,
        name: order.User.name || "Unknown",
        email: order.User.email,
        phoneNumber: order.User.phoneNumber,
      },
      items: order.OrderItem.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        product: {
          id: item.product.id,
          name: item.product.name,
          brand: item.product.brand,
          image: item.product.images[0] || null,
          category: item.product.category,
        },
      })),
      shipping: order.Shipping[0] || null,
      itemsCount: order.OrderItem.length,
      totalProducts: order.OrderItem.reduce(
        (sum, item) => sum + item.quantity,
        0,
      ),
    }));

    const processedCustomers = detailedCustomers.map((customer) => ({
      id: customer.id,
      name: customer.name || "Unknown",
      email: customer.email || "",
      phoneNumber: customer.phoneNumber || "",
      image: customer.image || "",
      totalOrders: customer.Order.length,
      totalSpent: customer.Order.reduce(
        (sum, order) => sum + order.totalAmount,
        0,
      ),
      lastOrder: customer.Order[0]?.createdAt || null,
      orders: customer.Order.map((order) => ({
        id: order.id,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
      })),
    }));

    const overview: DashboardOverview = {
      products: {
        total: productsStats,
        lowStock: lowStockProducts,
        topViewed: topViewedProducts,
        allProducts: allProducts,
      },
      categories: {
        total: categoriesWithCount.length,
        distribution: categoriesWithCount.map((category) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          count: category._count.products,
        })),
      },
      orders: {
        total: ordersStats._count.id,
        totalRevenue: ordersStats._sum.totalAmount || 0,
        items: processedRecentOrders,
      },
      customers: {
        total: customersStats,
        new: newCustomers,
        data: processedCustomers,
      },
    };

    return NextResponse.json(overview);
  } catch (error) {
    console.error("Dashboard Overview Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard overview" },
      { status: 500 },
    );
  }
}
