import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Shield } from "lucide-react";
import {
  useListScripts,
  useListCategories,
  useCreateScript,
  useDeleteScript,
  getListScriptsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function AdminScriptsPage() {
  const queryClient = useQueryClient();
  const { data: scripts, isLoading } = useListScripts({});
  const { data: categories } = useListCategories();
  const [dialogOpen, setDialogOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    longDescription: "",
    price: "",
    categoryId: "",
    imageUrl: "",
    version: "1.0.0",
    escrowProtected: true,
    featured: false,
    tags: "",
  });

  const createScript = useCreateScript({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListScriptsQueryKey() });
        setDialogOpen(false);
        toast.success("Script created!");
        setForm({ name: "", slug: "", description: "", longDescription: "", price: "", categoryId: "", imageUrl: "", version: "1.0.0", escrowProtected: true, featured: false, tags: "" });
      },
      onError: () => toast.error("Failed to create script."),
    },
  });

  const deleteScript = useDeleteScript({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListScriptsQueryKey() });
        toast.success("Script deleted.");
      },
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createScript.mutate({
      data: {
        name: form.name,
        slug: form.slug,
        description: form.description,
        longDescription: form.longDescription || undefined,
        price: Number(form.price),
        categoryId: Number(form.categoryId),
        imageUrl: form.imageUrl || undefined,
        version: form.version,
        escrowProtected: form.escrowProtected,
        featured: form.featured,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : undefined,
      },
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Scripts</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage your script catalog.</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Script
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Script</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 mt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Name</Label>
                    <Input
                      placeholder="Script name"
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Slug</Label>
                    <Input
                      placeholder="script-slug"
                      value={form.slug}
                      onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Price ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="29.99"
                      value={form.price}
                      onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select value={form.categoryId} onValueChange={(v) => setForm((p) => ({ ...p, categoryId: v }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {(categories ?? []).map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Version</Label>
                    <Input
                      placeholder="1.0.0"
                      value={form.version}
                      onChange={(e) => setForm((p) => ({ ...p, version: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Image URL</Label>
                    <Input
                      placeholder="https://..."
                      value={form.imageUrl}
                      onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label>Short Description</Label>
                  <Textarea
                    placeholder="Brief description shown on cards"
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    required
                    className="mt-1"
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Full Description</Label>
                  <Textarea
                    placeholder="Detailed description shown on the script detail page"
                    value={form.longDescription}
                    onChange={(e) => setForm((p) => ({ ...p, longDescription: e.target.value }))}
                    className="mt-1"
                    rows={4}
                  />
                </div>
                <div>
                  <Label>Tags (comma-separated)</Label>
                  <Input
                    placeholder="QBCore, Police, UI"
                    value={form.tags}
                    onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.escrowProtected}
                      onChange={(e) => setForm((p) => ({ ...p, escrowProtected: e.target.checked }))}
                    />
                    <span className="text-sm">Escrow Protected</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
                    />
                    <span className="text-sm">Featured</span>
                  </label>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={createScript.isPending}>
                    {createScript.isPending ? "Creating..." : "Create Script"}
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
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
          </div>
        ) : (
          <div className="rounded-xl border border-border/40 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Script</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Price</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Downloads</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(scripts ?? []).map((script, i) => (
                  <motion.tr
                    key={script.id}
                    className="border-t border-border/30 hover:bg-muted/20 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">{script.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {script.escrowProtected && <Shield className="h-3 w-3 text-primary" />}
                        {script.featured && <Badge variant="secondary" className="text-xs py-0">Featured</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{script.categoryName}</td>
                    <td className="px-4 py-3 hidden sm:table-cell text-primary font-semibold">${script.price.toFixed(2)}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{script.downloadCount}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => deleteScript.mutate({ params: { id: script.id } })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
