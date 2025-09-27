import express from 'express';
import auth from '../middleware/auth.js';
import { getAccount, deposit, withdraw, transfer } from '../controllers/accountController.js';

const router = express.Router();

// Change this line:
router.get('/', auth, getAccount);
router.post('/deposit', auth, deposit);
router.post('/withdraw', auth, withdraw);
router.post('/transfer', auth, transfer);

export default router;

