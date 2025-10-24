import {config} from "dotenv"

config()

const {PORT, NODE_ENV, GOOGLE_ID_SECRET, GOOGLE_SECRET_CLIENT_PASSWORD, REDIRECT_URL, TOKEN_AUTHORIZED_SESSION} = process.env
export const appConfigMethod = {
    SECRET_CLIENT_ID: GOOGLE_ID_SECRET,
    SECRET_CLIENT_PASSWORD: GOOGLE_SECRET_CLIENT_PASSWORD,
    REDIRECT_URL_GOOGLE_AUTH: REDIRECT_URL,
    SECRET_TOKEN_AUTHORIZED: TOKEN_AUTHORIZED_SESSION,
    NODE_ENV: NODE_ENV,
    PORT_SERVER: PORT || 9287
}

//Console.log() solo en desarrollo
export const logIfDevelopment = (message: string) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(message);
  }
}
