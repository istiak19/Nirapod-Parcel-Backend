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
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const zod_1 = require("zod");
const env_config_1 = require("../config/env.config");
const AppError_1 = require("../errors/AppError");
const handleDuplicateError_1 = require("../helpers/handleDuplicateError");
const handleCastError_1 = require("../helpers/handleCastError");
const handleMongooseValidationError_1 = require("../helpers/handleMongooseValidationError");
const handleZodError_1 = require("../helpers/handleZodError");
const cloudinary_config_1 = require("../config/cloudinary.config");
const globalErrorHandler = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Something went wrong";
    // console.log({ file: req.files });
    if (req.file) {
        yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(req.file.path);
    }
    ;
    // if (req.files && Array.isArray(req.files) && req.files.length) {
    //     const imageUrls = (req.files as Express.Multer.File[]).map(file => file.path)
    //     await Promise.all(imageUrls.map(url => deleteImageFromCLoudinary(url)));
    // };
    //  // Duplicate Key Error
    if (err.code === 11000) {
        const simplified = (0, handleDuplicateError_1.handleDuplicateError)(err);
        statusCode = simplified.statusCode;
        message = simplified.message;
    }
    // CastError
    else if (err.name === "CastError") {
        const simplified = (0, handleCastError_1.handleCastError)(err);
        statusCode = simplified.statusCode;
        message = simplified.message;
    }
    // Mongoose ValidationError
    else if (err.name === "ValidationError") {
        const simplified = (0, handleMongooseValidationError_1.handleMongooseValidationError)(err);
        res.status(simplified.statusCode).json({
            success: false,
            message: simplified.message,
            errorMessages: simplified.errorMessages,
            error: {
                name: err.name || "Error",
                stack: env_config_1.envVars.NODE_ENV === "development" ? err.stack : undefined,
            },
        });
    }
    // Handle Zod Validation Error
    else if (err instanceof zod_1.ZodError) {
        const simplified = (0, handleZodError_1.handleZodError)(err);
        res.status(simplified.statusCode).json({
            success: false,
            message: simplified.message,
            errorMessages: simplified.errorMessages,
            error: {
                name: err.name || "Error",
                stack: env_config_1.envVars.NODE_ENV === "development" ? err.stack : undefined,
            },
        });
    }
    //   // AppError
    else if (err instanceof AppError_1.AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof Error) {
        message = err.message;
    }
    // Default error response
    res.status(statusCode).json({
        success: false,
        message,
        error: {
            name: err.name || "Error",
            stack: env_config_1.envVars.NODE_ENV === "development" ? err.stack : undefined,
        },
    });
});
exports.default = globalErrorHandler;
