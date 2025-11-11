import express, { Router } from "express";
import { login, logout, signup } from "../controllers/auth.controller";
import { protectRoute } from "../middleware/protectRoute";

const router: Router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/me', protectRoute, (req, res) => {
    res.json({
        succes: true,
    })
});

export default router;