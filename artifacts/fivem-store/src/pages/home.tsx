import { Link } from "wouter";
import { motion } from "framer-motion";
import { Shield, Download, Star, ArrowRight, Zap, Lock, Headphones } from "lucide-react";
import { useGetFeaturedScripts, useGetStoreStats, useListCategories } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScriptCard } from "@/components/script-card";
import { EscrowBadge } from "@/components/ui/escrow-badge";
import { Skeleton } from "@/components/ui/skeleton";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function HomePage() {
  const { data: featured, isLoading: featuredLoading } = useGetFeaturedScripts();
  const { data: stats } = useGetStoreStats();
  const { data: categories } = useListCategories();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background to-background/80 pb-20 pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15)_0%,transparent_60%)]" />
        <div className="container relative">
          <motion.div
            className="mx-auto max-w-4xl text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/60 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur">
              <Shield className="h-4 w-4 text-primary" />
              <span>All scripts protected by FiveM Asset Escrow</span>
            </div>

            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              Premium{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                FiveM Scripts
              </span>
              <br />
              for Serious Servers
            </h1>

            <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
              Hand-crafted, performance-optimized resources for your FiveM server.
              Every script ships with Asset Escrow copy protection.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/scripts">
                <Button size="lg" className="min-w-[160px] shadow-lg shadow-primary/20">
                  Browse Scripts
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/scripts?featured=true">
                <Button size="lg" variant="outline" className="min-w-[160px]">
                  Featured
                  <Star className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      {stats && (
        <section className="border-b border-border/40 bg-card/30">
          <div className="container">
            <div className="grid grid-cols-2 divide-x divide-border/40 md:grid-cols-4">
              {[
                { label: "Scripts Available", value: stats.totalScripts },
                { label: "Happy Customers", value: stats.totalCustomers },
                { label: "Orders Fulfilled", value: stats.totalOrders },
                { label: "Revenue Generated", value: `$${stats.totalRevenue.toFixed(0)}` },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="flex flex-col items-center justify-center py-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="text-2xl font-bold text-foreground md:text-3xl">{stat.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Scripts */}
      <section className="py-20">
        <div className="container">
          <motion.div {...fadeUp} className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">Featured Resources</Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Top-Rated Scripts</h2>
            <p className="mt-3 text-muted-foreground">
              The most popular resources trusted by hundreds of server owners.
            </p>
          </motion.div>

          {featuredLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(featured ?? []).map((script, i) => (
                <ScriptCard key={script.id} script={script} index={i} />
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link href="/scripts">
              <Button variant="outline" size="lg">
                View All Scripts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="border-t border-border/40 bg-card/20 py-20">
          <div className="container">
            <motion.div {...fadeUp} className="mb-12 text-center">
              <Badge variant="outline" className="mb-4">Browse by Category</Badge>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Find What You Need</h2>
              <p className="mt-3 text-muted-foreground">Organized by server feature area.</p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link href={`/scripts?categoryId=${cat.id}`}>
                    <div className="group flex items-center gap-4 rounded-xl border border-border/50 bg-card/60 p-5 transition-all hover:border-primary/50 hover:bg-card hover:shadow-md hover:shadow-primary/5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold">{cat.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {cat.scriptCount ?? 0} {cat.scriptCount === 1 ? "script" : "scripts"}
                        </div>
                      </div>
                      <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground/50 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust Features */}
      <section className="border-t border-border/40 py-20">
        <div className="container">
          <motion.div {...fadeUp} className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">Why NEXUS</Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Built for Professionals</h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Lock,
                title: "Asset Escrow Protected",
                description: "Every script uses FiveM's official Asset Escrow system. Your purchase is tied to your server license — guaranteed protection against unauthorized distribution.",
              },
              {
                icon: Zap,
                title: "Performance Optimized",
                description: "All scripts are benchmarked and optimized. We target 0.01ms or less idle resource usage. Your server ticks matter — we treat them that way.",
              },
              {
                icon: Headphones,
                title: "Dedicated Support",
                description: "Every purchase includes access to our support channels. Installation help, compatibility questions, and bug reports all handled promptly.",
              },
            ].map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  className="rounded-xl border border-border/40 bg-card/50 p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground">{feat.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Escrow CTA */}
      <section className="border-t border-border/40 bg-gradient-to-b from-card/30 to-background py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl rounded-2xl border border-primary/20 bg-primary/5 p-10 text-center">
            <EscrowBadge className="mb-6 mx-auto" />
            <h2 className="mb-4 text-3xl font-bold">FiveM Asset Escrow</h2>
            <p className="mb-6 text-muted-foreground">
              Asset Escrow is FiveM's official DRM solution. When you purchase a script, 
              it's permanently tied to your server license — making it impossible to redistribute.
              Your investment is protected.
            </p>
            <Link href="/scripts">
              <Button size="lg" className="shadow-lg shadow-primary/20">
                Shop Protected Scripts
                <Shield className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
