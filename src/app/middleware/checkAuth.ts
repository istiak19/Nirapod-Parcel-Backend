import httpStatus from 'http-status';
import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { AppError } from "../errors/AppError";
import { envVars } from "../config/env.config";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        let accessToken: string | undefined;

        if (req.headers.authorization?.startsWith("Bearer ")) {
            accessToken = req.headers.authorization.split(" ")[1];
        } else if (req.cookies.accessToken) {
            accessToken = req.cookies.accessToken;
        }
        if (!accessToken) {
            throw new AppError(403, "Unauthorized access: No token provided");
        };

        const verifiedToken = verifyToken(accessToken, envVars.JWT.JWT_SECRET) as JwtPayload;

        const isExistUser = await User.findOne({ email: verifiedToken.email });

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

        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(403, `Unauthorized access: Insufficient role ${verifiedToken.role}`);
        };

        req.user = verifiedToken;
        next();
    } catch (err) {
        next(err)
    };
};