import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { prisma } from "..";
import { UpdateUserSchema, UserSchema } from "../schemas/UserSchema";

// get all users
export const getAllUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// get a single user by id
export const getUserById: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw createHttpError(404, "User not found!");
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// create a new user
export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const userData = UserSchema.parse(req.body);
    const user = await prisma.user.create({ data: userData });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

// update an existing user
export const updateUser: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw createHttpError(404, "User not found!");
    }

    const userBody = UpdateUserSchema.parse(req.body);
    const updatedUser = await prisma.user.update({
      where: { id },
      data: userBody!,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// Delete a user
export const deleteUser: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw createHttpError(404, "User not found!");
    }

    await prisma.user.delete({ where: { id } });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
