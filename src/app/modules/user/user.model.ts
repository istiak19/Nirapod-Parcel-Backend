import { model, Schema } from "mongoose";
import { IAuthProvider, IUser } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>({
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

const userSchema = new Schema<IUser>({
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
        type: [Schema.Types.ObjectId],
        ref: "parcel",
        default: []
    }
}, {
    versionKey: false,
    timestamps: true
});

export const User = model<IUser>("user", userSchema);