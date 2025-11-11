import express, { Request, Response, Router } from "express";
import { login, logout, signup } from "../controllers/auth.controller";
import { protectRoute } from "../middleware/protectRoute";

const router: Router = express.Router();
interface AuthReq extends Request {
    user?: any;
}

router.post('/register', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protectRoute, (req: AuthReq, res: Response) => {
    res.json({
        user: req.user,
        succes: true,
    })
});

export default router;