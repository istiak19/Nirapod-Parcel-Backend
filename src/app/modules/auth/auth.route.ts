import { NextFunction, Request, Response, Router } from "express";
import { authController } from "./auth.controller";
import { envVars } from "../../config/env.config";
import passport from "passport";
import { checkAuth } from "../../middleware/checkAuth";

const router = Router();

router.post("/login", authController.credentialsLogin);
router.post("/refresh-token", authController.refreshTokenLogin);
router.post("/logout", authController.logout);
router.post("/change-password", checkAuth("Admin", "Sender", "Receiver"), authController.changePassword);
router.post("/reset-password", checkAuth("Admin", "Sender", "Receiver"), authController.resetPassword);
router.post("/set-password", checkAuth("Admin", "Sender", "Receiver"), authController.setPassword);
router.post("/forget-password", authController.forgetPassword);

// Google login
router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/";
    passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next)
});

router.get("/google/callback", passport.authenticate("google", { failureRedirect: `${envVars.FRONTEND_URL}/login?error=There is some issues with your account. Please contact with out support team!` }), authController.googleCallback);

export const authRoutes = router;