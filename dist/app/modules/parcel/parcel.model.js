"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parcel = void 0;
const mongoose_1 = require("mongoose");
const statusLogSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: ["Requested", "Approved", "Dispatched", "In Transit", "Delivered", "Cancelled", "Rescheduled", "Returned"]
    },
    updateBy: {
        type: mongoose_1.Schema.Types.ObjectId,
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
const parcelSchema = new mongoose_1.Schema({
    trackingId: {
        type: String,
        required: true,
        unique: true
    },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        enum: ["Requested", "Approved", "Dispatched", "In Transit", "Delivered", "Cancelled", "Rescheduled", "Returned"],
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
exports.Parcel = (0, mongoose_1.model)("parcel", parcelSchema);
