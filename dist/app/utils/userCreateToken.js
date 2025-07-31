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
exports.createNewAccessTokenWithRefreshToken = exports.userCreateToken = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../errors/AppError");
const user_model_1 = require("../modules/user/user.model");
const jwt_1 = require("./jwt");
const env_config_1 = require("../config/env.config");
const userCreateToken = (user) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    };
    const accessToken = (0, jwt_1.generateToken)(jwtPayload, env_config_1.envVars.JWT.JWT_SECRET, env_config_1.envVars.JWT.JWT_EXPIRES_IN);
    const refreshToken = (0, jwt_1.generateToken)(jwtPayload, env_config_1.envVars.JWT.JWT_REFRESH_SECRET, env_config_1.envVars.JWT.JWT_REFRESH_EXPIRES_IN);
    return {
        accessToken,
        refreshToken
    };
};
exports.userCreateToken = userCreateToken;
const createNewAccessTokenWithRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedRefreshToken = (0, jwt_1.verifyToken)(refreshToken, env_config_1.envVars.JWT.JWT_REFRESH_SECRET);
    const isExist = yield user_model_1.User.findOne({ email: verifiedRefreshToken.email });
    if (!isExist) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "User does not exist");
    }
    ;
    if (isExist.isBlocked === "Blocked" || isExist.isBlocked === "Inactive") {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `User is ${isExist.isBlocked}`);
    }
    if (isExist.isDelete) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "User is deleted");
    }
    ;
    const jwtPayload = {
        userId: isExist._id,
        email: isExist.email,
        role: isExist.role
    };
    const accessToken = (0, jwt_1.generateToken)(jwtPayload, env_config_1.envVars.JWT.JWT_SECRET, env_config_1.envVars.JWT.JWT_EXPIRES_IN);
    return accessToken;
});
exports.createNewAccessTokenWithRefreshToken = createNewAccessTokenWithRefreshToken;
