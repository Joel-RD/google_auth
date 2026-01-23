import { Request, Response } from "express";
import { IUserRepository } from "../repositories/interfaces/IUserRepository.js";
import { hashPassword } from "../utils/verifi_password.js";
import path from "path";

export class UserController {
    constructor(private userRepository: IUserRepository) { }

    getUserInfo = async (req: Request, res: Response) => {
        const userId = req.session.userId;
        if (!userId) return res.status(401).json({ error: "No autorizado" });

        const user = await this.userRepository.findByIdGoogle(userId);
        res.json(user);
    };

    getSettings = (req: Request, res: Response) => {
        res.sendFile(path.join(process.cwd(), "src", "public", "settings.html"));
    };

    updatePassword = async (req: Request, res: Response) => {
        const isStrongPassword = (pwd: string) => {
            const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{};':"\\|,.<>/?-]).{8,}$/;
            return strongRegex.test(pwd);
        };

        const userId = req.session.userId;
        const newPassword = req.body.password;

        if (!userId) return res.status(401).json({ error: "No autorizado" });

        if (!isStrongPassword(newPassword)) {
            return res.status(400).json({ error: "La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos." });
        }

        const user = await this.userRepository.findByIdGoogle(userId);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const hash = hashPassword(newPassword);
        await this.userRepository.update(userId, { password: hash });

        res.json("Contraseña actualizada exitosamente");
    };
}
