import httpStatus from 'http-status';
import { JwtPayload } from "jsonwebtoken";
import { generateTrackingId } from "../../utils/trackingID";
import { IParcel } from "./parcel.interface";
import { Parcel } from "./parcel.model";
import { AppError } from "../../errors/AppError";
import { User } from '../user/user.model';
import { QueryBuilder } from '../../utils/QueryBuilder/QueryBuilder';

const getTrackingParcel = async (user: JwtPayload, id: string) => {
    const isExistUser = await User.findById(user.userId);
    if (!isExistUser) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found");
    };

    const parcel = await Parcel.findOne({ trackingId: id }).select("statusLogs");

    if (!parcel) {
        throw new AppError(httpStatus.NOT_FOUND, "Parcel not found with the provided tracking ID");
    };

    return parcel;
};

// Sender Section
const getMeParcel = async (sender: JwtPayload) => {
    const isExistUser = await User.findById(sender.userId);
    if (!isExistUser) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found");
    };

    // if (isExistUser.isBlocked === "Blocked" || isExistUser.isBlocked === "Inactive" || isExistUser.isDelete == true) {
    //     throw new AppError(httpStatus.FORBIDDEN, "Your account is restricted from accessing parcel data.");
    // };

    const parcel = await Parcel.find({ sender: sender.userId })
        .populate("sender", "name email")
        .populate("receiver", "name email phone");
    return parcel;
};

const statusLogParcel = async (id: string) => {
    const isExistParcel = await Parcel.findById(id);

    if (!isExistParcel) {
        throw new AppError(httpStatus.BAD_REQUEST, "Parcel not found");
    };

    if (isExistParcel.isBlocked) {
        throw new AppError(httpStatus.FORBIDDEN, "This parcel is blocked and cannot be accessed.");
    };

    const parcel = await Parcel.findById(id).select("statusLogs").populate("statusLogs.updateBy", "name email");

    return parcel;
};

const createParcel = async (payload: Partial<IParcel>, senderId: string) => {
    const trackingId = generateTrackingId();
    const parcel = await Parcel.create({
        ...payload,
        trackingId,
        sender: senderId,
        statusLogs: [{
            status: payload?.statusLogs?.[0]?.status,
            updateBy: senderId,
            updateAt: new Date(),
            location: payload?.statusLogs?.[0]?.location || "Unknown",
            note: payload?.statusLogs?.[0]?.note || "Parcel has been requested by sender.",
        }],
    });

    const user = await User.findById(parcel.receiver);

    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found");
    };

    if (parcel.receiver?.toString() === user._id.toString()) {
        await User.findByIdAndUpdate(
            user._id,
            { $push: { parcelId: parcel._id } },
            { runValidators: true, new: true }
        );
    };

    return parcel;
};

const cancelParcel = async (payload: Partial<IParcel>, sender: JwtPayload, id: string) => {
    const isExistUser = await User.findById(sender.userId)
    if (!isExistUser) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found");
    };

    const isExistParcel = await Parcel.findById(id);

    if (!isExistParcel) {
        throw new AppError(httpStatus.BAD_REQUEST, "Parcel not found");
    };

    if (isExistParcel.isBlocked) {
        throw new AppError(httpStatus.FORBIDDEN, "This parcel is blocked and cannot be accessed.");
    };

    if (!payload.currentStatus) {
        throw new AppError(httpStatus.BAD_REQUEST, "Current status is required for status update.");
    };

    if (isExistParcel.currentStatus === "Dispatched" || isExistParcel.currentStatus === "In Transit" || isExistParcel.currentStatus === "Delivered") {
        throw new AppError(httpStatus.FORBIDDEN, `Parcel cannot be canceled as it is already ${isExistParcel.currentStatus.toLowerCase()}.`);
    };

    const updatedInfo = {
        currentStatus: payload.currentStatus,
        $push: {
            statusLogs: {
                status: payload?.statusLogs?.[0]?.status,
                updateBy: sender.userId,
                updateAt: new Date(),
                location: payload?.statusLogs?.[0]?.location || "Sender App",
                note: payload?.statusLogs?.[0]?.note || "Parcel has been cancelled by sender."
            }
        }
    };

    const parcel = await Parcel.findByIdAndUpdate(id, updatedInfo, {
        runValidators: true,
        new: true
    });

    return parcel;
};

// Receiver section
const incomingParcels = async (id: string) => {
    const isExistUser = await User.findById(id);
    if (!isExistUser) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found");
    };



    const parcel = await Parcel.find({ receiver: id })
        .populate("sender", "name email phone")
        .populate("receiver", "name email");
    return parcel;
};

