import express, { Router } from "express";
import { roomController } from "../controllers/room.controller";
import protectRoute from "../middleware/protectRoute";

const router: Router = express.Router();

router.post('/room', protectRoute, roomController)


export default router;

