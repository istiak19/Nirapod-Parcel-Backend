import dotenv from "dotenv";
dotenv.config();

interface IEnv {
    PORT: string;
    DB_URL: string;
    NODE_ENV: "development" | "production";
    FRONTEND_URL: string;
    JWT: {
        JWT_SECRET: string;
        JWT_EXPIRES_IN: string;
        JWT_REFRESH_EXPIRES_IN: string;
        JWT_REFRESH_SECRET: string;
    };
    EXPRESS_SESSION_SECRET: string;
    GOOGLE: {
        GOOGLE_CLIENT_ID: string;
        GOOGLE_CLIENT_SECRET: string;
        GOOGLE_CALLBACK_URL: string
    };
};

const loadEnvVariable = (): IEnv => {
    const requiredVariable: string[] = ["PORT", "DB_URL", "NODE_ENV", "FRONTEND_URL", "JWT_SECRET", "JWT_EXPIRES_IN", "JWT_REFRESH_EXPIRES_IN", "JWT_REFRESH_SECRET", "EXPRESS_SESSION_SECRET", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_CALLBACK_URL"];

    requiredVariable.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing required environment variable: ${key}`)
        }
    });

    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.DB_URL as string,
        NODE_ENV: process.env.NODE_ENV as "development" | "production",
        FRONTEND_URL: process.env.FRONTEND_URL as string,
        JWT: {
            JWT_SECRET: process.env.JWT_SECRET as string,
            JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,
            JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
            JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN as string,
        },
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
        GOOGLE: {
            GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
            GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
            GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
        }
    };
};

export const envVars = loadEnvVariable();