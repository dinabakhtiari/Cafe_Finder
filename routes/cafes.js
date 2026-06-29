const express = require("express");
const router = express.Router();
const connection = require("../middleware/connectionDB.js");

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
router.post("/", (req, res) => {
    const { name, description, city, address, tags, food, coffee, service, wifi, ambience } = req.body;

    connection.query(
        "INSERT INTO cafes (name, description, city, address, tags, food, coffee, service, wifi, ambience) VALUES (?,?,?,?,?,?,?,?,?,?)",
        [name, description, city, address, tags, food, coffee, service, wifi, ambience],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            return res.status(201).json({ id: result.insertId });
        }
    );
});

// Delete cafe
router.delete('/:id', (req, res) => {
    const idDelete = Number(req.params.id);

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
});

// Update cafe
router.put("/:id", (req, res) => {
    const { name, description, city, address, tags, food, coffee, service, wifi, ambience } = req.body;
    const cafeId = req.params.id;
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
    )
})

module.exports = router;
