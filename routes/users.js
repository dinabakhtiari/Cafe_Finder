const express = require('express');
const router = express.Router();
const connection = require("../middleware/connectionDB.js");
const bcryptjs = require('bcryptjs');
const requireLogin = require('../middleware/authMiddleware.js');

router.get('/:id', (req, res) => {
    connection.query(
        "SELECT name, email, bio FROM users WHERE id = ?",
        [req.params.id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result.length === 0) {
                return res.status(404).send("No user found");
            }
            return res.json(result[0]);
        }
    );
});

// Update user info
router.put('/:id', requireLogin, async (req, res) => {
    const userId = req.params.id;
    const sessionId = req.session.userId;

    if (userId != sessionId) {
        return res.status(403).json({ error: "Forbidden" });
    }

    const { name, email, password, confirm_password, bio } = req.body;


    if (!password) {
        connection.query(
            "UPDATE users SET name = ?, email = ?, bio = ? WHERE id = ?",
            [name, email, bio, userId],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: "User not found" });
                }

                return res.status(204).send();
            }
        );
    } else if (password !== confirm_password) {
        res.status(400).json({ error: "Passwords don't match" })
    } else {
        const hashedPwd = await bcryptjs.hash(req.body.password, 10);

        connection.query(
            "UPDATE users SET name = ?, email = ?, password = ?, bio = ? WHERE id = ?",
            [name, email, hashedPwd, bio, userId],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: "User not found" });
                }

                return res.status(204).send();
            }
        );
    }
});

// Delete user account
router.delete('/:id', requireLogin, (req, res) => {
    const userId = req.params.id;
    const sessionId = req.session.userId;

    if (userId != sessionId) {
        return res.status(403).json({ error: "Forbidden" });
    }

    connection.query(
        "DELETE FROM users WHERE id = ?",
        [userId],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(204).send();
        }
    )
});

module.exports = router;
