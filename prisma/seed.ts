import { Category } from "@prisma/client";
import { prisma } from "../src";

async function main() {
  // Create categories
  const createcategories = await prisma.category.createMany({
    data: [
      {
        name: "Electronics",
        description: "Electronic devices and accessories",
      },
      { name: "Home Appliances", description: "Appliances for home use" },
      { name: "Clothing", description: "Clothing and apparel" },
      { name: "Furniture", description: "Furniture items for home and office" },
      { name: "Books", description: "Books on various topics" },
      {
        name: "Sporting Goods",
        description: "Equipment for sports and outdoor activities",
      },
    ],
  });

  const categories = await prisma.category.findMany();
  // Get the IDs of the created categories
  const categoryIds = categories.map((category: Category) => category.id);

  // Create products with randomly selected category IDs
  const products = [
    {
      name: "Wireless Mouse",
      description: "A high precision wireless mouse",
      price: 29.99,
      stock: 150,
      categoryId: getRandomCategoryId(categoryIds),
    },
    {
      name: "Mechanical Keyboard",
      description: "A mechanical keyboard with customizable RGB lighting",
      price: 79.99,
      stock: 100,
      categoryId: getRandomCategoryId(categoryIds),
    },
    {
      name: "USB-C Hub",
      description: "A multi-port USB-C hub with HDMI, USB 3.0, and Ethernet",
      price: 45.99,
      stock: 200,
      categoryId: getRandomCategoryId(categoryIds),
    },
    {
      name: "4K Monitor",
      description: "A 27-inch 4K monitor with HDR support",
      price: 399.99,
      stock: 75,
      categoryId: getRandomCategoryId(categoryIds),
    },
    {
      name: "Noise Cancelling Headphones",
      description: "Over-ear headphones with active noise cancelling",
      price: 199.99,
      stock: 120,
      categoryId: getRandomCategoryId(categoryIds),
    },
  ];

  // Create products
  const createdProducts = await Promise.all(
    products.map((product) => prisma.product.create({ data: product })),
  );

  console.log("Products created:", createdProducts);
}

// Function to get a random category ID from the available category IDs
function getRandomCategoryId(categoryIds: string[]) {
  return categoryIds[Math.floor(Math.random() * categoryIds.length)];
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
