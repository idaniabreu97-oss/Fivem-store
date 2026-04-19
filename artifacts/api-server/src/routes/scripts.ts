import { Router } from "express";
import { db } from "@workspace/db";
import { scriptsTable, categoriesTable } from "@workspace/db";
import { eq, ilike, and, desc, asc } from "drizzle-orm";
import {
  ListScriptsQueryParams,
  CreateScriptBody,
  GetScriptParams,
  UpdateScriptParams,
  UpdateScriptBody,
  DeleteScriptParams,
} from "@workspace/api-zod";

export const scriptsRouter = Router();

scriptsRouter.get("/", async (req, res) => {
  const parsed = ListScriptsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }

  const { categoryId, search, featured, sortBy } = parsed.data;

  let query = db
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
    .$dynamic();

  const conditions = [];
  if (categoryId !== undefined) {
    conditions.push(eq(scriptsTable.categoryId, categoryId));
  }
  if (search) {
    conditions.push(ilike(scriptsTable.name, `%${search}%`));
  }
  if (featured !== undefined) {
    conditions.push(eq(scriptsTable.featured, featured));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  if (sortBy === "price_asc") {
    query = query.orderBy(asc(scriptsTable.price));
  } else if (sortBy === "price_desc") {
    query = query.orderBy(desc(scriptsTable.price));
  } else if (sortBy === "popular") {
    query = query.orderBy(desc(scriptsTable.downloadCount));
  } else {
    query = query.orderBy(desc(scriptsTable.createdAt));
  }

  const scripts = await query;
  res.json(scripts);
});

scriptsRouter.post("/", async (req, res) => {
  const parsed = CreateScriptBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body", details: parsed.error });
    return;
  }

  const [script] = await db
    .insert(scriptsTable)
    .values({
      ...parsed.data,
      escrowProtected: parsed.data.escrowProtected ?? true,
      featured: parsed.data.featured ?? false,
    })
    .returning();

  if (script.categoryId) {
    await db
      .update(categoriesTable)
      .set({ scriptCount: db.$count(scriptsTable, eq(scriptsTable.categoryId, script.categoryId)) as any })
      .where(eq(categoriesTable.id, script.categoryId));
  }

  res.status(201).json(script);
});

scriptsRouter.get("/:id", async (req, res) => {
  const parsed = GetScriptParams.safeParse({ id: req.params.id });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [script] = await db
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
    .where(eq(scriptsTable.id, parsed.data.id));

  if (!script) {
    res.status(404).json({ error: "Script not found" });
    return;
  }

  res.json(script);
});

scriptsRouter.put("/:id", async (req, res) => {
  const paramsParsed = UpdateScriptParams.safeParse({ id: req.params.id });
  if (!paramsParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const bodyParsed = UpdateScriptBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }

  const [script] = await db
    .update(scriptsTable)
    .set({ ...bodyParsed.data, updatedAt: new Date() })
    .where(eq(scriptsTable.id, paramsParsed.data.id))
    .returning();

  if (!script) {
    res.status(404).json({ error: "Script not found" });
    return;
  }

  res.json(script);
});

scriptsRouter.delete("/:id", async (req, res) => {
  const parsed = DeleteScriptParams.safeParse({ id: req.params.id });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  await db.delete(scriptsTable).where(eq(scriptsTable.id, parsed.data.id));
  res.status(204).send();
});
