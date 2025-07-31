import httpStatus from 'http-status';
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { parcelService } from './parcel.service';
import { JwtPayload } from 'jsonwebtoken';

const getTrackingParcel = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const trackingId = req.params.trackingId;
    const parcel = await parcelService.getTrackingParcel(decodedToken, trackingId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Parcel tracking retrieved successfully",
        data: parcel
    });
});

const getMeParcel = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const parcel = await parcelService.getMeParcel(decodedToken);
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
    const decodedToken = req.user as JwtPayload;
    const payload = req.body;
    const parcel = await parcelService.createParcel(payload, decodedToken.userId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Parcel created successfully",
        data: parcel
    });
});

const cancelParcel = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const id = req.params.id;
    const payload = req.body;
    const parcel = await parcelService.cancelParcel(payload, decodedToken, id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Parcel cancel successfully",
        data: parcel
    });
});

const incomingParcels = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const parcel = await parcelService.incomingParcels(decodedToken.userId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Incoming parcels retrieved successfully",
        data: parcel
    });
});

const confirmDeliveryParcel = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const id = req.params.id;
    const payload = req.body;
    const parcel = await parcelService.confirmDeliveryParcel(payload, decodedToken, id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Delivery confirmed successfully",
        data: parcel
    });
});

const deliveryHistoryParcel = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const parcel = await parcelService.deliveryHistoryParcel(decodedToken);
    const isEmpty = !parcel || (Array.isArray(parcel) && parcel.length === 0);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: isEmpty ? "You have no delivered parcels yet." : "Parcel delivery history retrieved successfully",
        data: parcel
    });
});

// Admin section
const getAllParcel = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const query = req.query;
    const parcel = await parcelService.getAllParcel(decodedToken, query as Record<string, string>);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Parcels retrieved successfully",
        data: parcel.parcel,
        meta: {
            total: parcel.totalParcel
        }
    });
});

const statusParcel = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const id = req.params.id;
    const payload = req.body;
    const parcel = await parcelService.statusParcel(payload, decodedToken, id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Parcel status updated successfully",
        data: parcel
    });
});

const isBlockedParcel = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const id = req.params.id;
    const payload = req.body;
    const parcel = await parcelService.isBlockedParcel(payload, decodedToken, id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Parcel block status updated successfully",
        data: parcel
    });
});

export const parcelController = {
    getTrackingParcel,
    getMeParcel,
    statusLogParcel,
    createParcel,
    cancelParcel,
    incomingParcels,
    confirmDeliveryParcel,
    deliveryHistoryParcel,
    getAllParcel,
    statusParcel,
    isBlockedParcel
};