import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useListCategories, useCreateCategory, getListCategoriesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const { data: categories, isLoading } = useListCategories();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "", iconName: "" });

  const createCategory = useCreateCategory({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListCategoriesQueryKey() });
        setDialogOpen(false);
        setForm({ name: "", slug: "", description: "", iconName: "" });
        toast.success("Category created!");
      },
      onError: () => toast.error("Failed to create category."),
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createCategory.mutate({ data: form });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Categories</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage script categories.</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 mt-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    placeholder="Category name"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Slug</Label>
                  <Input
                    placeholder="category-slug"
                    value={form.slug}
                    onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Category description"
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    className="mt-1"
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Icon Name</Label>
                  <Input
                    placeholder="e.g. shield, car, briefcase"
                    value={form.iconName}
                    onChange={(e) => setForm((p) => ({ ...p, iconName: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={createCategory.isPending}>
                    {createCategory.isPending ? "Creating..." : "Create Category"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(categories ?? []).map((cat) => (
              <div key={cat.id} className="rounded-xl border border-border/40 bg-card/60 p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{cat.name}</h3>
                  <Badge variant="secondary" className="text-xs">{cat.scriptCount ?? 0} scripts</Badge>
                </div>
                {cat.description && (
                  <p className="text-xs text-muted-foreground">{cat.description}</p>
                )}
                <div className="mt-3">
                  <code className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{cat.slug}</code>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
