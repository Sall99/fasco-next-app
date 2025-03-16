import Typography from "@/components/typography";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../card";

interface DashboardProps {
  recentOrdersCount: number;
}

export const DashboardTab: React.FC<DashboardProps> = ({
  recentOrdersCount,
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Overview of your recent actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Typography variant="p-14">
            Welcome back! You have{" "}
            <span className="font-semibold">{recentOrdersCount}</span> recent
            orders.
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};
