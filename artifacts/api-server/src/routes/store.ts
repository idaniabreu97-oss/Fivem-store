import { Router } from "express";
import { db } from "@workspace/db";
import { scriptsTable, ordersTable, categoriesTable } from "@workspace/db";
import { eq, count, sum, desc } from "drizzle-orm";

export const storeRouter = Router();

storeRouter.get("/stats", async (req, res) => {
  const [scriptCount] = await db.select({ count: count() }).from(scriptsTable);
  const [orderCount] = await db.select({ count: count() }).from(ordersTable);
  const [revenue] = await db.select({ total: sum(ordersTable.totalAmount) }).from(ordersTable);

  const uniqueCustomers = await db
    .selectDistinct({ email: ordersTable.customerEmail })
    .from(ordersTable);

  const categoryStats = await db
    .select({
      name: categoriesTable.name,
      count: count(scriptsTable.id),
    })
    .from(categoriesTable)
    .leftJoin(scriptsTable, eq(scriptsTable.categoryId, categoriesTable.id))
    .groupBy(categoriesTable.id)
    .orderBy(desc(count(scriptsTable.id)))
    .limit(5);

  res.json({
    totalScripts: Number(scriptCount?.count ?? 0),
    totalOrders: Number(orderCount?.count ?? 0),
    totalRevenue: Number(revenue?.total ?? 0),
    totalCustomers: uniqueCustomers.length,
    popularCategories: categoryStats.map((c) => ({ name: c.name, count: Number(c.count) })),
  });
});

storeRouter.get("/featured", async (req, res) => {
  const featured = await db
    .select({
      id: scriptsTable.id,
      name: scriptsTable.name,
      slug: scriptsTable.slug,
      description: scriptsTable.description,
      longDescription: scriptsTable.longDescription,
      price: scriptsTable.price,
      categoryId: scriptsTable.categoryId,
      categoryName: categoriesTable.name,
      imageUrl: scriptsTable.imageUrl,
      previewImages: scriptsTable.previewImages,
      version: scriptsTable.version,
      escrowProtected: scriptsTable.escrowProtected,
      featured: scriptsTable.featured,
      downloadCount: scriptsTable.downloadCount,
      averageRating: scriptsTable.averageRating,
      reviewCount: scriptsTable.reviewCount,
      tags: scriptsTable.tags,
      createdAt: scriptsTable.createdAt,
      updatedAt: scriptsTable.updatedAt,
    })
    .from(scriptsTable)
    .leftJoin(categoriesTable, eq(scriptsTable.categoryId, categoriesTable.id))
    .where(eq(scriptsTable.featured, true))
    .orderBy(desc(scriptsTable.downloadCount))
    .limit(6);

  res.json(featured);
});
