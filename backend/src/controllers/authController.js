
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

async function getRandomManagerId() {
    // Fetch managers from DB
    const result = await pool.query(
        "SELECT id FROM users WHERE role = 'manager'"
    );

    if (result.rows.length === 0) return null; // No managers found

    // Shuffle the array
    const shuffled = result.rows.sort(() => Math.random() - 0.5);

    // Return a random manager id
    return shuffled[0].id;
}


exports.signup = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please provide username, email, and password' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // 👇 Fetch and shuffle manager IDs
        const manager_id = await getRandomManagerId();

        // Default new users are employees (unless you want employees only)
        const role = 'employee';

        const newUser = await pool.query(
            `INSERT INTO users (username, email, password, role, manager_id)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, username, email, role, manager_id`,
            [username, email, hashedPassword, role, manager_id]
        );

        res.status(201).json(newUser.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.rows[0].password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.rows[0].id, role: user.rows[0].role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
