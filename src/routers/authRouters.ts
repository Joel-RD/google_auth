import { Router } from "express";
import { AuthController } from "../controller/authControllers.js";
import { authRateLimiter, verificationRateLimiter } from "../middleware/rateLimit.js";

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Iniciar autenticación con Google
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirecciona a Google OAuth
 * 
 * /auth/google/callback:
 *   get:
 *     summary: Callback de Google OAuth
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         description: Código de autorización de Google
 *     responses:
 *       302:
 *         description: Redirecciona a verificación de cuenta
 * 
 * /auth/verify_account:
 *   get:
 *     summary: Obtener página de verificación de cuenta
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Archivo HTML de verificación
 *       302:
 *         description: Redirecciona al inicio si no hay sesión
 * 
 *   post:
 *     summary: Verificar cuenta con código
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: Código de verificación enviado por email
 *     responses:
 *       200:
 *         description: Verificación exitosa
 *       400:
 *         description: Código inválido o expirado
 * 
 * /auth/logout:
 *   get:
 *     summary: Cerrar sesión
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirecciona al inicio
 */
export function createAuthRouter(authController: AuthController): Router {
    const router = Router();

    router.get("/google", authRateLimiter, authController.googleAuth);
    router.get("/google/callback", authController.googleCallback);
    router.get("/verify_account", verificationRateLimiter, authController.getVerifyAccount);
    router.post("/verify_account", authRateLimiter, authController.postVerifyAccount);
    router.get("/logout", authController.logout);

    return router;
}
