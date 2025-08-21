"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatedUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = require("zod");
exports.createUserZodSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    email: zod_1.z.string().email({ message: "Invalid email address" }),
    role: zod_1.z.enum(["Admin", "Receiver", "Sender"]),
    password: zod_1.z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .regex(/(?=.*[A-Z])/, {
        message: "Password must contain at least 1 uppercase letter",
    })
        .regex(/(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least 1 special character",
    })
        .regex(/(?=.*\d)/, {
        message: "Password must contain at least 1 number",
    }),
    phone: zod_1.z.string().regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
        message: "Invalid Bangladeshi phone number",
    }).optional(),
    address: zod_1.z.string().min(5, { message: "Address must be at least 5 characters long" }).optional(),
});
exports.updatedUserZodSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Name cannot be empty" }).optional(),
    phone: zod_1.z.string().regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
        message: "Invalid Bangladeshi phone number",
    }).optional(),
    role: zod_1.z.enum(["Admin", "Receiver", "Sender"]).optional(),
    isBlocked: zod_1.z.enum(["Active", "Inactive", "Blocked"]).optional(),
    isDeleted: zod_1.z.boolean().optional(),
    isVerified: zod_1.z.boolean().optional(),
    address: zod_1.z.string().min(1, { message: "Address cannot be empty" }).optional(),
});
