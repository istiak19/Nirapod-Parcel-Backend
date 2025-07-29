/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createNewAccessTokenWithRefreshToken } from "../../utils/userCreateToken";
import bcrypt from "bcryptjs";
import httpStatus from 'http-status';
import { JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.model";
import { AppError } from "../../errors/AppError";
import { IAuthProvider } from "../user/user.interface";
import jwt from "jsonwebtoken";
import { envVars } from "../../config/env.config";
import { sendMail } from "../../utils/sendMail";

const credentialsLoginRefresh = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);

    return {
        accessToken: newAccessToken
    };
};

const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    const user = await User.findById(decodedToken.userId);
    const isOldPasswordMatch = await bcrypt.compare(oldPassword, user!.password as string);

    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "The current password you entered is incorrect");
    };
    user!.password = await bcrypt.hash(newPassword, 10);
    await user!.save();
};

const resetNewPassword = async (id: string, newPassword: string, decodedToken: JwtPayload) => {
    if (id !== decodedToken.userId) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You can't reset password");
    };
    const user = await User.findById(decodedToken.userId);
    if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User dose not found");
    };

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
};

const setPassword = async (userId: string, plainPassword: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    };

    if (user.password && user.auths.some(providerObjects => providerObjects.provider === "google")) {
        throw new AppError(httpStatus.BAD_REQUEST, "You signed up with Google. To login with email and password, please login with Google once and set a password from your profile settings.");
    };

    const hashPassword = await bcrypt.hash(plainPassword, 10);
    const credentialProvider: IAuthProvider = {
        provider: "credentials",
        providerId: user.email
    };
    const auths: IAuthProvider[] = [...user.auths, credentialProvider];

    user.auths = auths;
    user.password = hashPassword;
    await user.save();
};

const forgetPassword = async (email: string) => {
    const isExistUser = await User.findOne({ email });

    if (!isExistUser) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
    };

    if (!isExistUser.isVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
    };

    if (isExistUser.isBlocked === "Blocked" || isExistUser.isBlocked === "Inactive") {
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${isExistUser.isBlocked}`)
    };

    if (isExistUser.isDelete) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
    };

    const payload = {
        userId: isExistUser._id,
        email: isExistUser.email,
        role: isExistUser.role
    };

    const resetToken = jwt.sign(payload, envVars.JWT.JWT_SECRET, {
        expiresIn: "10m"
    });

    const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isExistUser._id}&token=${resetToken}`;

    sendMail({
        to: isExistUser.email,
        subject: "Password Reset",
        templateName: "forgetPassword",
        templateData: {
            name: isExistUser.name,
            resetUILink
        }
    });
};

export const authService = {
    credentialsLoginRefresh,
    changePassword,
    resetNewPassword,
    setPassword,
    forgetPassword
};