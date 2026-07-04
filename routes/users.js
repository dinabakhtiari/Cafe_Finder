const express = require('express');
const router = express.Router();
const connection = require("../middleware/connectionDB.js");
const bcryptjs = require('bcryptjs');
const requireLogin = require('../middleware/authMiddleware.js');
const upload = require("../middleware/upload.js");

router.get('/:id', (req, res) => {
    connection.query(
        "SELECT username, name, email, bio, photo_url FROM users WHERE id = ?",
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
router.patch('/:id', requireLogin, upload.single("photo"), async (req, res) => {
    const userId = req.params.id;
    const sessionId = req.session.userId;

    if (userId != sessionId) {
        return res.status(403).json({ error: "Forbidden" });
    }

    const { username, name, email, password, confirm_password, bio } = req.body;
    const photo_url = req.file ? req.file.path : null;

    if (!password) {
        connection.query(
            "UPDATE users SET username = ?, name = ?, email = ?, bio = ?, photo_url = ? WHERE id = ?",
            [username, name, email, bio, photo_url, userId],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ error: "Username or email already in use" });
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: "User not found" });
                }
                return res.status(204).send();
            }
        );
    } else if (password !== confirm_password) {
        return res.status(400).json({ error: "Passwords don't match" });
    } else {
        const hashedPwd = await bcryptjs.hash(password, 10);
        connection.query(
            "UPDATE users SET username = ?, name = ?, email = ?, password = ?, bio = ?, photo_url = ? WHERE id = ?",
            [username, name, email, hashedPwd, bio, photo_url, userId],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ error: "Username or email already in use" });
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
