import { Response } from "express";
import { envVars } from "../config/env.config";

export interface AuthTokens {
    accessToken?: string;
    refreshToken?: string;
};

export const setCookies = (res: Response, token: AuthTokens) => {
    if (token.accessToken) {
        res.cookie("accessToken", token.accessToken, {
            httpOnly: true,
            secure: envVars.NODE_ENV === "production",
            sameSite: "none"
        });
    }
    if (token.refreshToken) {
        res.cookie("refreshToken", token.refreshToken, {
            httpOnly: true,
            secure: envVars.NODE_ENV === "production",
            sameSite: "none"
        });
    }
};