import { Router } from "express";
import * as OrderControllers from "../controllers/orders";

const ordersRouter: Router = Router();

ordersRouter.get("/orders", OrderControllers.getAllOrders);
ordersRouter.get("/order/:id", OrderControllers.getOrderById);
ordersRouter.post("/order", OrderControllers.createOrder);
ordersRouter.put("/order/:id", OrderControllers.updateOrder);
ordersRouter.delete("/order/:id", OrderControllers.deleteOrder);

export default ordersRouter;
