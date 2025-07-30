import httpStatus from 'http-status';
import { JwtPayload } from "jsonwebtoken";
import { generateTrackingId } from "../../utils/trackingID";
import { IParcel } from "./parcel.interface";
import { Parcel } from "./parcel.model";
import { AppError } from "../../errors/AppError";
import { User } from '../user/user.model';

// Sender Section
const getMeParcel = async (sender: JwtPayload) => {
    const isExistUser = await User.findById(sender.userId)
    if (!isExistUser) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found");
    };

    // if (isExistUser.isBlocked === "Blocked" || isExistUser.isBlocked === "Inactive" || isExistUser.isDelete == true) {
    //     throw new AppError(httpStatus.FORBIDDEN, "Your account is restricted from accessing parcel data.");
    // };

    const parcel = await Parcel.find({ sender: sender.userId });
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

    const parcel = await Parcel.findById(id).select("statusLogs");

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
            note: payload?.statusLogs?.[0]?.note || "Parcel has been requested by sender.",
        }],
    });
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

    if (isExistParcel.currentStatus === "Dispatched" || isExistParcel.currentStatus === "In Transit" || isExistParcel.currentStatus === "Delivered") {
        throw new AppError(httpStatus.FORBIDDEN, `Parcel cannot be canceled as it is already ${isExistParcel.currentStatus.toLowerCase()}.`);
    };

    const parcel = await Parcel.findByIdAndUpdate(id, { ...payload }, {
        runValidators: true,
        new: true
    });

    return parcel;
};

export const parcelService = {
    getMeParcel,
    statusLogParcel,
    createParcel,
    cancelParcel
};