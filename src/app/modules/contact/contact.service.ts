import httpStatus from 'http-status';
import { AppError } from "../../errors/AppError";
import { IContact } from "./contact.interface";
import { Contact } from "./contact.model";

const getContact = async () => {
    const contact = await Contact.find();
    return contact;
};

const createContact = async (payload: Partial<IContact>) => {
    const contact = await Contact.create(payload);

    const existingContact = await Contact.findOne({ email: payload.email });

    if (!existingContact) {
        throw new AppError(httpStatus.CONFLICT, "Contact with this email already exists");
    };

    return contact;
};

export const contactService = {
    getContact,
    createContact
};