const confirmDeliveryParcel = async (payload: Partial<IParcel>, receiver: JwtPayload, id: string) => {
    const isExistUser = await User.findById(receiver.userId);
    if (!isExistUser) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found");
    };

    const isExistParcel = await Parcel.findById(id);

    if (!isExistParcel) {
        throw new AppError(httpStatus.BAD_REQUEST, "Parcel not found");
    };

    if (isExistParcel.isBlocked) {
        throw new AppError(httpStatus.FORBIDDEN, "This parcel is blocked and cannot be accessed.");
    };

    if (!payload.currentStatus) {
        throw new AppError(httpStatus.BAD_REQUEST, "Current status is required for status update.");
    };

    if (isExistParcel.currentStatus !== "In Transit") {
        throw new AppError(httpStatus.FORBIDDEN, `Parcel can only be marked as 'Delivered' if it is currently 'In Transit'. Current status is '${isExistParcel.currentStatus}'.`);
    };

    const updatedInfo = {
        currentStatus: payload.currentStatus,
        $push: {
            statusLogs: {
                status: payload?.statusLogs?.[0]?.status,
                updateBy: receiver.userId,
                updateAt: new Date(),
                location: payload?.statusLogs?.[0]?.location || "Delivery Address",
                note: payload?.statusLogs?.[0]?.note
            }
        }
    };

    const parcel = await Parcel.findByIdAndUpdate(id, updatedInfo, {
        runValidators: true,
        new: true
    });

    return parcel;
};

const deliveryHistoryParcel = async (receiver: JwtPayload) => {
    const isExistUser = await User.findById(receiver.userId);
    if (!isExistUser) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found");
    };

    const isExistParcel = await Parcel.find({ currentStatus: "Delivered", receiver: receiver.userId });

    if (!isExistParcel) {
        throw new AppError(httpStatus.BAD_REQUEST, "Parcel not found");
    };

    return isExistParcel;
};

// Admin Section
const getAllParcel = async (token: JwtPayload, query: Record<string, string>) => {
    const isExistUser = await User.findById(token.userId);
    if (!isExistUser) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found");
    };

    const searchFields = ["currentStatus"];
    const queryBuilder = new QueryBuilder(Parcel.find(), query);

    const parcel = await queryBuilder
        .search(searchFields)
        .modelQuery
        .populate("sender", "name email")
        .populate("receiver", "name email");
    const totalParcel = await Parcel.countDocuments();
    return {
        parcel,
        totalParcel
    };
};

const statusParcel = async (payload: Partial<IParcel>, admin: JwtPayload, id: string) => {
    const isExistUser = await User.findById(admin.userId);
    if (!isExistUser) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found");
    };

    const isExistParcel = await Parcel.findById(id);

    if (!isExistParcel) {
        throw new AppError(httpStatus.BAD_REQUEST, "Parcel not found");
    };

    if (!payload.currentStatus) {
        throw new AppError(httpStatus.BAD_REQUEST, "Current status is required for status update.");
    };

    if (isExistParcel.currentStatus === "Delivered") {
        throw new AppError(httpStatus.FORBIDDEN, "Cannot change status. Parcel is already delivered.");
    };

    const updatedInfo = {
        currentStatus: payload.currentStatus,
        $push: {
            statusLogs: {
                status: payload?.statusLogs?.[0]?.status,
                updateBy: admin.userId,
                updateAt: new Date(),
                location: payload?.statusLogs?.[0]?.location || "Admin Office",
                note: payload?.statusLogs?.[0]?.note
            }
        }
    };

    const parcel = await Parcel.findByIdAndUpdate(id, updatedInfo, {
        runValidators: true,
        new: true
    });

    return parcel;
};

const isBlockedParcel = async (payload: Partial<IParcel>, admin: JwtPayload, id: string) => {
    const isExistUser = await User.findById(admin.userId);
    if (!isExistUser) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found");
    };

    const isExistParcel = await Parcel.findById(id);

    if (!isExistParcel) {
        throw new AppError(httpStatus.BAD_REQUEST, "Parcel not found");
    };

    if (typeof payload.isBlocked !== "boolean") {
        throw new AppError(httpStatus.BAD_REQUEST, "isBlocked field is required and must be a boolean");
    };

    if (payload.isBlocked === isExistParcel.isBlocked) {
        throw new AppError(httpStatus.BAD_REQUEST, `Parcel is already ${isExistParcel.isBlocked ? "blocked" : "unblocked"}.`);
    };

    const parcel = await Parcel.findByIdAndUpdate(id, { isBlocked: payload.isBlocked }, {
        runValidators: true,
        new: true
    });

    return parcel;
};

export const parcelService = {
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