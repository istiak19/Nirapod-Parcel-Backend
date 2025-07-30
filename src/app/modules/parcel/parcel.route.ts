import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { createParcelZodSchema, updateParcelZodSchema } from "./parcel.validation";
import { parcelController } from "./parcel.controller";

const router = Router();

router.post("/", checkAuth("Sender"), validateRequest(createParcelZodSchema), parcelController.createParcel);
router.get("/me", checkAuth("Sender"), parcelController.getMeParcel);
router.get("/incoming", checkAuth("Receiver"), parcelController.incomingParcels);
router.get("/history", checkAuth("Receiver"), parcelController.deliveryHistoryParcel);
router.patch("/cancel/:id", checkAuth("Sender"), parcelController.cancelParcel);
router.get("/status-log/:id", checkAuth("Sender"), parcelController.statusLogParcel);
router.patch("/delivered/:id", checkAuth("Receiver"), validateRequest(updateParcelZodSchema), parcelController.confirmDeliveryParcel);

export const parcelRoutes = router;