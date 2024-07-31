import { z } from "zod";

export const AddToCartSchema = z.object({
  userId: z.string(),
  productId: z.string(),
  quantity: z.number().int().positive(),
});

export const RemoveFromCartSchema = z.object({
  userId: z.string(),
  productId: z.string(),
});

export const GetCartSchema = z.object({
  userId: z.string(),
});

export const ChangeQuantitySchema = z.object({
  userId: z.string(),
  productId: z.string(),
  quantity: z.number().int().positive(),
});
