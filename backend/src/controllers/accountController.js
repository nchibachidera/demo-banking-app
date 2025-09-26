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

export async function transfer(req, res) {
  try {
    const userId = req.user.id;
    const { toAccountNumber, amount, description } = req.body;

    if (!toAccountNumber || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid transfer details' });
    }

    // Find sender account
    const senderRes = await db.query('SELECT * FROM accounts WHERE user_id = $1', [userId]);
    const senderAccount = senderRes.rows[0];

    if (!senderAccount) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Find recipient account
    const recipientRes = await db.query('SELECT * FROM accounts WHERE account_number = $1', [toAccountNumber]);
    const recipientAccount = recipientRes.rows[0];

    if (!recipientAccount) {
      return res.status(404).json({ message: 'Recipient account not found' });
    }

    // Check if trying to transfer to same account
    if (senderAccount.id === recipientAccount.id) {
      return res.status(400).json({ message: 'Cannot transfer to same account' });
    }

    // Check sufficient funds
    if (parseFloat(senderAccount.balance) < parseFloat(amount)) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    // Update balances
    const newSenderBalance = parseFloat(senderAccount.balance) - parseFloat(amount);
    const newRecipientBalance = parseFloat(recipientAccount.balance) + parseFloat(amount);

    await db.query('UPDATE accounts SET balance = $1 WHERE id = $2', [newSenderBalance, senderAccount.id]);
    await db.query('UPDATE accounts SET balance = $1 WHERE id = $2', [newRecipientBalance, recipientAccount.id]);

    // Record transactions for both accounts
    await db.query(
      'INSERT INTO transactions (user_id, type, amount, description) VALUES ($1, $2, $3, $4)',
      [userId, 'transfer_out', amount, `Transfer to ${toAccountNumber}${description ? ': ' + description : ''}`]
    );

    await db.query(
      'INSERT INTO transactions (user_id, type, amount, description) VALUES ($1, $2, $3, $4)',
      [recipientAccount.user_id, 'transfer_in', amount, `Transfer from ${senderAccount.account_number}${description ? ': ' + description : ''}`]
    );

    res.json({ 
      message: 'Transfer successful',
      newBalance: newSenderBalance 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}


