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
    EMAIL_SENDER: {
        SMTP_HOST: string;
        SMTP_PORT: string;
        SMTP_USER: string;
        SMTP_PASS: string;
        SMTP_FROM: string
    };
    REDIS: {
        REDIS_HOST: string;
        REDIS_PORT: string;
        REDIS_PASSWORD: string
    };
    CLOUDINARY: {
        CLOUDINARY_CLOUD_NAME: string;
        CLOUDINARY_API_KEY: string;
        CLOUDINARY_API_SECRET: string
    };
};

const loadEnvVariable = (): IEnv => {
    const requiredVariable: string[] = ["PORT", "DB_URL", "NODE_ENV", "FRONTEND_URL", "JWT_SECRET", "JWT_EXPIRES_IN", "JWT_REFRESH_EXPIRES_IN", "JWT_REFRESH_SECRET", "EXPRESS_SESSION_SECRET", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_CALLBACK_URL", "SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM", "REDIS_HOST", "REDIS_PORT", "REDIS_PASSWORD", "CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"];

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
        },
        EMAIL_SENDER: {
            SMTP_HOST: process.env.SMTP_HOST as string,
            SMTP_PORT: process.env.SMTP_PORT as string,
            SMTP_USER: process.env.SMTP_USER as string,
            SMTP_PASS: process.env.SMTP_PASS as string,
            SMTP_FROM: process.env.SMTP_FROM as string
        },
        REDIS: {
            REDIS_HOST: process.env.REDIS_HOST as string,
            REDIS_PORT: process.env.REDIS_PORT as string,
            REDIS_PASSWORD: process.env.REDIS_PASSWORD as string,
        },
        CLOUDINARY: {
            CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
            CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
            CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string
        }
    };
};

export const envVars = loadEnvVariable();