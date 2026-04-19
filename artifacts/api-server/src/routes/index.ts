import { Router, type IRouter } from "express";
import healthRouter from "./health";
import { scriptsRouter } from "./scripts";
import { categoriesRouter } from "./categories";
import { ordersRouter } from "./orders";
import { reviewsRouter } from "./reviews";
import { storeRouter } from "./store";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/scripts", scriptsRouter);
router.use("/scripts/:scriptId/reviews", reviewsRouter);
router.use("/categories", categoriesRouter);
router.use("/orders", ordersRouter);
router.use("/store", storeRouter);

export default router;
