import { Router } from "express";
import { AuthController } from "../controller/authControllers.js";

export function createAuthRouter(authController: AuthController): Router {
    const router = Router();

    router.get("/google", authController.googleAuth);
    router.get("/google/callback", authController.googleCallback);
    router.get("/verify_account", authController.getVerifyAccount);
    router.post("/verify_account", authController.postVerifyAccount);
    router.get("/logout", authController.logout);

    return router;
}
