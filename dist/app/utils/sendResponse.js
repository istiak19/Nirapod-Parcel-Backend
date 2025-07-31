"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
;
const sendResponse = (res, payload) => {
    const { statusCode, success, message, data, meta } = payload;
    res.status(statusCode).json({
        success,
        message,
        meta,
        data,
    });
};
exports.default = sendResponse;
