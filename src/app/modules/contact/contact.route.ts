import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { contactController } from "./contact.controller";

const router = Router();

router.post("/", checkAuth("Admin", "Sender", "Receiver"),contactController.createContact);
router.get("/", checkAuth("Admin"),contactController.getContact);

export const contactRoutes = router;