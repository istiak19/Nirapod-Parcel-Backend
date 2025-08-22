import httpStatus from 'http-status';
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { contactService } from './contact.service';

const getContact = catchAsync(async (req: Request, res: Response) => {
    const contact = await contactService.getContact();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Contacts retrieved successfully",
        data: contact
    });
});

const createContact = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const contact = await contactService.createContact(payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Contact created successfully",
        data: contact
    });
});

export const contactController = {
    getContact,
    createContact
};