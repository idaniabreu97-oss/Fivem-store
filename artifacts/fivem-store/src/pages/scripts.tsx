import { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useListScripts, useListCategories } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScriptCard } from "@/components/script-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearch } from "wouter";

type SortBy = "newest" | "popular" | "price_asc" | "price_desc";

export default function ScriptsPage() {
  const searchStr = useSearch();
  const params = new URLSearchParams(searchStr);
  const initialCategory = params.get("categoryId") ? Number(params.get("categoryId")) : undefined;
  const initialFeatured = params.get("featured") === "true" ? true : undefined;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(initialCategory);
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [featuredOnly, setFeaturedOnly] = useState<boolean | undefined>(initialFeatured);

  const { data: categories } = useListCategories();
  const { data: scripts, isLoading } = useListScripts({
    search: searchQuery || undefined,
    categoryId: selectedCategory,
    featured: featuredOnly,
    sortBy: sortBy,
  });

  return (
    <div className="py-12">
      <div className="container">
        {/* Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Script Catalog</h1>
          <p className="mt-2 text-muted-foreground">
            {scripts?.length ?? 0} resources available, all Asset Escrow protected.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search scripts..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select
            value={selectedCategory ? String(selectedCategory) : "all"}
            onValueChange={(val) => setSelectedCategory(val === "all" ? undefined : Number(val))}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {(categories ?? []).map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(val) => setSortBy(val as SortBy)}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={featuredOnly ? "default" : "outline"}
            onClick={() => setFeaturedOnly(featuredOnly ? undefined : true)}
            className="shrink-0"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Featured Only
          </Button>
        </motion.div>

        {/* Category Chips */}
        {categories && categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === undefined ? "default" : "outline"}
              className="cursor-pointer text-sm"
              onClick={() => setSelectedCategory(undefined)}
            >
              All
            </Badge>
            {categories.map((cat) => (
              <Badge
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                className="cursor-pointer text-sm"
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
                <span className="ml-1.5 text-xs opacity-60">{cat.scriptCount ?? 0}</span>
              </Badge>
            ))}
          </div>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
        ) : scripts && scripts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {scripts.map((script, i) => (
              <ScriptCard key={script.id} script={script} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-5xl mb-4">∅</div>
            <h3 className="text-xl font-semibold mb-2">No scripts found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
            <Button variant="outline" className="mt-6" onClick={() => {
              setSearchQuery("");
              setSelectedCategory(undefined);
              setFeaturedOnly(undefined);
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
