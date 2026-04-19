import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Download, ArrowLeft, Tag, CheckCircle2, Shield } from "lucide-react";
import {
  useGetScript,
  useListReviews,
  useCreateReview,
  getGetScriptQueryKey,
  getListReviewsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EscrowBadge } from "@/components/ui/escrow-badge";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ScriptDetailPage() {
  const { id } = useParams<{ id: string }>();
  const scriptId = Number(id);
  const { addItem, items } = useCart();
  const inCart = items.some((i) => i.scriptId === scriptId);
  const queryClient = useQueryClient();

  const [reviewForm, setReviewForm] = useState({ authorName: "", rating: 5, comment: "" });

  const { data: script, isLoading } = useGetScript(scriptId, {
    query: { queryKey: getGetScriptQueryKey(scriptId), enabled: !!scriptId },
  });

  const { data: reviews } = useListReviews(scriptId, {
    query: { queryKey: getListReviewsQueryKey(scriptId), enabled: !!scriptId },
  });

  const createReview = useCreateReview({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey(scriptId) });
        queryClient.invalidateQueries({ queryKey: getGetScriptQueryKey(scriptId) });
        setReviewForm({ authorName: "", rating: 5, comment: "" });
        toast.success("Review submitted!");
      },
    },
  });

  const handleAddToCart = () => {
    if (!script || inCart) return;
    addItem(script);
    toast.success("Added to cart", { description: `${script.name} added to your cart.` });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.authorName.trim()) return;
    createReview.mutate({
      params: { scriptId },
      data: reviewForm,
    });
  };

  if (isLoading) {
    return (
      <div className="container py-12">
        <Skeleton className="h-8 w-40 mb-8" />
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
          </div>
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!script) {
    return (
      <div className="container py-24 text-center">
        <h2 className="text-2xl font-semibold mb-2">Script not found</h2>
        <Link href="/scripts">
          <Button variant="outline" className="mt-4">Back to Scripts</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="container">
        <Link href="/scripts">
          <Button variant="ghost" size="sm" className="mb-6 text-muted-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Scripts
          </Button>
        </Link>

        <div className="grid gap-10 lg:grid-cols-3">
          {/* Left - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Preview Image */}
            <motion.div
              className="overflow-hidden rounded-xl border border-border/40 bg-card aspect-video"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {script.imageUrl ? (
                <img src={script.imageUrl} alt={script.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  No preview available
                </div>
              )}
            </motion.div>

            {/* Description */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex flex-wrap gap-2">
                {(script.tags ?? []).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    <Tag className="mr-1 h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>

              <h2 className="text-2xl font-bold">Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                {script.longDescription || script.description}
              </p>

              {script.escrowProtected && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Asset Escrow Protected</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      This script is protected by FiveM's official Asset Escrow system. Your purchase is permanently
                      tied to your server license, making unauthorized redistribution impossible.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            <Separator />

            {/* Reviews */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Reviews</h2>
                {script.reviewCount !== undefined && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span>
                      {(script.averageRating ?? 0).toFixed(1)} — {script.reviewCount} reviews
                    </span>
                  </div>
                )}
              </div>

              {(reviews ?? []).length > 0 ? (
                <div className="space-y-4">
                  {reviews!.map((review) => (
                    <div key={review.id} className="rounded-lg border border-border/40 bg-card/50 p-5">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-semibold">{review.authorName}</span>
                        <div className="flex items-center gap-1 text-sm">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${i < review.rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No reviews yet. Be the first!</p>
              )}

              {/* Submit Review */}
              <div className="rounded-xl border border-border/40 bg-card/50 p-6">
                <h3 className="text-lg font-semibold mb-4">Leave a Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="authorName">Your Name</Label>
                    <Input
                      id="authorName"
                      placeholder="Server owner name..."
                      value={reviewForm.authorName}
                      onChange={(e) => setReviewForm((p) => ({ ...p, authorName: e.target.value }))}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label>Rating</Label>
                    <div className="mt-1 flex gap-1">
                      {[1, 2, 3, 4, 5].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setReviewForm((p) => ({ ...p, rating: r }))}
                        >
                          <Star
                            className={`h-6 w-6 cursor-pointer transition-colors ${
                              r <= reviewForm.rating ? "fill-primary text-primary" : "text-muted-foreground hover:text-primary"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="comment">Comment (optional)</Label>
                    <Textarea
                      id="comment"
                      placeholder="Share your experience with this script..."
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm((p) => ({ ...p, comment: e.target.value }))}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  <Button type="submit" disabled={createReview.isPending}>
                    {createReview.isPending ? "Submitting..." : "Submit Review"}
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Right - Purchase Sidebar */}
          <div className="lg:sticky lg:top-24 h-fit">
            <motion.div
              className="rounded-xl border border-border/40 bg-card p-6 space-y-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div>
                <h1 className="text-2xl font-bold mb-1">{script.name}</h1>
                {script.categoryName && (
                  <Badge variant="outline" className="text-xs">{script.categoryName}</Badge>
                )}
              </div>

              <div className="text-4xl font-bold text-primary">
                ${script.price.toFixed(2)}
              </div>

              {script.escrowProtected && <EscrowBadge />}

              <div className="space-y-2 text-sm text-muted-foreground">
                {script.version && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Version {script.version}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span>{script.downloadCount} downloads</span>
                </div>
                {script.reviewCount !== undefined && script.reviewCount > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span>
                      {(script.averageRating ?? 0).toFixed(1)} / 5.0 ({script.reviewCount} reviews)
                    </span>
                  </div>
                )}
              </div>

              <Separator />

              <Button
                className="w-full shadow-lg shadow-primary/20"
                size="lg"
                onClick={handleAddToCart}
                disabled={inCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {inCart ? "Added to Cart" : "Add to Cart"}
              </Button>

              {inCart && (
                <Link href="/cart">
                  <Button variant="outline" className="w-full">
                    Go to Cart
                  </Button>
                </Link>
              )}

              <p className="text-xs text-muted-foreground text-center">
                Instant delivery via FiveM Asset Escrow after purchase.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
