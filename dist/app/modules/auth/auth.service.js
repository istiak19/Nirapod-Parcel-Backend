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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const userCreateToken_1 = require("../../utils/userCreateToken");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("../user/user.model");
const AppError_1 = require("../../errors/AppError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = require("../../config/env.config");
const sendMail_1 = require("../../utils/sendMail");
const credentialsLoginRefresh = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const newAccessToken = yield (0, userCreateToken_1.createNewAccessTokenWithRefreshToken)(refreshToken);
    return {
        accessToken: newAccessToken
    };
});
const changePassword = (oldPassword, newPassword, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(decodedToken.userId);
    const isOldPasswordMatch = yield bcryptjs_1.default.compare(oldPassword, user.password);
    if (!isOldPasswordMatch) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "The current password you entered is incorrect");
    }
    ;
    user.password = yield bcryptjs_1.default.hash(newPassword, 10);
    yield user.save();
});
const resetNewPassword = (id, newPassword, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (id !== decodedToken.userId) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "You can't reset password");
    }
    ;
    const user = yield user_model_1.User.findById(decodedToken.userId);
    if (!user) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "User dose not found");
    }
    ;
    user.password = yield bcryptjs_1.default.hash(newPassword, 10);
    yield user.save();
});
const setPassword = (userId, plainPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "User not found");
    }
    ;
    if (user.password && user.auths.some(providerObjects => providerObjects.provider === "google")) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "You signed up with Google. To login with email and password, please login with Google once and set a password from your profile settings.");
    }
    ;
    const hashPassword = yield bcryptjs_1.default.hash(plainPassword, 10);
    const credentialProvider = {
        provider: "credentials",
        providerId: user.email
    };
    const auths = [...user.auths, credentialProvider];
    user.auths = auths;
    user.password = hashPassword;
    yield user.save();
});
const forgetPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield user_model_1.User.findOne({ email });
    if (!isExistUser) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "User does not exist");
    }
    ;
    if (!isExistUser.isVerified) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "User is not verified");
    }
    ;
    if (isExistUser.isBlocked === "Blocked" || isExistUser.isBlocked === "Inactive") {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `User is ${isExistUser.isBlocked}`);
    }
    ;
    if (isExistUser.isDelete) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "User is deleted");
    }
    ;
    const payload = {
        userId: isExistUser._id,
        email: isExistUser.email,
        role: isExistUser.role
    };
    const resetToken = jsonwebtoken_1.default.sign(payload, env_config_1.envVars.JWT.JWT_SECRET, {
        expiresIn: "10m"
    });
    const resetUILink = `${env_config_1.envVars.FRONTEND_URL}/reset-password?id=${isExistUser._id}&token=${resetToken}`;
    (0, sendMail_1.sendMail)({
        to: isExistUser.email,
        subject: "Password Reset",
        templateName: "forgetPassword",
        templateData: {
            name: isExistUser.name,
            resetUILink
        }
    });
});
exports.authService = {
    credentialsLoginRefresh,
    changePassword,
    resetNewPassword,
    setPassword,
    forgetPassword
};
