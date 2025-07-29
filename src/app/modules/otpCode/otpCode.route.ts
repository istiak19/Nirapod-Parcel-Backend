import { Router } from "express";
import { otpController } from "./otpCode.controller";

const router = Router();

router.post("/send", otpController.sendOTP);
router.post("/verify", otpController.verifyOTP);

export const OtpRoutes = router;