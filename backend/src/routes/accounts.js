import express from 'express';
import auth from '../middleware/auth.js';
import { getAccount, deposit, withdraw } from '../controllers/accountController.js';

const router = express.Router();

// Change this line:
router.get('/me', auth, getAccount); // <-- use /me so frontend can call /accounts/me
router.post('/deposit', auth, deposit);
router.post('/withdraw', auth, withdraw);

export default router;

