import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Client } = pg;
const client = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
client.connect()
  .then(()=> console.log('✅ Connected to PostgreSQL'))
  .catch(err => console.error('❌ Postgres connection error', err));
export default client;
