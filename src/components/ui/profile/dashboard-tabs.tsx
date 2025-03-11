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
          <p className="font-poppins text-sm text-muted-foreground">
            Welcome back! You have
            <span className="font-semibold">{recentOrdersCount}</span> recent
            orders.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
