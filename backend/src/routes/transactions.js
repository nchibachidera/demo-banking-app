import express from 'express';
import auth from '../middleware/auth.js';
import { listTransactions } from '../controllers/transactionController.js';  // ✅ match name

const router = express.Router();

router.get('/', auth, listTransactions);  // ✅ correct function
export default router;

