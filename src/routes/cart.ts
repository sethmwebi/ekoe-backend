import { Router } from "express";
import * as CartControllers from "../controllers/cart";
import auth from "../middlewares/auth";

const cartRoutes = Router();

cartRoutes.get("/cart/:userId", [auth], CartControllers.getCart);
cartRoutes.post("/cart/add", [auth], CartControllers.addToCart);
cartRoutes.put("/cart/update-quantity", [auth], CartControllers.changeQuantity);
cartRoutes.delete(
  "/cart/remove/:userId/:productId",
  [auth],
  CartControllers.removeFromCart,
);
cartRoutes.delete("/cart/clear", [auth], CartControllers.clearCart);

export default cartRoutes;
