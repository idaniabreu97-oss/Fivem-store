import { Link } from "wouter";
import { Star, Download, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import type { Script } from "@workspace/api-client-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { EscrowBadge } from "@/components/ui/escrow-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";

interface ScriptCardProps {
  script: Script;
  index?: number;
}

export function ScriptCard({ script, index = 0 }: ScriptCardProps) {
  const { addItem, items } = useCart();
  const inCart = items.some((i) => i.scriptId === script.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCart) return;
    addItem(script);
    toast.success("Added to cart", {
      description: `${script.name} has been added to your cart.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/scripts/${script.id}`}>
        <Card className="group h-full cursor-pointer overflow-hidden border-border/50 bg-card/50 transition-all hover:border-primary/50 hover:bg-card hover:shadow-lg hover:shadow-primary/5">
          <CardHeader className="p-0">
            <div className="relative aspect-video overflow-hidden bg-muted">
              {script.imageUrl ? (
                <img
                  src={script.imageUrl}
                  alt={script.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-secondary text-muted-foreground">
                  No preview available
                </div>
              )}
              {script.escrowProtected && (
                <div className="absolute left-3 top-3">
                  <EscrowBadge />
                </div>
              )}
              <div className="absolute right-3 top-3">
                <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                  {script.categoryName || "Uncategorized"}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <div className="mb-2 flex items-start justify-between gap-4">
              <h3 className="font-semibold leading-none tracking-tight text-foreground line-clamp-1">
                {script.name}
              </h3>
              <div className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary">
                ${script.price.toFixed(2)}
              </div>
            </div>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {script.description}
            </p>
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              {script.averageRating !== undefined && script.reviewCount !== undefined && (
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                  <span>
                    {script.averageRating.toFixed(1)} ({script.reviewCount})
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Download className="h-3.5 w-3.5" />
                <span>{script.downloadCount}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-5 pt-0">
            <Button
              className="w-full"
              variant={inCart ? "secondary" : "default"}
              onClick={handleAddToCart}
              disabled={inCart}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {inCart ? "In Cart" : "Add to Cart"}
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
