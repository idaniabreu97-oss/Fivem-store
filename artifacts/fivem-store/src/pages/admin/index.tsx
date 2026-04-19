import { motion } from "framer-motion";
import { Package, ShoppingBag, DollarSign, Users, TrendingUp } from "lucide-react";
import { useGetStoreStats, useListOrders } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetStoreStats();
  const { data: orders } = useListOrders();

  const statCards = stats
    ? [
        { label: "Total Scripts", value: stats.totalScripts, icon: Package, color: "text-primary" },
        { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "text-primary" },
        { label: "Total Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-primary" },
        { label: "Customers", value: stats.totalCustomers, icon: Users, color: "text-primary" },
      ]
    : [];

  const recentOrders = (orders ?? []).slice(-5).reverse();

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Store overview and recent activity.</p>
        </div>

        {/* Stat Cards */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card className="border-border/40 bg-card/60">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.label}
                      </CardTitle>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Popular Categories */}
        {stats && stats.popularCategories && stats.popularCategories.length > 0 && (
          <Card className="border-border/40 bg-card/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-primary" />
                Popular Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.popularCategories.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <span className="text-sm">{cat.name}</span>
                    <Badge variant="secondary">{cat.count} scripts</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Orders */}
        {recentOrders.length > 0 && (
          <Card className="border-border/40 bg-card/60">
            <CardHeader>
              <CardTitle className="text-base">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between text-sm border-b border-border/30 pb-3 last:border-0 last:pb-0">
                    <div>
                      <div className="font-medium">Order #{order.id}</div>
                      <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary">${order.totalAmount.toFixed(2)}</div>
                      <Badge variant={order.status === "paid" ? "default" : "secondary"} className="text-xs">
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
