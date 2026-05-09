import { Router } from "express";
import { suggestionController } from "./suggestion.controller";

const router = Router();
router.get("/", suggestionController);
export const suggestionRoute = router;
