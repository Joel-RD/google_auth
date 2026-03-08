import * as jwt from "jsonwebtoken";
import { appConfigMethod } from "../config.js";

export interface JwtPayload {
  userId: string;
  email: string;
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, appConfigMethod.JWT_SECRET || "default_secret", {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, appConfigMethod.JWT_SECRET || "default_secret") as JwtPayload;
};

export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, appConfigMethod.JWT_SECRET || "default_secret", {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, appConfigMethod.JWT_REFRESH_SECRET || "default_refresh_secret", {
    expiresIn: "7d",
  });
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, appConfigMethod.JWT_REFRESH_SECRET || "default_refresh_secret") as JwtPayload;
};

export const rotateTokens = (refreshToken: string): { accessToken: string; refreshToken: string } | null => {
  try {
    const payload = verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch {
    return null;
  }
};
