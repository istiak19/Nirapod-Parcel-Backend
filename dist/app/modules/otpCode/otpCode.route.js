"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpRoutes = void 0;
const express_1 = require("express");
const otpCode_controller_1 = require("./otpCode.controller");
const router = (0, express_1.Router)();
router.post("/send", otpCode_controller_1.otpController.sendOTP);
router.post("/verify", otpCode_controller_1.otpController.verifyOTP);
exports.OtpRoutes = router;
