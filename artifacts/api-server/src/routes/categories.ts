import { Router } from "express";
import { db } from "@workspace/db";
import { categoriesTable, scriptsTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { CreateCategoryBody } from "@workspace/api-zod";

export const categoriesRouter = Router();

categoriesRouter.get("/", async (req, res) => {
  const categories = await db
    .select({
      id: categoriesTable.id,
      name: categoriesTable.name,
      slug: categoriesTable.slug,
      description: categoriesTable.description,
      iconName: categoriesTable.iconName,
      scriptCount: count(scriptsTable.id),
    })
    .from(categoriesTable)
    .leftJoin(scriptsTable, eq(scriptsTable.categoryId, categoriesTable.id))
    .groupBy(categoriesTable.id);

  res.json(categories);
});

categoriesRouter.post("/", async (req, res) => {
  const parsed = CreateCategoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body", details: parsed.error });
    return;
  }

  const [category] = await db
    .insert(categoriesTable)
    .values(parsed.data)
    .returning();

  res.status(201).json(category);
});
