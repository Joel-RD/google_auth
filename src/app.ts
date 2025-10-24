import express, { Request, Response } from "express"
import { google } from "googleapis"
import { oauth2Client } from "./auth/google.js"
import { logIfDevelopment, appConfigMethod } from "./config.js"
import db from "./Database/db.js"
import session from "express-session";
import path from "path"

const app = express();
const { SECRET_TOKEN_AUTHORIZED, NODE_ENV } = appConfigMethod;

declare module "express-session" {
    interface SessionData {
        userId?: string;
    }
}

let segureCookie = NODE_ENV !== "Production" ? false : true;
app.use(session({
    secret: SECRET_TOKEN_AUTHORIZED,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: segureCookie, maxAge: 24 * 60 * 60 * 1000 }//MaxAge 24 horas
}))
app.use(express.static(path.join(process.cwd(), "src", "public")));


let auth = false;

app.get("/", async (req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), "src", "public", "index.html"))
});

app.get("/auth/google", async (req: Request, res: Response) => {
    if (auth) return res.redirect("/");
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ],
    });
    res.redirect(url)
})

app.get("/auth/google/callback", async (req: Request, res: Response) => {
    const code = req.query.code as string;
    if (code) {
        try {
            const { tokens } = await oauth2Client.getToken(code);
            oauth2Client.setCredentials(tokens);
            // auth = true;

            const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client })
            const userInfo = await oauth2.userinfo.v2.me.get();

            db.prepare(`
            INSERT OR REPLACE INTO users (id_google_account, email, name, accessToken) values (?, ?, ?, ?)
            `).run(
                userInfo.data.id,
                userInfo.data.email,
                userInfo.data.name,
                tokens.access_token,
            )

            req.session.userId = userInfo.data.id
            return res.redirect('/');
        } catch (err) {
            console.error("Error al obtener tokens:", err);
            return res.status(500).send("Error de autenticación");
        }
    }
    res.redirect('/');
});


app.get("/api/userinfo", async (req: Request, res: Response) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "No autenticado" });

    const user = db.prepare("SELECT * FROM users WHERE id_google_account = ?").get(userId);
    res.json(user);
});


app.get("/logout", (req: Request, res: Response) => {
    req.session.destroy(err => {
        if (err) console.error(err);
        res.redirect("/");
    });
});


export default app;