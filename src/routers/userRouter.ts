import { Router } from "express";
import userController from "../controllers/userController";

export const router = Router();

router.post("/registration", userController.registration);
router.post("/authorization", userController.authorization);
router.patch("/:id", userController.updateUser);
router.post("/generatePdf/pdf", userController.generatePdf);
router.delete("/:id", userController.deleteUser);
router.get("/user", userController.getUser);
router.get("/", userController.getUsers);