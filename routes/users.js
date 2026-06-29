const express = require('express');
const router = express.Router();
const connection = require("../middleware/connectionDB.js");
const bcryptjs = require('bcryptjs');

router.put('/:id', async (req, res) => {
    const { name, email, password, confirm_password, bio } = req.body;
    const userId = req.params.id;


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

module.exports = router;
