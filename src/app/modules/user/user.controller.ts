import httpStatus from 'http-status';
import sendResponse from "../../utils/sendResponse";
import { catchAsync } from '../../utils/catchAsync';
import { Request, Response } from 'express';
import { userService } from './user.service';

const createUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.createUser(req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User created successfully",
        data: user
    });
});

export const userController = {
    createUser,
};