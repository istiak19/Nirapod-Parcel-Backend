"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCookies = void 0;
;
const setCookies = (res, token) => {
    // if (token.accessToken) {
    //     res.cookie("accessToken", token.accessToken, {
    //         httpOnly: true,
    //         // secure: envVars.NODE_ENV === "production",
    //         // secure: true,
    //         // sameSite: "none"
    //         secure: process.env.NODE_ENV === "production",
    //         sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    //     });
    // }
    // if (token.refreshToken) {
    //     res.cookie("refreshToken", token.refreshToken, {
    //         httpOnly: true,
    //         // secure: envVars.NODE_ENV === "production",
    //         // secure: true,
    //         // sameSite: "none"
    //         secure: process.env.NODE_ENV === "production",
    //         sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    //     });
    // }
    if (token.accessToken) {
        res.cookie("accessToken", token.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
        });
    }
    if (token.refreshToken) {
        res.cookie("refreshToken", token.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 30 * 24 * 60 * 60 * 1000
        });
    }
};
exports.setCookies = setCookies;
