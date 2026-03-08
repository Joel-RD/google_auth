import swaggerJsdoc from "swagger-jsdoc";
import { appConfigMethod } from "../config.js";

const serverUrl = `http://localhost:${appConfigMethod.PORT_SERVER}`;

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Google Auth API",
      version: "1.0.0",
      description: "API de autenticación con Google. Autenticación mediante OAuth 2.0 con Google y verificación por email.",
    },
    servers: [
      {
        url: serverUrl,
        description: "Servidor de desarrollo",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "connect.sid",
          description: "Cookie de sesión",
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
    tags: [
      { name: "Auth", description: "Endpoints de autenticación" },
      { name: "User", description: "Endpoints de usuario" },
    ],
  },
  apis: ["./src/routers/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
