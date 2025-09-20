"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateParcelZodSchema = exports.createParcelZodSchema = void 0;
const zod_1 = require("zod");
exports.createParcelZodSchema = zod_1.z.object({
    type: zod_1.z.string(),
    weight: zod_1.z.number().min(0.1),
    fee: zod_1.z.number().min(0),
    pickupAddress: zod_1.z.string(),
    currentStatus: zod_1.z.enum(["Requested", "Approved", "Dispatched", "In Transit", "Delivered", "Cancelled", "Rescheduled", "Returned"]).optional(),
    statusLogs: zod_1.z.array(zod_1.z.object({
        status: zod_1.z.enum(["Requested", "Approved", "Dispatched", "In Transit", "Delivered", "Cancelled", "Rescheduled", "Returned"]),
        location: zod_1.z.string().optional(),
        note: zod_1.z.string().optional()
    })).optional(),
    deliveryAddress: zod_1.z.string(),
    deliveryDate: zod_1.z.string(),
    receiver: zod_1.z.string(),
});
exports.updateParcelZodSchema = zod_1.z.object({
    currentStatus: zod_1.z.enum(["Requested", "Approved", "Dispatched", "In Transit", "Delivered", "Cancelled", "Rescheduled", "Returned"]).optional(),
    statusLogs: zod_1.z.array(zod_1.z.object({
        status: zod_1.z.enum(["Requested", "Approved", "Dispatched", "In Transit", "Delivered", "Cancelled", "Rescheduled", "Returned"]),
        location: zod_1.z.string().optional(),
        note: zod_1.z.string().optional(),
        updateAt: zod_1.z.string().optional(),
        updatedBy: zod_1.z.string().optional()
    })).optional(),
    isBlocked: zod_1.z.boolean().optional(),
    rider: zod_1.z.string().optional()
});
