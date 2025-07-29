import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middleware/checkAuth";

const router = Router();

router.get("/all-user", checkAuth("Admin"), userController.allGetUser);
router.post("/register", validateRequest(createUserZodSchema), userController.createUser);

export const userRoutes = router;