import { Router } from "express";
import { UserController } from "../controller/usersControllers.js";
import { isAuthenticated } from "../config.js";

/**
 * @swagger
 * /api/userinfo:
 *   get:
 *     summary: Obtener información del usuario
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario
 *       401:
 *         description: No autorizado
 * 
 * /settings:
 *   get:
 *     summary: Obtener página de configuración
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Archivo HTML de configuración
 * 
 *   post:
 *     summary: Actualizar contraseña
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: Nueva contraseña
 *     responses:
 *       200:
 *         description: Contraseña actualizada
 *       400:
 *         description: Contraseña inválida
 *       401:
 *         description: No autorizado
 */
export function createUserRouter(userController: UserController): Router {
    const router = Router();

    router.use(isAuthenticated);
    router.get("/api/userinfo", userController.getUserInfo);
    router.get("/settings", userController.getSettings);
    router.post("/settings", userController.updatePassword);

    return router;
}
