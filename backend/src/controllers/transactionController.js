import db from '../config/db.js';

export async function listTransactions(req, res) {
  try {
    const userId = req.user.id;
    const accRes = await db.query('SELECT * FROM accounts WHERE user_id = $1', [userId]);
    const account = accRes.rows[0];
    const tx = await db.query('SELECT * FROM transactions WHERE account_id = $1 ORDER BY created_at DESC', [account.id]);
    res.json(tx.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}
