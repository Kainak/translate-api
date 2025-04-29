import { Router } from "express";

import {
  getActiveTasks,
  createTask,
  doneTask,
} from "../controllers/taskController.js";

const router = Router();
router.get("/", getActiveTasks);
router.post("/", createTask);
router.patch("/:_id/done", doneTask);

export default router;
