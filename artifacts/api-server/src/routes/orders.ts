import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, scriptsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateOrderBody, GetOrderParams } from "@workspace/api-zod";

export const ordersRouter = Router();

function generateEscrowKey(scriptId: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let key = `ESC-${scriptId}-`;
  for (let i = 0; i < 12; i++) {
    key += chars[Math.floor(Math.random() * chars.length)];
    if (i === 3 || i === 7) key += "-";
  }
  return key;
}

ordersRouter.get("/", async (req, res) => {
  const orders = await db
    .select()
    .from(ordersTable)
    .orderBy(ordersTable.createdAt);

  res.json(orders);
});

ordersRouter.post("/", async (req, res) => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body", details: parsed.error });
    return;
  }

  const { customerEmail, customerName, items } = parsed.data;

  const scriptIds = items.map((i) => i.scriptId);
  const foundScripts = await db
    .select()
    .from(scriptsTable)
    .where(eq(scriptsTable.id, scriptIds[0]));

  const scriptMap: Record<number, typeof foundScripts[0]> = {};
  for (const scriptId of scriptIds) {
    const [script] = await db
      .select()
      .from(scriptsTable)
      .where(eq(scriptsTable.id, scriptId));
    if (script) scriptMap[scriptId] = script;
  }

  const orderItems = items.map((item) => {
    const script = scriptMap[item.scriptId];
    return {
      scriptId: item.scriptId,
      scriptName: script?.name ?? "Unknown",
      price: script?.price ?? 0,
      escrowKey: generateEscrowKey(item.scriptId),
    };
  });

  const totalAmount = orderItems.reduce((sum, i) => sum + i.price, 0);
  const escrowKeys = orderItems.map((i) => i.escrowKey);

  const [order] = await db
    .insert(ordersTable)
    .values({
      customerEmail,
      customerName,
      items: orderItems,
      totalAmount,
      status: "paid",
      escrowKeys,
    })
    .returning();

  for (const scriptId of scriptIds) {
    const script = scriptMap[scriptId];
    if (script) {
      await db
        .update(scriptsTable)
        .set({ downloadCount: (script.downloadCount ?? 0) + 1 })
        .where(eq(scriptsTable.id, scriptId));
    }
  }

  res.status(201).json(order);
});

ordersRouter.get("/:id", async (req, res) => {
  const parsed = GetOrderParams.safeParse({ id: req.params.id });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [order] = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, parsed.data.id));

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json(order);
});
