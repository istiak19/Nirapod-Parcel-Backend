"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCookies = void 0;
const env_config_1 = require("../config/env.config");
;
const setCookies = (res, token) => {
    if (token.accessToken) {
        res.cookie("accessToken", token.accessToken, {
            httpOnly: true,
            secure: env_config_1.envVars.NODE_ENV === "production",
            sameSite: "none"
        });
    }
    if (token.refreshToken) {
        res.cookie("refreshToken", token.refreshToken, {
            httpOnly: true,
            secure: env_config_1.envVars.NODE_ENV === "production",
            sameSite: "none"
        });
    }
};
exports.setCookies = setCookies;
