import { config } from "dotenv"
import { Request, Response, NextFunction } from "express"

config()

const { PORT, NODE_ENV, GOOGLE_ID_SECRET, GOOGLE_SECRET_CLIENT_PASSWORD, REDIRECT_URL, TOKEN_AUTHORIZED_SESSION, EMAIL_HOST, EMAIL_PORT, EMAIL_SECURE, EMAIL_USER, EMAIL_PASS, JWT_SECRET, JWT_REFRESH_SECRET } = process.env

/**
 * Application Configuration
 * @description Centralized configuration object derived from environment variables.
 */
export const appConfigMethod = {
  SECRET_CLIENT_ID: GOOGLE_ID_SECRET,
  SECRET_CLIENT_PASSWORD: GOOGLE_SECRET_CLIENT_PASSWORD,
  REDIRECT_URL_GOOGLE_AUTH: REDIRECT_URL,
  SECRET_TOKEN_AUTHORIZED: TOKEN_AUTHORIZED_SESSION,
  JWT_SECRET: JWT_SECRET,
  JWT_REFRESH_SECRET: JWT_REFRESH_SECRET,
  NODE_ENV: NODE_ENV,
  PORT_SERVER: PORT || 9287,
  EMAIL_HOST: EMAIL_HOST,
  EMAIL_PORT: EMAIL_PORT,
  EMAIL_SECURE: EMAIL_SECURE,
  EMAIL_USER: EMAIL_USER,
  EMAIL_PASS: EMAIL_PASS
}

//Console.log() solo en desarrollo
export const logIfDevelopment = (message: string) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(message);
  }
}


//isAuthenticated
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect("/");
}