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
exports.otpService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const crypto_1 = __importDefault(require("crypto"));
const user_model_1 = require("../user/user.model");
const AppError_1 = require("../../errors/AppError");
const sendMail_1 = require("../../utils/sendMail");
const redis_1 = require("../../config/redis");
const OTP_EXPIRATION_SECONDS = 2 * 60;
const generateOTP = (length = 6) => {
    const otp = crypto_1.default.randomInt(10 ** (length - 1), 10 ** length).toString();
    return otp;
};
const sendOTP = (email, name) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "User not found");
    }
    ;
    if (user.isVerified) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "You are already verified");
    }
    ;
    const otp = generateOTP();
    const redisKey = `otp:${email}`;
    yield redis_1.redisClient.set(redisKey, otp, {
        expiration: {
            type: "EX",
            value: OTP_EXPIRATION_SECONDS
        }
    });
    yield (0, sendMail_1.sendMail)({
        to: email,
        subject: "Your OTP Code",
        templateName: "otpCode",
        templateData: {
            name: name,
            otp: otp
        }
    });
});
const verifyOTP = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "User not found");
    }
    ;
    if (user.isVerified) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "You are already verified");
    }
    ;
    const redisKey = `otp:${email}`;
    const savedOtp = yield redis_1.redisClient.get(redisKey);
    if (!savedOtp) {
        throw new AppError_1.AppError(401, "Invalid OTP");
    }
    ;
    if (savedOtp !== otp) {
        throw new AppError_1.AppError(401, "Invalid OTP");
    }
    ;
    yield Promise.all([
        user_model_1.User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
        redis_1.redisClient.del([redisKey])
    ]);
});
exports.otpService = {
    sendOTP,
    verifyOTP
};
