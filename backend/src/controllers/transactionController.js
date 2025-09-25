import db from '../config/db.js';

export async function listTransactions(req, res) {
  try {
    const userId = req.user.id;
    const tx = await db.query('SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    res.json(tx.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}
