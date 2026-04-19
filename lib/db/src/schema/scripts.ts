import { pgTable, text, serial, integer, boolean, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const scriptsTable = pgTable("scripts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  price: real("price").notNull(),
  categoryId: integer("category_id").notNull(),
  imageUrl: text("image_url"),
  previewImages: text("preview_images").array(),
  version: text("version").default("1.0.0"),
  escrowProtected: boolean("escrow_protected").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
  downloadCount: integer("download_count").notNull().default(0),
  averageRating: real("average_rating").default(0),
  reviewCount: integer("review_count").notNull().default(0),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertScriptSchema = createInsertSchema(scriptsTable).omit({
  id: true,
  downloadCount: true,
  averageRating: true,
  reviewCount: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertScript = z.infer<typeof insertScriptSchema>;
export type Script = typeof scriptsTable.$inferSelect;
