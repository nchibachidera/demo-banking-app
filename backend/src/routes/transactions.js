// routes/transactions.js
import express from 'express';
import auth from '../middleware/auth.js';
import { getTransactions } from '../controllers/transactionController.js';

const router = express.Router();

// GET /api/transactions
router.get('/', auth, getTransactions);

export default router;

