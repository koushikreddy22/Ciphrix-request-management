
const pool = require('../config/db');

exports.createRequest = async (req, res) => {
    const { description, assigned_to_id } = req.body;
    const created_by_id = req.user.id;

    if (!description || !assigned_to_id) {
        return res.status(400).json({ message: 'Please provide description and assigned_to_id' });
    }

    try {
        const newRequest = await pool.query(
            'INSERT INTO requests (description, created_by_id, assigned_to_id) VALUES ($1, $2, $3) RETURNING *',
            [description, created_by_id, assigned_to_id]
        );
        res.status(201).json(newRequest.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllRequests = async (req, res) => {
    try {
        // EMPLOYEE: return only his created or assigned requests
        if (req.user.role === "employee") {
            const employeeRequests = await pool.query(
                `SELECT r.*, u.manager_id
                 FROM requests r
                 JOIN users u ON u.id = r.assigned_to_id
                 WHERE r.created_by_id = $1 
                    OR r.assigned_to_id = $1
                 ORDER BY r.created_at DESC`,
                [req.user.id]
            );

            return res.json(employeeRequests.rows);
        }

        // MANAGER: return all requests assigned to employees under this manager
        if (req.user.role === "manager") {
            const managerRequests = await pool.query(
                `SELECT r.*, u.manager_id
                 FROM requests r
                 JOIN users u ON u.id = r.assigned_to_id
                 WHERE u.manager_id = $1
                 ORDER BY r.created_at DESC`,
                [req.user.id]
            );

            return res.json(managerRequests.rows);
        }

        res.status(403).json({ message: "Invalid role" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};



exports.getRequestById = async (req, res) => {
    const { id } = req.params;
    try {
        const request = await pool.query('SELECT * FROM requests WHERE id = $1', [id]);
        if (request.rows.length === 0) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.json(request.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.approveRequest = async (req, res) => {
    const { id } = req.params;
    try {
        if (req.user.role !== 'manager') {
            return res.status(403).json({ message: 'Only managers can approve requests' });
        }
        const request = await pool.query('SELECT * FROM requests WHERE id = $1', [id]);
        if (request.rows.length === 0) {
            return res.status(404).json({ message: 'Request not found' });
        }
        // check if the manager is the manager of the assigned employee
        const assignedEmployee = await pool.query('SELECT manager_id FROM users WHERE id = $1', [request.rows[0].assigned_to_id]);
        if (assignedEmployee.rows[0].manager_id !== req.user.id) {
            return res.status(403).json({ message: 'You are not the manager of the assigned employee' });
        }

        const updatedRequest = await pool.query(
            "UPDATE requests SET status = 'approved' WHERE id = $1 RETURNING *",
            [id]
        );
        res.json(updatedRequest.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.rejectRequest = async (req, res) => {
    const { id } = req.params;
    try {
        if (req.user.role !== 'manager') {
            return res.status(403).json({ message: 'Only managers can reject requests' });
        }
        const request = await pool.query('SELECT * FROM requests WHERE id = $1', [id]);
        if (request.rows.length === 0) {
            return res.status(404).json({ message: 'Request not found' });
        }
        // check if the manager is the manager of the assigned employee
        const assignedEmployee = await pool.query('SELECT manager_id FROM users WHERE id = $1', [request.rows[0].assigned_to_id]);
        if (assignedEmployee.rows[0].manager_id !== req.user.id) {
            return res.status(403).json({ message: 'You are not the manager of the assigned employee' });
        }

        const updatedRequest = await pool.query(
            "UPDATE requests SET status = 'rejected' WHERE id = $1 RETURNING *",
            [id]
        );
        res.json(updatedRequest.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.closeRequest = async (req, res) => {
    const { id } = req.params;
    try {
        const request = await pool.query('SELECT * FROM requests WHERE id = $1', [id]);
        if (request.rows.length === 0) {
            return res.status(404).json({ message: 'Request not found' });
        }
        if (request.rows[0].assigned_to_id !== req.user.id) {
            return res.status(403).json({ message: 'You are not assigned to this request' });
        }
        if (request.rows[0].status !== 'approved') {
            return res.status(403).json({ message: 'Request must be approved before it can be closed' });
        }
        const updatedRequest = await pool.query(
            "UPDATE requests SET status = 'closed' WHERE id = $1 RETURNING *",
            [id]
        );
        res.json(updatedRequest.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
