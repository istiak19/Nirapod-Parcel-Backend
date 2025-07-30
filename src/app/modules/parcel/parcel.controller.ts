import httpStatus from 'http-status';
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { parcelService } from './parcel.service';
import { JwtPayload } from 'jsonwebtoken';

const createParcel = catchAsync(async (req: Request, res: Response) => {
    const senderId = req.user as JwtPayload;
    const payload = req.body;
    const parcel = await parcelService.createParcel(payload, senderId.userId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Parcel created successfully",
        data: parcel
    });
});

export const parcelController = {
    createParcel
};