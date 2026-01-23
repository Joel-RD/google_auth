import { Request, Response } from "express";
import { google } from "googleapis";
import { oauth2Client } from "../auth/google.js";
import { IUserRepository } from "../repositories/interfaces/IUserRepository.js";
import { IVerificationRepository } from "../repositories/interfaces/IVerificationRepository.js";
import { createToken, sendVerificationEmail } from "../services/emails.js";
import path from "path";

export class AuthController {
    constructor(
        private userRepository: IUserRepository,
        private verificationRepository: IVerificationRepository
    ) { }

    googleAuth = (req: Request, res: Response) => {
        const url = oauth2Client.generateAuthUrl({
            access_type: "offline",
            scope: [
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://www.googleapis.com/auth/userinfo.email",
            ],
        });
        res.redirect(url);
    };

    googleCallback = async (req: Request, res: Response) => {
        const code = req.query.code as string;
        if (!code) return res.redirect("/");

        try {
            const { tokens } = await oauth2Client.getToken(code);
            oauth2Client.setCredentials(tokens);

            const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
            const userInfo = await oauth2.userinfo.v2.me.get();

            if (!userInfo.data.id || !userInfo.data.email) {
                return res.status(500).send("Error al obtener información del usuario");
            }

            const existingUser = await this.userRepository.findByIdGoogle(userInfo.data.id);

            const userData = {
                id_google_account: userInfo.data.id,
                email: userInfo.data.email,
                name: userInfo.data.name || "",
                accessToken: tokens.access_token || "",
            };

            if (!existingUser) {
                await this.userRepository.create(userData);
            } else {
                await this.userRepository.update(userInfo.data.id, userData);
            }

            req.session.userId = userInfo.data.id;
            return res.redirect('/verify_account');
        } catch (err) {
            console.error("Error al obtener tokens:", err);
            return res.status(500).send("Error de autenticación");
        }
    };

    getVerifyAccount = async (req: Request, res: Response) => {
        const userId = req.session.userId;
        if (!userId) return res.redirect("/");

        const user = await this.userRepository.findByIdGoogle(userId);
        if (!user) return res.redirect("/");

        try {
            const sendCode = createToken();
            await sendVerificationEmail(user.email, sendCode);

            await this.verificationRepository.create({
                id_user: user.id,
                email: user.email,
                code: sendCode
            });

            res.sendFile(path.join(process.cwd(), "src", "public", "email_verift.html"));
        } catch (error) {
            console.error("Error al enviar email de verificación:", error);
            res.status(500).send("Error al enviar el código de verificación. Por favor, intenta de nuevo.");
        }
    };

    postVerifyAccount = async (req: Request, res: Response) => {
        const { code } = req.body;
        const userId = req.session.userId;
        if (!userId) return res.status(404).json({ error: "Sesión no encontrada" });

        const user = await this.userRepository.findByIdGoogle(userId);
        if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

        const verification = await this.verificationRepository.findByUserId(user.id);

        if (!verification || verification.code !== code) {
            return res.status(400).send("Código inválido");
        }

        if (verification.used) {
            return res.status(400).send("Código ya utilizado. Por favor, solicita uno nuevo.");
        }

        const now = new Date();
        const expiresAt = new Date(verification.expiresAt);
        if (now > expiresAt) {
            return res.status(400).send("El código ha expirado. Por favor, solicita uno nuevo.");
        }

        await this.verificationRepository.markAsUsed(verification.id);
        res.redirect("/");
    };

    logout = (req: Request, res: Response) => {
        req.session.destroy(err => {
            if (err) console.error(err);
            res.redirect("/");
        });
    };
}
