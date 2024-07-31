import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { prisma } from "..";
import { OrderSchema, UpdateOrderSchema } from "../schemas/OrderSchema";

// get all orders
export const getAllOrders: RequestHandler = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// get a single order by id
export const getOrderById: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw createHttpError(404, "Order not found!");
    }
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// create a new order
export const createOrder: RequestHandler = async (req, res, next) => {
  try {
    const orderData = OrderSchema.parse(req.body);
    const order = await prisma.order.create({ data: orderData });
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// update an existing order
export const updateOrder: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const order = await prisma.order.findUnique({ where: { id } });

    if (!order) {
      throw createHttpError(404, "Order not found!");
    }

    const orderBody = UpdateOrderSchema.parse(req.body);
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: orderBody,
    });
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// delete an order
export const deleteOrder: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const order = await prisma.product.findUnique({ where: { id } });

    if (!order) {
      throw createHttpError(404, "Order not found!");
    }

    await prisma.order.delete({ where: { id } });
    res.status(204).json({ message: "Order deleted successfully" });
  } catch (error) {
    next(error);
  }
};
