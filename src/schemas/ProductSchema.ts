import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  stock: z.number(),
});

export type ProductSchemaType = z.infer<typeof ProductSchema>;

export const UpdateProductSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  stock: z.number().optional(),
});

export type UpdateProductSchemaType = z.infer<typeof UpdateProductSchema>;
