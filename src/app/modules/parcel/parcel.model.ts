import { model, Schema } from "mongoose";
import { IParcel, IParcelStatusLogs } from "./parcel.interface";

const statusLogSchema = new Schema<IParcelStatusLogs>({
    status: {
        type: String,
        enum: ["Requested", "Approved", "Dispatched", "In Transit", "Delivered", "Cancelled"]
    },
    updateBy: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    updateAt: {
        type: Date
    },
    location: {
        type: String
    },
    note: {
        type: String
    }
}, {
    versionKey: false,
    _id: false,
});

const parcelSchema = new Schema<IParcel>({
    trackingId: {
        type: String,
        required: true,
        unique: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    type: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    fee: {
        type: Number,
        required: true
    },
    pickupAddress: {
        type: String,
        required: true
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    deliveryDate: {
        type: Date,
        required: true
    },
    currentStatus: {
        type: String,
        enum: ["Requested", "Approved", "Dispatched", "In Transit", "Delivered", "Cancelled"],
        default: "Requested"
    },
    statusLogs: [statusLogSchema],
    isBlocked: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false,
    timestamps: true
});

export const Parcel = model<IParcel>("parcel", parcelSchema);