import { RequestHandler } from "express";
import {
  GetCartSchema,
  AddToCartSchema,
  RemoveFromCartSchema,
  ChangeQuantitySchema,
} from "../schemas/CartSchema";
import { prisma } from "..";
import createHttpError from "http-errors";

export const addToCart: RequestHandler = async (req, res, next) => {
  try {
    const { userId, productId, quantity } = AddToCartSchema.parse(req.body);

    await prisma.$transaction(async (prisma) => {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product || product.stock < quantity) {
        throw createHttpError(404, "Not enough stock available");
      }

      const existingItem = await prisma.cartItem.findUnique({
        where: { userId_productId: { userId, productId } },
      });

      if (existingItem) {
        await prisma.cartItem.update({
          where: { userId_productId: { userId, productId } },
          data: { quantity: existingItem.quantity + quantity },
        });
      } else {
        await prisma.cartItem.create({ data: { userId, productId, quantity } });
      }

      await prisma.product.update({
        where: { id: productId },
        data: { stock: product.stock - quantity },
      });

      res.status(existingItem ? 200 : 201).json({
        message: existingItem
          ? "Cart updated successfully"
          : "Cart created successfully",
      });
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromCart: RequestHandler = async (req, res, next) => {
  try {
    const { productId, userId } = RemoveFromCartSchema.parse(req.params);

    await prisma.$transaction(async (prisma) => {
      const existingItem = await prisma.cartItem.findUnique({
        where: { userId_productId: { userId, productId } },
      });

      if (!existingItem) {
        throw createHttpError(404, "Item not found in cart!");
      }

      await prisma.cartItem.delete({
        where: { userId_productId: { userId, productId } },
      });

      await prisma.product.update({
        where: { id: productId },
        data: {
          stock: {
            increment: existingItem.quantity,
          },
        },
      });

      res.status(200).json({ message: "Item removed from cart" });
    });
  } catch (error) {
    next(error);
  }
};

export const changeQuantity: RequestHandler = async (req, res, next) => {
  try {
    const { quantity, productId, userId } = ChangeQuantitySchema.parse(
      req.body,
    );

    await prisma.$transaction(async (prisma) => {
      const existingItem = await prisma.cartItem.findUnique({
        where: { userId_productId: { userId, productId } },
      });

      if (!existingItem) {
        throw createHttpError(404, "Cart item not found");
      }

      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw createHttpError(404, "Product not found");
      }

      const quantityChange = quantity - existingItem.quantity;

      if (product.stock < quantityChange) {
        throw createHttpError(400, "Not enough stock available");
      }

      await prisma.cartItem.update({
        where: { userId_productId: { userId, productId } },
        data: { quantity },
      });

      await prisma.product.update({
        where: { id: productId },
        data: { stock: product.stock - quantityChange },
      });

      res
        .status(200)
        .json({ message: "Cart item quantity updated successfully" });
    });
  } catch (error) {
    next(error);
  }
};

export const getCart: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = GetCartSchema.parse(req.params);

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    res.status(200).json(cartItems);
  } catch (error) {
    next(error);
  }
};

export const clearCart: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      throw createHttpError(401, "User not authenticated!");
    }

    await prisma.$transaction(async (prisma) => {
      const cartItems = await prisma.cartItem.findMany({
        // @ts-ignore
        where: { userId: user.id },
      });

      if (cartItems.length == 0) {
        return res.status(200).json({ message: "Cart is already empty" });
      }

      for (const cartItem of cartItems) {
        await prisma.product.update({
          where: { id: cartItem.productId },
          data: { stock: { increment: cartItem.quantity } },
        });
      }

      await prisma.cartItem.deleteMany({
        // @ts-ignore
        where: { userId: user.id },
      });
    });

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    next(error);
  }
};
