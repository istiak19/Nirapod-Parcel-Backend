import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { createParcelZodSchema } from "./parcel.validation";
import { parcelController } from "./parcel.controller";

const router = Router();

router.post("/", checkAuth("Sender"), validateRequest(createParcelZodSchema), parcelController.createParcel);

export const parcelRoutes = router;