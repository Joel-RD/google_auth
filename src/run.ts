import app from "./app.js"
import { appConfigMethod, logIfDevelopment } from "./config.js"

/**
 * Server Entry Point
 * @description Starts the Express server on the configured port.
 */
const { PORT_SERVER } = appConfigMethod
app.listen(PORT_SERVER, () => {
    logIfDevelopment(`App run on port:${PORT_SERVER}\nURL: http://localhost:${PORT_SERVER}`)
}) 