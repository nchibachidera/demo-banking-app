import db from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// helper: generate random 10-digit account number
function generateAccountNumber() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

// ✅ Register
export async function register(req, res) {
  const { full_name, email, password } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    // check if email exists
    const check = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (check.rows.length) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // generate account number
    const accountNumber = generateAccountNumber();

    // insert into users (with account_number + balance)
    const userRes = await db.query(
      `INSERT INTO users (full_name, email, password, account_number, balance)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, full_name, email, account_number, balance, created_at`,
      [full_name, email, hashed, accountNumber, 0.00]
    );

    const user = userRes.rows[0];

    // optional: also store account separately in accounts table
    await db.query(
      `INSERT INTO accounts (user_id, account_number, balance)
       VALUES ($1, $2, $3)`,
      [user.id, accountNumber, 0.00]
    );

    // generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);

    res.json({
      message: "User registered successfully",
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        account_number: user.account_number,
        balance: user.balance,
        created_at: user.created_at
      },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// ✅ Login
export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    // check if user exists
    const userRes = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (!userRes.rows.length) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = userRes.rows[0];

    // compare password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        account_number: user.account_number,
        balance: user.balance,
        created_at: user.created_at
      },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// 🔧 TEMPORARY: Fix accounts for existing users
export async function fixAccounts(req, res) {
  try {
    // Find users without accounts
    const usersWithoutAccounts = await db.query(`
      SELECT id, account_number, balance 
      FROM users 
      WHERE id NOT IN (SELECT user_id FROM accounts WHERE user_id IS NOT NULL)
    `);
    
    console.log('Users without accounts found:', usersWithoutAccounts.rows);
    
    // Create accounts for them
    for (const user of usersWithoutAccounts.rows) {
      await db.query(
        'INSERT INTO accounts (user_id, account_number, balance) VALUES ($1, $2, $3)',
        [user.id, user.account_number, user.balance]
      );
      console.log(`Created account for user ID ${user.id}`);
    }
    
    res.json({ 
      message: 'Fixed accounts for existing users', 
      count: usersWithoutAccounts.rows.length,
      users: usersWithoutAccounts.rows
    });
  } catch (err) {
    console.error('Error fixing accounts:', err);
    res.status(500).json({ message: 'Error fixing accounts' });
  }
}







