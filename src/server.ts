/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import { envVars } from "./app/config/env.config";
import app from "./app";
import { redisConnected } from "./app/config/redis";

const port = envVars.PORT;
let server: Server;

async function startServer() {
    try {
        await mongoose.connect(envVars.DB_URL);
        console.log("Connected to MongoDB!")
        server = app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`)
        })
    } catch (error) {
        console.log(error)
    }
};

(async () => {
    await redisConnected();
    await startServer();
    // await seedSuperAdmin();
})();

process.on("SIGTERM", () => {
    console.log("SIGTERM received. Gracefully shutting down...");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

process.on("SIGINT", () => {
    console.warn("SIGINT received. Gracefully shutting down...");
    if (server) {
        server.close(() => {
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
});

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Promise Rejection detected. Shutting down the server...");
    console.error("Error details:", err);
    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }
    process.exit(1)
});

// Promise.reject(new Error("I forgot to catch this promise"));

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception detected. Shutting down the server...");
    console.error("Error details:", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});