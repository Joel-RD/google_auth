import { google, oauth2_v2 } from "googleapis"
import { appConfigMethod } from "../config"

const {SECRET_CLIENT_PASSWORD, SECRET_CLIENT_ID, REDIRECT_URL_GOOGLE_AUTH } = appConfigMethod;

export const oauth2Client = new google.auth.OAuth2(
    SECRET_CLIENT_ID,
    SECRET_CLIENT_PASSWORD,
    REDIRECT_URL_GOOGLE_AUTH
)