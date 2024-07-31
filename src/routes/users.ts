import { Router } from "express";
import * as UsersController from "../controllers/users";

const usersRouter = Router();

usersRouter.get("/users", UsersController.getAllUsers);
usersRouter.get("/users/:id", UsersController.getUserById);
usersRouter.post("/user", UsersController.createUser);
usersRouter.put("/user/:id", UsersController.updateUser);
usersRouter.delete("/user/:id", UsersController.deleteUser);

export default usersRouter;
