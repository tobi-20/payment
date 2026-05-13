import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  database: 'payment_gateway',
  password: 'postgres',
  port: 5433,
});

// pool
//   .query('SELECT 1')
//   .then(() => console.log('DB connected'))
//   .catch((err) => console.error('DB connection failed:', err));

export default pool;
