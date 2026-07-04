const express = require("express");
const router = express.Router();
const connection = require("../middleware/connectionDB.js");
const requireLogin = require("../middleware/authMiddleware.js");
const upload = require("../middleware/upload.js");

// Get cafes
router.get("/", (req, res) => {
    connection.query(
        "SELECT * FROM cafes",
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(result);
        }
    );
});

// Get most receent
router.get("/recent", (req, res) => {
    connection.query(
        "SELECT * FROM cafes ORDER BY created_at DESC LIMIT 5",
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result.length === 0) {
                return res.status(404).send("No cafes added yet");
            }
            return res.json(result);
        }
    )
});

// Get specific cafe
router.get("/:id", (req, res) => {
    connection.query(
        "SELECT * FROM cafes WHERE id=?",
        [req.params.id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result.length === 0) {
                return res.status(404).send("No cafe found");
            }
            return res.json(result[0]);
        }
    );
});

// Add cafe
router.post("/", requireLogin, upload.single("photo"), (req, res) => {
    const user_id = req.session.userId;
    const { name, description, city, address } = req.body;

    connection.query(
        "INSERT INTO cafes (name, description, city, address, user_id) VALUES (?,?,?,?,?)",
        [name, description, city, address, user_id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (req.file) {
                const cafe_id = result.insertId;
                const url = req.file.path;
                connection.query(
                    "INSERT INTO photos (cafe_id, url) VALUES (?, ?)",
                    [cafe_id, url],
                    (err) => {
                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }
                        return res.status(201).json({ id: cafe_id });
                    }
                );
            } else {
                return res.status(201).json({ id: result.insertId });
            }
        }
    );
});

// Delete cafe
router.delete('/:id', requireLogin, (req, res) => {
    const idDelete = Number(req.params.id);
    const sessionUserId = req.session.userId;

    connection.query(
        "SELECT * FROM cafes WHERE id=?",
        [idDelete],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result.length === 0) {
                return res.status(404).send("Cafe not found");
            }

            const cafeUserId = result[0].user_id;

            if (sessionUserId === cafeUserId) {
                connection.query(
                    "DELETE FROM cafes WHERE id = ?",
                    [idDelete],
                    (err, result) => {
                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }

                        if (result.affectedRows === 0) {
                            return res.status(404).json({ error: "Cafe not found" });
                        }
                        return res.status(204).send();
                    }
                );

            } else {
                return res.status(403).json({ error: "Forbidden" })
            }
        }
    );
});

// Update cafe
router.patch("/:id", requireLogin, (req, res) => {
    const { name, description, city, address, tags, food, coffee, service, wifi, ambience } = req.body;
    const cafeId = req.params.id;
    const sessionUserId = req.session.userId;

    connection.query(
        "SELECT * FROM cafes WHERE id=?",
        [cafeId],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result.length === 0) {
                return res.status(404).send("Cafe not found");
            }

            const cafeUserId = result[0].user_id;

            if (sessionUserId === cafeUserId) {
                connection.query(
                    "UPDATE cafes SET name = ?, description = ?, city = ?, address = ?, tags = ?, food = ?, coffee = ?, service = ?, wifi = ?, ambience = ? WHERE id = ?",
                    [name, description, city, address, tags, food, coffee, service, wifi, ambience, cafeId],
                    (err, result) => {
                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }

                        if (result.affectedRows === 0) {
                            return res.status(404).json({ error: "Cafe not found" });
                        }

                        return res.status(204).send();
                    }
                );
            } else {
                return res.status(403).json({ error: "Forbidden" })
            }
        }
    );
});


module.exports = router;
