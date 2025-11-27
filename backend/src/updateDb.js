import bcrypt from "bcrypt";
import pool from "./config/db";

async function ensureManagersExist() {
  const password = "Password@123";
  const hashedPassword = await bcrypt.hash(password, 10);

  const managers = [
    {
      name: "John Doe",
      email: "john.doe@demo.com",
      password: hashedPassword,
      role: "MANAGER",
    },
    {
      name: "Jane Smith",
      email: "jane.smith@demo.com",
      password: hashedPassword,
      role: "MANAGER",
    },
  ];

  for (const m of managers) {
    await pool.query(
      `
      INSERT INTO employees (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email)
      DO UPDATE SET name = EXCLUDED.name, password = EXCLUDED.password;
      `,
      [m.name, m.email, m.password, m.role]
    );
  }

  console.log("✔ Managers ensured in database");
}
module.exports = ensureManagersExist