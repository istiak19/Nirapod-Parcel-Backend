import httpStatus from 'http-status';
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { otpService } from './otpCode.service';

const sendOTP = catchAsync(async (req: Request, res: Response) => {
    const { email, name } = req.body
    const otpCode = await otpService.sendOTP(email, name)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "A verification code has been sent to your email address.",
        data: otpCode
    });
});

const verifyOTP = catchAsync(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const otpCode = await otpService.verifyOTP(email, otp);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "The OTP has been verified successfully.",
        data: otpCode
    });
});

export const otpController = {
    sendOTP,
    verifyOTP
};