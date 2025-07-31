"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsync = void 0;
const catchAsync = (fn) => {
    return (req, resizeBy, next) => {
        Promise.resolve(fn(req, resizeBy, next)).catch(next);
    };
};
exports.catchAsync = catchAsync;
