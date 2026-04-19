import { motion } from "framer-motion";
import { useListOrders } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminOrdersPage() {
  const { data: orders, isLoading } = useListOrders();

  const statusVariant = (status: string) => {
    switch (status) {
      case "paid": return "default";
      case "delivered": return "outline";
      case "cancelled": return "destructive" as const;
      default: return "secondary";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">All customer orders.</p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
          </div>
        ) : (orders ?? []).length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No orders yet.</div>
        ) : (
          <div className="rounded-xl border border-border/40 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Order</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Customer</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Items</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Total</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {[...(orders ?? [])].reverse().map((order, i) => (
                  <motion.tr
                    key={order.id}
                    className="border-t border-border/30 hover:bg-muted/20 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">#{order.id}</div>
                      {order.createdAt && (
                        <div className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="text-muted-foreground">{order.customerEmail}</div>
                      {order.customerName && <div className="font-medium text-xs">{order.customerName}</div>}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                      {Array.isArray(order.items) ? order.items.length : 0} script(s)
                    </td>
                    <td className="px-4 py-3 text-primary font-semibold">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
