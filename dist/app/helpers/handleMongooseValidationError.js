"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMongooseValidationError = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const handleMongooseValidationError = (err) => {
    const errorMessages = Object.values(err.errors).map((error) => ({
        field: error.path,
        value: error.value,
        message: error.message,
    }));
    return {
        statusCode: 400,
        message: "Validation failed",
        errorMessages
    };
};
exports.handleMongooseValidationError = handleMongooseValidationError;
