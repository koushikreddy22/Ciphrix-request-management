const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function ensureManagersExist() {
  const password = "Password@123";
  const hashedPassword = await bcrypt.hash(password, 10);

  const managers = [
    {
      username: "John Doe",
      email: "john.doe@demo.com",
      password: hashedPassword,
      role: "manager",   // lowercase because ENUM is lowercase
    },
    {
      username: "Jane Smith",
      email: "jane.smith@demo.com",
      password: hashedPassword,
      role: "manager",
    },
  ];

  for (const m of managers) {
    await pool.query(
      `
      INSERT INTO users (username, email, password, role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email)
      DO UPDATE SET 
        username = EXCLUDED.username,
        password = EXCLUDED.password,
        role = EXCLUDED.role;
      `,
      [m.username, m.email, m.password, m.role]
    );
  }

  console.log("✔ Managers ensured in database");
}

ensureManagersExist();

module.exports = pool;
