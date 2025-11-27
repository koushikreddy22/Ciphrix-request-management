
const pool = require('../config/db');

exports.getEmployees = async (req, res) => {
    try {
        const employees = await pool.query("SELECT id, username FROM users WHERE role = 'employee'");
        res.json(employees.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
