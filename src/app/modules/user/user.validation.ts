import { z } from "zod";

export const createUserZodSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    role: z.enum(["Admin", "Receiver", "Sender", "Rider"]),
    password: z
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
    phone: z.string().regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
        message: "Invalid Bangladeshi phone number",
    }).optional(),
    address: z.string().min(5, { message: "Address must be at least 5 characters long" }).optional(),
});

export const updatedUserZodSchema = z.object({
    name: z.string().min(1, { message: "Name cannot be empty" }).optional(),
    phone: z.string().regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
        message: "Invalid Bangladeshi phone number",
    }).optional(),
    role: z.enum(["Admin", "Receiver", "Sender"]).optional(),
    isBlocked: z.enum(["Active", "Inactive", "Blocked"]).optional(),
    isStatus: z.enum(["Active", "Inactive", "Blocked"]).optional(),
    isDeleted: z.boolean().optional(),
    isVerified: z.boolean().optional(),
    address: z.string().min(1, { message: "Address cannot be empty" }).optional(),
});