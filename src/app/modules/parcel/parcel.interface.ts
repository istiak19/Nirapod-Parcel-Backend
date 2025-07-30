import { Types } from "mongoose";

type parcelStatus = "Requested" | "Approved" | "Dispatched" | "In Transit" | "Delivered" | "Cancelled";

export interface IParcelStatusLogs {
    status: parcelStatus;
    updateAt?: Date;
    updateBy: Types.ObjectId;
    note?: string
};

export interface IParcel {
    trackingId: string;
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
    type: string;
    weight: number;
    fee: number;
    pickupAddress: string;
    deliveryAddress: string;
    deliveryDate: Date;
    currentStatus: parcelStatus;
    statusLogs: IParcelStatusLogs[];
    isBlocked: boolean,
};