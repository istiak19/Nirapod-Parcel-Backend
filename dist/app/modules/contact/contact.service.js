"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../../errors/AppError");
const contact_model_1 = require("./contact.model");
const getContact = () => __awaiter(void 0, void 0, void 0, function* () {
    const contact = yield contact_model_1.Contact.find();
    return contact;
});
const createContact = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const contact = yield contact_model_1.Contact.create(payload);
    const existingContact = yield contact_model_1.Contact.findOne({ email: payload.email });
    if (!existingContact) {
        throw new AppError_1.AppError(http_status_1.default.CONFLICT, "Contact with this email already exists");
    }
    ;
    return contact;
});
exports.contactService = {
    getContact,
    createContact
};
