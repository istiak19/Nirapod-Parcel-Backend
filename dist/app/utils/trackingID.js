"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTrackingId = void 0;
const generateTrackingId = () => {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.random().toString(36).substr(2, 6);
    return `TRK-${datePart}-${randomPart}`;
};
exports.generateTrackingId = generateTrackingId;
