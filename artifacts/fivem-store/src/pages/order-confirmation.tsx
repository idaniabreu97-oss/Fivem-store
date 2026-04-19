import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, Download, Shield, ArrowRight, Copy } from "lucide-react";
import { useGetOrder, getGetOrderQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);

  const { data: order, isLoading } = useGetOrder(orderId, {
    query: { queryKey: getGetOrderQueryKey(orderId), enabled: !!orderId },
  });

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("Escrow key copied to clipboard!");
  };

  if (isLoading) {
    return (
      <div className="container py-20">
        <Skeleton className="h-96 max-w-2xl mx-auto rounded-xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-24 text-center">
        <h2 className="text-2xl font-semibold mb-4">Order not found</h2>
        <Link href="/scripts">
          <Button>Back to Scripts</Button>
        </Link>
      </div>
    );
  }

  const orderItems = Array.isArray(order.items) ? order.items as Array<{
    scriptId: number;
    scriptName: string;
    price: number;
    escrowKey: string;
  }> : [];

  return (
    <div className="container py-16">
      <div className="mx-auto max-w-2xl">
        {/* Success Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 border border-primary/30">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Order #{order.id} — Your scripts are ready to download via FiveM Asset Escrow.
          </p>
          <Badge variant="outline" className="mt-3">
            Status: {order.status}
          </Badge>
        </motion.div>

        {/* Order Details */}
        <motion.div
          className="rounded-xl border border-border/40 bg-card p-6 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground mb-1">Customer Email</div>
              <div className="font-medium">{order.customerEmail}</div>
            </div>
            {order.customerName && (
              <div>
                <div className="text-muted-foreground mb-1">Name</div>
                <div className="font-medium">{order.customerName}</div>
              </div>
            )}
            <div>
              <div className="text-muted-foreground mb-1">Total Paid</div>
              <div className="font-bold text-primary text-lg">${order.totalAmount.toFixed(2)}</div>
            </div>
          </div>

          <Separator />

          {/* Escrow Instructions */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm mb-1">How to claim your scripts</p>
              <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Open your FiveM server's txAdmin or server console</li>
                <li>Go to Resources &gt; Asset Escrow &gt; Activate</li>
                <li>Enter the escrow key provided below for each script</li>
                <li>The script will be linked to your server license and ready to start</li>
              </ol>
            </div>
          </div>

          {/* Script Items & Keys */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Your Scripts
            </h3>
            {orderItems.map((item) => (
              <div
                key={item.scriptId}
                className="rounded-lg border border-border/40 bg-background p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold">{item.scriptName}</span>
                  <span className="text-primary font-medium">${item.price.toFixed(2)}</span>
                </div>
                {item.escrowKey && (
                  <div>
                    <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      Escrow Key
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 rounded bg-muted px-3 py-2 text-sm font-mono tracking-wider text-primary truncate">
                        {item.escrowKey}
                      </code>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => copyKey(item.escrowKey)}
                        className="shrink-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="mt-8 text-center">
          <Link href="/scripts">
            <Button variant="outline" size="lg">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
