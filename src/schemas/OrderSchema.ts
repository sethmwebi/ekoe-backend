import { z } from "zod";

export const OrderSchema = z.object({
  status: z
    .enum([
      "SCHEDULED",
      "FAILED",
      "PARTIALLY_FULLFILLED",
      "AWAITING_PAYMENT",
      "BACK_ORDERED",
      "ON_HOLD",
      "REFUNDED",
      "RETURNED",
      "DELIVERED",
      "SHIPPED",
      "CANCELLED",
      "COMPLETED",
      "PROCESSING",
      "PENDING",
    ])
    .default("PENDING"),
  totalPrice: z.number(),
  userId: z.string(),
  // items: z.array(
  //   z.object({
  //     quantity: z.number().default(1),
  //     productId: z.string(),
  //     orderId: z.string(),
  //   }),
  // ).optional(),
  // payment: z
  //   .enum([
  //     "PENDING",
  //     "CHARGEBACK",
  //     "VOIDED",
  //     "CAPTURED",
  //     "AUTHORIZED",
  //     "PARTIALLY_REFUNDED",
  //     "FAILED",
  //     "COMPLETED",
  //     "REFUNDED",
  //   ])
  //   .default("PENDING"),
});

export type OrderSchemaType = z.infer<typeof OrderSchema>;

export const UpdateOrderSchema = z.object({
  status: z
    .enum([
      "SCHEDULED",
      "FAILED",
      "PARTIALLY_FULLFILLED",
      "AWAITING_PAYMENT",
      "BACK_ORDERED",
      "ON_HOLD",
      "REFUNDED",
      "RETURNED",
      "DELIVERED",
      "SHIPPED",
      "CANCELLED",
      "COMPLETED",
      "PROCESSING",
      "PENDING",
    ])
    .default("PENDING")
    .optional(),
  totalPrice: z.number().optional(),
  // items: z
  //   .array(
  //     z.object({
  //       quantity: z.number().default(1),
  //       productId: z.string(),
  //       orderId: z.string(),
  //     }),
  //   )
  //   .optional(),
  // payment: z
  //   .enum([
  //     "PENDING",
  //     "CHARGEBACK",
  //     "VOIDED",
  //     "CAPTURED",
  //     "AUTHORIZED",
  //     "PARTIALLY_REFUNDED",
  //     "FAILED",
  //     "COMPLETED",
  //     "REFUNDED",
  //   ])
  //   .default("PENDING")
  //   .optional(),
});

export type UpdateOrderSchemaType = z.infer<typeof UpdateOrderSchema>;
