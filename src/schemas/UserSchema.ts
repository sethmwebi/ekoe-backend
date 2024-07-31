import { z } from "zod";

export const UserSchema = z.object({
  name: z.string(),
  email: z.string().email({ message: "Please enter a valid email address" }),
  image: z.string().optional(),
  password: z.string().optional(),
  emailVerified: z.coerce.date(),
  role: z.enum(["USER", "ADMIN", "SUPERADMIN"]).default("USER"),
});

// full product schema
export type UserSchemaType = z.infer<typeof UserSchema>;

// update user schema(all fields optional)
export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .optional(),
  image: z.string().optional(),
  password: z.string().optional(),
  emailVerified: z.coerce.date().optional(),
  role: z.enum(["USER", "ADMIN", "SUPERADMIN"]).default("USER").optional(),
});

export type UpdateUserSchemaType = z.infer<typeof UpdateUserSchema>;
