"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDuplicateError = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const handleDuplicateError = (err) => {
    const duplicatedEmail = Object.keys(err.keyValue)[0];
    return {
        statusCode: 400,
        message: ` ${err.keyValue[duplicatedEmail]} already exists.`
    };
};
exports.handleDuplicateError = handleDuplicateError;
