import httpStatus from 'http-status';
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { parcelService } from './parcel.service';
import { JwtPayload } from 'jsonwebtoken';

const getMeParcel = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;
    const parcel = await parcelService.getMeParcel(user);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Parcel retrieved successfully",
        data: parcel
    });
});

const statusLogParcel = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const statusLogs = await parcelService.statusLogParcel(id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Parcel status logs retrieved successfully.",
        data: statusLogs
    });
});

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

const cancelParcel = catchAsync(async (req: Request, res: Response) => {
    const sender = req.user as JwtPayload;
    const id = req.params.id;
    const payload = req.body;
    const parcel = await parcelService.cancelParcel(payload, sender, id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Parcel cancel successfully",
        data: parcel
    });
});

const incomingParcels = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;
    const parcel = await parcelService.incomingParcels(user.userId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Incoming parcels retrieved successfully",
        data: parcel
    });
});

const confirmDeliveryParcel = catchAsync(async (req: Request, res: Response) => {
    const receiver = req.user as JwtPayload;
    const id = req.params.id;
    const payload = req.body;
    const parcel = await parcelService.confirmDeliveryParcel(payload, receiver, id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Delivery confirmed successfully",
        data: parcel
    });
});

const deliveryHistoryParcel = catchAsync(async (req: Request, res: Response) => {
    const receiver = req.user as JwtPayload;
    const parcel = await parcelService.deliveryHistoryParcel(receiver);
    const isEmpty = !parcel || (Array.isArray(parcel) && parcel.length === 0);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: isEmpty ? "You have no delivered parcels yet." : "Parcel delivery history retrieved successfully",
        data: parcel
    });
});

export const parcelController = {
    getMeParcel,
    statusLogParcel,
    createParcel,
    cancelParcel,
    incomingParcels,
    confirmDeliveryParcel,
    deliveryHistoryParcel
};