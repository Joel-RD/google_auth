import { Router } from "express";
import { UserController } from "../controller/usersControllers.js";
import { isAuthenticated } from "../config.js";

export function createUserRouter(userController: UserController): Router {
    const router = Router();

    router.use(isAuthenticated);
    router.get("/api/userinfo", userController.getUserInfo);
    router.get("/settings", userController.getSettings);
    router.post("/settings", userController.updatePassword);

    return router;
}
