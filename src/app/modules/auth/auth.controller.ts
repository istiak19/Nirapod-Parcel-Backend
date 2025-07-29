/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AppError } from '../../errors/AppError';
import passport from 'passport';
import { userCreateToken } from '../../utils/userCreateToken';
import { setCookies } from '../../utils/setCookies';
import { envVars } from '../../config/env.config';

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (err: any, user: any, info: any) => {
        if (err) {
            return next(new AppError(401, err));
        };

        if (!user) {
            return next(new AppError(401, info.message))
        };

        const userTokens = await userCreateToken(user);
        setCookies(res, userTokens);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...rest } = user.toObject();
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User logged in successfully",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest
            }
        });
    })(req, res, next);
});

const logout = catchAsync(async (req: Request, res: Response) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logout in successfully",
        data: null
    });
});

const googleCallback = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    let redirect = req.query.state ? String(req.query.state) : "";
    if (redirect.startsWith("/")) {
        redirect = redirect.slice(1);
    };

    // console.log(user)
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const tokenInfo = userCreateToken(user);
    setCookies(res, tokenInfo);

    res.redirect(`${envVars.FRONTEND_URL}/${redirect}`);
});

export const authController = {
    credentialsLogin,
    logout,
    googleCallback
};