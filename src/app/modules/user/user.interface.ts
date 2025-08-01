import { Types } from "mongoose";

export interface IAuthProvider {
    provider: "credentials" | "google";
    providerId: string
};

export interface IUser {
    _id?: Types.ObjectId,
    name: string,
    email: string,
    password?: string,
    role: "Admin" | "Sender" | "Receiver";
    phone?: string;
    picture?: string;
    address?: string;
    isDelete?: boolean;
    isBlocked?: "Active" | "Inactive" | "Blocked";
    companyName?: string;
    isVerified?: boolean;
    auths: IAuthProvider[];
    parcelId?: Types.ObjectId[];
    createdAt?: Date
}