import { Router } from "express";
import { suggestionController } from "./suggestion.controller.js";
const router = Router();
router.get("/", suggestionController);
export const suggestionRoute = router;
