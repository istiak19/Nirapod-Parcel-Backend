import { z } from "zod";

export const createParcelZodSchema = z.object({
    type: z.string(),
    weight: z.number().min(0.1),
    fee: z.number().min(0),
    pickupAddress: z.string(),
    currentStatus: z.enum(["Requested", "Approved", "Dispatched", "In Transit", "Delivered", "Cancelled"]).optional(),
    statusLogs: z.array(z.object({
        status: z.enum(["Requested", "Approved", "Dispatched", "In Transit", "Delivered", "Cancelled"]),
        note: z.string().optional()
    })).optional(),
    deliveryAddress: z.string(),
    deliveryDate: z.string(),
    receiver: z.string(),
});

export const updateParcelZodSchema = z.object({
    currentStatus: z.enum(["Requested", "Approved", "Dispatched", "In Transit", "Delivered", "Cancelled"]).optional(),
    statusLogs: z.array(
        z.object({
            status: z.enum(["Requested", "Approved", "Dispatched", "In Transit", "Delivered", "Cancelled"]),
            note: z.string().optional(),
            updateAt: z.string().optional(),
            updatedBy: z.string().optional()
        })
    ).optional(),
    isBlocked: z.boolean().optional(),
});