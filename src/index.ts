import "dotenv/config";
import express, { Express, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import env from "./utils/validEnv";
import { PrismaClient } from "@prisma/client";
import productsRouter from "./routes/products";
import { ZodError } from "zod";
import { formatZodError } from "./utils/format-errors";
import ordersRouter from "./routes/orders";
import passport from "passport";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";
import auth from "./middlewares/auth";
import cartRoutes from "./routes/cart";
import usersRouter from "./routes/users";
import cors from "cors";
require("./utils/passport-config.ts");

const app: Express = express();

const port = env.PORT || 5000;

export const prisma = new PrismaClient({ log: ["query"] });

app.use(express.json());

// app.use(helmet());
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}))
// app.use(
//   helmet.hsts({
//     maxAge: 86400,
//     includeSubDomains: true,
//   })
//  )
// app.use(helmet({ noSniff: true}))
app.use(cookieParser());
app.use(passport.initialize());
app.use(morgan("dev"));

// Enable cors for http://localhost:3000
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use("/", authRouter);
app.use("/v1/api", productsRouter);
app.use("/v1/api", usersRouter);
app.use("/v1/api", ordersRouter);
app.use("/v1/api", cartRoutes);

app.get("/", (req, res) => res.status(200).json({ message: "Welcome home!" }));
app.get("/protected", auth, (req: Request, res: Response) => {
  res.status(200).send("Protected route access granted");
});

(async () => {
  try {
    await prisma.$connect();
    app.listen(port, () => console.log(`Server listening on port ${port}`));
  } catch (error) {
    console.error("Error connecting to Prisma:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();

app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  let errorMessage = "An unknown error occurred";
  let statusCode = 500;
  if (error instanceof ZodError) {
    return res.status(400).json({ error: formatZodError(error) });
  }
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  /* res.status(statusCode).json({ error: errorMessage }); */
  res.json({ message: error.message });
});
