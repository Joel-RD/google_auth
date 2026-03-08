import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../services/jwt.js";

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const jwtAuthMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};
