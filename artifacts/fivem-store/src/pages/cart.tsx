import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Trash2, Shield, ArrowRight, ShoppingBag } from "lucide-react";
import { useCreateOrder } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { EscrowBadge } from "@/components/ui/escrow-badge";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";

export default function CartPage() {
  const [, navigate] = useLocation();
  const { items, removeItem, clearCart } = useCart();
  const [form, setForm] = useState({ customerEmail: "", customerName: "" });

  const createOrder = useCreateOrder({
    mutation: {
      onSuccess: (order) => {
        clearCart();
        navigate(`/orders/${order.id}`);
      },
      onError: () => {
        toast.error("Failed to place order. Please try again.");
      },
    },
  });

  const total = items.reduce((sum, i) => sum + i.price, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerEmail || items.length === 0) return;
    createOrder.mutate({
      data: {
        customerEmail: form.customerEmail,
        customerName: form.customerName || undefined,
        items: items.map((i) => ({ scriptId: i.scriptId })),
      },
    });
  };

  if (items.length === 0) {
    return (
      <div className="container py-24">
        <motion.div
          className="mx-auto max-w-md text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-card border border-border/40">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Browse our catalog and add some scripts to get started.
          </p>
          <Link href="/scripts">
            <Button size="lg">
              Browse Scripts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <ShoppingCart className="h-8 w-8" />
          Your Cart
          <span className="text-lg text-muted-foreground font-normal">({items.length} items)</span>
        </h1>
      </motion.div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.scriptId}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-4 rounded-xl border border-border/40 bg-card/60 p-4"
              >
                {item.script.imageUrl && (
                  <div className="h-16 w-24 overflow-hidden rounded-lg shrink-0">
                    <img
                      src={item.script.imageUrl}
                      alt={item.script.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold truncate">{item.script.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.script.categoryName}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-primary">${item.price.toFixed(2)}</div>
                    </div>
                  </div>
                  {item.script.escrowProtected && (
                    <EscrowBadge showText={false} className="mt-2" />
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => removeItem(item.scriptId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Checkout Panel */}
        <div className="h-fit sticky top-24">
          <div className="rounded-xl border border-border/40 bg-card p-6 space-y-6">
            <h2 className="text-xl font-bold">Order Summary</h2>

            <div className="space-y-2 text-sm">
              {items.map((item) => (
                <div key={item.scriptId} className="flex justify-between text-muted-foreground">
                  <span className="truncate mr-2">{item.script.name}</span>
                  <span className="shrink-0">${item.price.toFixed(2)}</span>
                </div>
              ))}
              <Separator className="my-3" />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/20 p-3 text-xs text-muted-foreground">
              <Shield className="h-4 w-4 text-primary shrink-0" />
              <span>All scripts are delivered via FiveM Asset Escrow after payment.</span>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={form.customerEmail}
                  onChange={(e) => setForm((p) => ({ ...p, customerEmail: e.target.value }))}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="name">Name (optional)</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={form.customerName}
                  onChange={(e) => setForm((p) => ({ ...p, customerName: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <Button
                type="submit"
                className="w-full shadow-lg shadow-primary/20"
                size="lg"
                disabled={createOrder.isPending || !form.customerEmail}
              >
                {createOrder.isPending ? "Processing..." : "Complete Purchase"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center">
              By completing your purchase, you agree to our terms of service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
