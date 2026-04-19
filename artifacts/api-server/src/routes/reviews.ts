import { Router } from "express";
import { db } from "@workspace/db";
import { reviewsTable, scriptsTable } from "@workspace/db";
import { eq, avg, count } from "drizzle-orm";
import { ListReviewsParams, CreateReviewParams, CreateReviewBody } from "@workspace/api-zod";

export const reviewsRouter = Router({ mergeParams: true });

reviewsRouter.get("/", async (req, res) => {
  const parsed = ListReviewsParams.safeParse({ scriptId: req.params.scriptId });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid scriptId" });
    return;
  }

  const reviews = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.scriptId, parsed.data.scriptId))
    .orderBy(reviewsTable.createdAt);

  res.json(reviews);
});

reviewsRouter.post("/", async (req, res) => {
  const paramsParsed = CreateReviewParams.safeParse({ scriptId: req.params.scriptId });
  if (!paramsParsed.success) {
    res.status(400).json({ error: "Invalid scriptId" });
    return;
  }

  const bodyParsed = CreateReviewBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: "Invalid body", details: bodyParsed.error });
    return;
  }

  const [review] = await db
    .insert(reviewsTable)
    .values({
      scriptId: paramsParsed.data.scriptId,
      ...bodyParsed.data,
    })
    .returning();

  const [stats] = await db
    .select({ avgRating: avg(reviewsTable.rating), cnt: count(reviewsTable.id) })
    .from(reviewsTable)
    .where(eq(reviewsTable.scriptId, paramsParsed.data.scriptId));

  if (stats) {
    await db
      .update(scriptsTable)
      .set({
        averageRating: Number(stats.avgRating) || 0,
        reviewCount: Number(stats.cnt),
      })
      .where(eq(scriptsTable.id, paramsParsed.data.scriptId));
  }

  res.status(201).json(review);
});
