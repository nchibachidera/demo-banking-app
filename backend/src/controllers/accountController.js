// controllers/accountController.js
import db from '../config/db.js';

export async function getAccount(req, res) {
  try {
    const userId = req.user.id;
    const acc = await db.query('SELECT * FROM accounts WHERE user_id = $1', [userId]);
    if (!acc.rows.length) return res.status(404).json({ message: 'Account not found' });
    res.json(acc.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function deposit(req, res) {
  try {
    const userId = req.user.id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // find account
    const accRes = await db.query('SELECT * FROM accounts WHERE user_id = $1', [userId]);
    const account = accRes.rows[0];

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // update balance
    const newBal = parseFloat(account.balance) + parseFloat(amount);
    await db.query('UPDATE accounts SET balance = $1 WHERE id = $2', [newBal, account.id]);

    // record transaction
    await db.query(
      'INSERT INTO transactions (user_id, type, amount) VALUES ($1,$2,$3)',
      [userId, 'deposit', amount]
    );

    res.json({ balance: newBal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function withdraw(req, res) {
  try {
    const userId = req.user.id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const accRes = await db.query('SELECT * FROM accounts WHERE user_id = $1', [userId]);
    const account = accRes.rows[0];

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (parseFloat(account.balance) < parseFloat(amount)) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    // update balance
    const newBal = parseFloat(account.balance) - parseFloat(amount);
    await db.query('UPDATE accounts SET balance = $1 WHERE id = $2', [newBal, account.id]);

    // record transaction
    await db.query(
      'INSERT INTO transactions (user_id, type, amount) VALUES ($1,$2,$3)',
      [userId, 'withdraw', amount]
    );

    res.json({ balance: newBal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}


