"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleZodError = void 0;
const handleZodError = (err) => {
    const errorMessages = err.issues.map((error) => ({
        field: error.path.join(" "),
        message: error.message,
    }));
    return {
        statusCode: 400,
        message: "Validation failed",
        errorMessages
    };
};
exports.handleZodError = handleZodError;
