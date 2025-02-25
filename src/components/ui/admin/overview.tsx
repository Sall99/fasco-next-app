"use client";
import { Skeleton, Typography } from "@/components";
import { useOverview } from "@/actions";
import { DashboardOverview } from "@/types";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  XAxis,
  YAxis,
} from "recharts";
import { Package, DollarSign, Users, Tags } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ReactElement } from "react";

interface ChartCardProps {
  title: string;
  children: ReactElement;
}
interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ElementType;
  iconColor?: string;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-gray-500",
}) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <Typography variant="h6" className="!text-sm font-medium text-gray-500">
          {title}
        </Typography>
        {Icon && <Icon className={`h-5 w-5 ${iconColor}`} />}
      </div>
      <Typography variant="h6" className="mt-2 text-2xl !font-semibold">
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="p-12" className="mt-1 font-semibold text-gray-600">
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => (
  <Card className="h-80">
    <CardContent className="p-4">
      <Typography
        variant="h6"
        className="mb-4 !text-sm font-medium text-gray-500"
      >
        {title}
      </Typography>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

const SkeletonMetricCard = () => (
  <Card>
    <CardContent className="space-y-2 p-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-4 w-40" />
    </CardContent>
  </Card>
);

const SkeletonChartCard = () => (
  <Card className="h-80">
    <CardContent className="space-y-4 p-4">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-48 w-full" />
    </CardContent>
  </Card>
);

const SkeletonOrderSummary = () => (
  <Card className="col-span-2">
    <CardContent className="space-y-4 p-4">
      <Skeleton className="h-6 w-40" />
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const Overview: React.FC = () => {
  const { overview, isLoading, isError } = useOverview() as {
    overview: DashboardOverview;
    isLoading: boolean;
    isError: boolean;
  };

  if (isError) return <p>Error fetching data</p>;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonMetricCard key={i} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SkeletonChartCard />
          <SkeletonChartCard />
          <SkeletonOrderSummary />
        </div>
      </div>
    );
  }

  const categoryData = overview.categories.distribution.map((cat) => ({
    name: cat.name,
    value: cat.count,
  }));

  const topProductsData = overview.products.topViewed.map((product) => ({
    name: product.name,
    views: product.viewersCount,
  }));

  return (
    <div className="space-y-6">
      <Typography variant="h4">Overview</Typography>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Products"
          value={overview.products.total}
          subtitle={`${overview.products.lowStock} low stock items`}
          icon={Package}
          iconColor="text-blue-500"
        />
        <MetricCard
          title="Total Revenue"
          value={`$${overview.orders.totalRevenue.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          subtitle={`${overview.orders.total} total orders`}
          icon={DollarSign}
          iconColor="text-green-500"
        />
        <MetricCard
          title="Customers"
          value={overview.customers.total}
          subtitle={`${overview.customers.new} new customers`}
          icon={Users}
          iconColor="text-purple-500"
        />
        <MetricCard
          title="Categories"
          value={overview.categories.total}
          icon={Tags}
          iconColor="text-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Category Distribution">
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={{
                fontSize: 12,
              }}
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              fontSize={12}
              iconSize={8}
              wrapperStyle={{ fontSize: "12px" }}
            />
          </PieChart>
        </ChartCard>

        <ChartCard title="Top Viewed Products">
          <BarChart data={topProductsData}>
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={60}
              tick={{ fontSize: 10 }}
            />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="views" fill="#0088FE" fontSize={12} />
          </BarChart>
        </ChartCard>

        {overview.orders.items.length > 0 && (
          <Card className="col-span-2">
            <CardContent className="p-4">
              <Typography variant="h6" className="mb-4 !text-sm">
                Latest Order Summary
              </Typography>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold">Customer</p>
                    <p>{overview.orders.items[0]?.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Order Total</p>
                    <p>
                      ${overview.orders.items[0].totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Items</p>
                    <p>{overview.orders.items[0].itemsCount} products</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Status</p>
                    <p>{overview.orders.items[0].status}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export { Overview };
