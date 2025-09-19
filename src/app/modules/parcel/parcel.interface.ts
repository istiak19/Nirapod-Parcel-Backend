import { Types } from "mongoose";

type parcelStatus = "Requested" | "Approved" | "Dispatched" | "In Transit" | "Delivered" | "Cancelled" | "Returned" | "Rescheduled";

export interface IParcelStatusLogs {
    status: parcelStatus;
    updateAt?: Date;
    updateBy: Types.ObjectId;
    location: string;
    note?: string
};

export interface IParcel {
    trackingId: string;
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
    rider?: Types.ObjectId;
    type: string;
    weight: number;
    fee: number;
    newDate?: Date;
    pickupAddress: string;
    deliveryAddress: string;
    deliveryDate: Date;
    currentStatus: parcelStatus;
    statusLogs: IParcelStatusLogs[];
    isBlocked: boolean,
};