"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const authProviderSchema = new mongoose_1.Schema({
    provider: {
        type: String,
        required: true
    },
    providerId: {
        type: String,
        required: true
    }
}, {
    versionKey: false,
    _id: false
});
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    role: {
        type: String,
        enum: ["Admin", "Sender", "Receiver"],
        default: "Receiver"
    },
    phone: {
        type: String
    },
    picture: {
        type: String
    },
    address: {
        type: String
    },
    isBlocked: {
        type: String,
        enum: ["Active", "Inactive", "Blocked"],
        default: "Active"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isDelete: {
        type: Boolean,
        default: false
    },
    auths: [authProviderSchema],
    parcelId: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "parcel",
        default: []
    }
}, {
    versionKey: false,
    timestamps: true
});
exports.User = (0, mongoose_1.model)("user", userSchema);
