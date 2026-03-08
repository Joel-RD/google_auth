import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Demasiadas intentos. Por favor, intenta de nuevo en 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

export const verificationRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Demasiados códigos solicitados. Por favor, intenta de nuevo en 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});
