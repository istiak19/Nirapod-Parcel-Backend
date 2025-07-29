import httpStatus from 'http-status';
import crypto from "crypto";
import { User } from "../user/user.model";
import { AppError } from "../../errors/AppError";
import { sendMail } from '../../utils/sendMail';
import { redisClient } from '../../config/redis';

const OTP_EXPIRATION_SECONDS = 2 * 60;
const generateOTP = (length = 6) => {
    const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
    return otp;
};

const sendOTP = async (email: string, name: string) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User not found");
    };

    if (user.isVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, "You are already verified");
    };

    const otp = generateOTP();
    const redisKey = `otp:${email}`;
    await redisClient.set(redisKey, otp, {
        expiration: {
            type: "EX",
            value: OTP_EXPIRATION_SECONDS
        }
    });

    await sendMail({
        to: email,
        subject: "Your OTP Code",
        templateName: "otpCode",
        templateData: {
            name: name,
            otp: otp
        }
    });
};

const verifyOTP = async (email: string, otp: string) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User not found");
    };

    if (user.isVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, "You are already verified");
    };

    const redisKey = `otp:${email}`;
    const savedOtp = await redisClient.get(redisKey);
    if (!savedOtp) {
        throw new AppError(401, "Invalid OTP");
    };

    if (savedOtp !== otp) {
        throw new AppError(401, "Invalid OTP");
    };

    await Promise.all([
        User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
        redisClient.del([redisKey])
    ]);
};


export const otpService = {
    sendOTP,
    verifyOTP
};