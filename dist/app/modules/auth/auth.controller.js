"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const AppError_1 = require("../../errors/AppError");
const passport_1 = __importDefault(require("passport"));
const userCreateToken_1 = require("../../utils/userCreateToken");
const setCookies_1 = require("../../utils/setCookies");
const env_config_1 = require("../../config/env.config");
const auth_service_1 = require("./auth.service");
const credentialsLogin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("local", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return next(new AppError_1.AppError(401, err));
        }
        ;
        if (!user) {
            return next(new AppError_1.AppError(401, info.message));
        }
        ;
        const userTokens = yield (0, userCreateToken_1.userCreateToken)(user);
        (0, setCookies_1.setCookies)(res, userTokens);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _a = user.toObject(), { password } = _a, rest = __rest(_a, ["password"]);
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.OK,
            message: "User logged in successfully",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest
            }
        });
    }))(req, res, next);
}));
const refreshTokenLogin = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    const tokenInfo = yield auth_service_1.authService.credentialsLoginRefresh(refreshToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User logged in successfully",
        data: tokenInfo
    });
}));
const logout = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // res.clearCookie("accessToken", {
    //     httpOnly: true,
    //     secure: false,
    //     sameSite: "lax"
    // });
    // res.clearCookie("refreshToken", {
    //     httpOnly: true,
    //     secure: false,
    //     sameSite: "lax"
    // });
    res.cookie("accessToken", "", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 0,
        path: "/"
    });
    res.cookie("refreshToken", "", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 0,
        path: "/"
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User logout in successfully",
        data: null
    });
}));
const changePassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = req.body;
    const decodedToken = req.user;
    const user = yield auth_service_1.authService.changePassword(oldPassword, newPassword, decodedToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Password changed successfully",
        data: user
    });
}));
const resetPassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, newPassword } = req.body;
    const decodedToken = req.user;
    const response = yield auth_service_1.authService.resetNewPassword(id, newPassword, decodedToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Password changed successfully",
        // data: null
        data: response
    });
}));
const setPassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    const decodedToken = req.user;
    const result = yield auth_service_1.authService.setPassword(decodedToken.userId, password);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Password set password successfully",
        data: result
    });
}));
const forgetPassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const response = yield auth_service_1.authService.forgetPassword(email);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Email sent successfully",
        data: response
    });
}));
const googleCallback = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let redirect = req.query.state ? String(req.query.state) : "";
    if (redirect.startsWith("/")) {
        redirect = redirect.slice(1);
    }
    ;
    // console.log(user)
    if (!user) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "User not found");
    }
    const tokenInfo = (0, userCreateToken_1.userCreateToken)(user);
    (0, setCookies_1.setCookies)(res, tokenInfo);
    res.redirect(`${env_config_1.envVars.FRONTEND_URL}/${redirect}`);
}));
exports.authController = {
    credentialsLogin,
    refreshTokenLogin,
    logout,
    changePassword,
    resetPassword,
    setPassword,
    forgetPassword,
    googleCallback
};
