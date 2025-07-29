import httpStatus from 'http-status';
import sendResponse from "../../utils/sendResponse";
import { catchAsync } from '../../utils/catchAsync';
import { Request, Response } from 'express';
import { userService } from './user.service';

const allGetUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.allGetUser();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Users retrieved successfully successfully",
        data: user.user,
        meta: {
            total: user.totalUser
        }
    });
});

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
    allGetUser,
    createUser,
};