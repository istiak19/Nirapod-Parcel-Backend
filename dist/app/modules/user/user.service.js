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
exports.userService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../../errors/AppError");
const user_model_1 = require("./user.model");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const allGetUser = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield user_model_1.User.findById(token.userId);
    if (!isExistUser) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "User not found");
    }
    ;
    const user = yield user_model_1.User.find().select("-password");
    const totalUser = yield user_model_1.User.countDocuments();
    return {
        user,
        totalUser
    };
});
const getMeUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email }).select("-password");
    return user;
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id).select("-password");
    return user;
});
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    const isExist = yield user_model_1.User.findOne({ email });
    if (isExist) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "A user with this email already exists.");
    }
    ;
    const hashPassword = yield bcryptjs_1.default.hash(password, 10);
    const auth = {
        provider: "credentials",
        providerId: email
    };
    const user = yield user_model_1.User.create(Object.assign({ email, password: hashPassword, auths: [auth] }, rest));
    return user;
});
const userUpdate = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (decodedToken.role === "Sender" || decodedToken.role === "Receiver") {
        if (decodedToken.userId !== userId) {
            throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "You are not unauthorized");
        }
        ;
    }
    ;
    const isExistUser = yield user_model_1.User.findById(userId);
    if (!isExistUser) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "User not found");
    }
    ;
    // if (decodedToken.role === "ADMIN" && isExistUser.role === "SUPER_ADMIN") {
    //     throw new AppError(httpStatus.FORBIDDEN, "Only SUPER_ADMIN can assign this role");
    // };
    if (payload.role) {
        if (decodedToken.role === "Receiver" || decodedToken.role === "Sender") {
            throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, `Users with role '${decodedToken.role}' are not permitted to change roles.`);
        }
        ;
    }
    ;
    if (payload.isBlocked || payload.isDelete || payload.isVerified) {
        if (decodedToken.role === "Sender" || decodedToken.role === "Receiver") {
            throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, `Unauthorized access to modify user status. Your role '${decodedToken.role}' is not allowed. Only admins are permitted to perform this action.`);
        }
        ;
    }
    ;
    const userUpdated = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true
    }).select("-password");
    if (payload.picture && isExistUser.picture) {
        yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(isExistUser.picture);
    }
    ;
    return userUpdated;
});
exports.userService = {
    allGetUser,
    getMeUser,
    getSingleUser,
    createUser,
    userUpdate
};
