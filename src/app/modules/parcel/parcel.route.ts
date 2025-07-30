import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { createParcelZodSchema } from "./parcel.validation";
import { parcelController } from "./parcel.controller";

const router = Router();

router.post("/", checkAuth("Sender"), validateRequest(createParcelZodSchema), parcelController.createParcel);
router.get("/me", checkAuth("Sender"), parcelController.getMeParcel);
router.patch("/cancel/:id", checkAuth("Sender"), parcelController.cancelParcel);
router.get("/:id/status-log", checkAuth("Sender"), parcelController.statusLogParcel);

export const parcelRoutes = router;