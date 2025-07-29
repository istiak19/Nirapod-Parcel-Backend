import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createUserZodSchema } from "./user.validation";

const router = Router();

router.get("/all-user", userController.allGetUser);
router.post("/register", validateRequest(createUserZodSchema), userController.createUser);

export const userRoutes = router;