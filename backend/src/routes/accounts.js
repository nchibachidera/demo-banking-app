import express from 'express';
import auth from '../middleware/auth.js';
import { getAccount, deposit, withdraw } from '../controllers/accountController.js';
const router = express.Router();
router.get('/', auth, getAccount);
router.post('/deposit', auth, deposit);
router.post('/withdraw', auth, withdraw);
export default router;
