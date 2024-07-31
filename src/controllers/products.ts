import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { Prisma } from "@prisma/client";
import { prisma } from "..";
import { ProductSchema, UpdateProductSchema } from "../schemas/ProductSchema";
import { FiltersSchema } from "../schemas/ProductFilterSchema";

// get all products
// export const getAllProducts: RequestHandler = async (req, res, next) => {
//   try {
//     const filtersInput = FiltersSchema.parse(req.query);
//
//     const { lowerBound, upperBound, categories, tags, sort } = filtersInput;
//
//     // build the where clause
//     const whereClause = {
//       AND: [
//         lowerBound !== undefined || upperBound !== undefined
//           ? { price: { gte: lowerBound || 0, lte: upperBound || Infinity } }
//           : {},
//         categories ? { categoryId: { in: categories.split(",") } } : {},
//         tags ? { tags: { hasSome: tags?.split(",") } } : {},
//       ],
//     };
//
//     // order by clause
//     let orderByClause;
//     if (sort === "asc" || sort === "desc") {
//       orderByClause = { price: sort };
//     } else if (sort === "newest") {
//       orderByClause = { createdAt: "desc" };
//     }
//     const products = await prisma.product.findMany({
//       where: whereClause,
//       orderBy: orderByClause ? [orderByClause] : undefined,
//     });
//
//     res.status(200).json(products);
//   } catch (error) {
//     next(error);
//   }
// };

export const getAllProducts: RequestHandler = async (req, res, next) => {
  try {
    const filtersInput = FiltersSchema.parse(req.query);

    const { lowerBound, upperBound, categories, tags, sort } = filtersInput;

    // build the where clause
    const whereClause = {
      AND: [
        lowerBound !== undefined || upperBound !== undefined
          ? { price: { gte: lowerBound || 0, lte: upperBound || Infinity } }
          : {},
        categories ? { categoryId: { in: categories.split(",") } } : {},
        tags ? { tags: { hasSome: tags?.split(",") } } : {},
      ],
    };

    // order by clause
    let orderByClause: Prisma.ProductOrderByWithRelationInput | undefined;
    if (sort === "asc" || sort === "desc") {
      orderByClause = { price: sort };
    } else if (sort === "newest") {
      orderByClause = { createdAt: "desc" }; // Sort by newest items
    } else {
      orderByClause = { createdAt: "asc" };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: orderByClause ? [orderByClause] : undefined,
    });

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// get a single product by id
export const getProductById: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw createHttpError(404, "Product not found!");
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// create a new product
export const createProduct: RequestHandler = async (req, res, next) => {
  try {
    const productData = ProductSchema.parse(req.body);
    const product = await prisma.product.create({ data: productData });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// update an existing product
export const updateProduct: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw createHttpError(404, "Product not found!");
    }

    const productBody = UpdateProductSchema.parse(req.body);
    const updatedProduct = await prisma.product.update({
      where: {
        id,
      },
      data: productBody,
    });
    res.status(200).json(updatedProduct);
  } catch (error: any) {
    next(error);
  }
};

// delete a product
export const deleteProduct: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw createHttpError(404, "Product not found!");
    }

    await prisma.product.delete({ where: { id } });
    res.status(204).json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};
