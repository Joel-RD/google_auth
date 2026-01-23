import express, { Request, Response } from "express"
import { appConfigMethod } from "./config.js"
import db from "./Database/db.js"
import session from "express-session";
import path from "path"

import { SqliteUserRepository } from "./repositories/implementations/SqliteUserRepository.js";
import { SqliteVerificationRepository } from "./repositories/implementations/SqliteVerificationRepository.js";
import { AuthController } from "./controller/authControllers.js";
import { UserController } from "./controller/usersControllers.js";
import { createAuthRouter } from "./routers/authRouters.js";
import { createUserRouter } from "./routers/userRouters.js";

/**
 * Express application instance.
 * @description Main configuration for the Express server, including middlewares,
 * dependency injection, and route definitions.
 */


const app = express();
const { SECRET_TOKEN_AUTHORIZED, NODE_ENV } = appConfigMethod;

let segureCookie = NODE_ENV !== "Production" ? false : true;
app.use(session({
    secret: SECRET_TOKEN_AUTHORIZED,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: segureCookie, maxAge: 24 * 60 * 60 * 1000 }//MaxAge 24 horas
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "src", "public")));

/**
 * Dependency Injection Setup
 * @description Initializing Repositories and Controllers for dependency injection.
 */

const userRepository = new SqliteUserRepository(db);
const verificationRepository = new SqliteVerificationRepository(db);

const authController = new AuthController(userRepository, verificationRepository);
const userController = new UserController(userRepository);

// Routes
app.get("/", async (req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), "src", "public", "index.html"))
});

app.use("/auth", createAuthRouter(authController));
// Backward compatibility for the root paths used in app.ts previously
app.get("/verify_account", authController.getVerifyAccount);
app.post("/verify_account", authController.postVerifyAccount);
app.get("/logout", authController.logout);

app.use("/", createUserRouter(userController));

export default app;