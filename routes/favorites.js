const express = require("express");
const router = express.Router();
const connection = require("../middleware/connectionDB.js");
const requireLogin = require("../middleware/authMiddleware.js");

router.get("/", requireLogin, (req, res) => {
    const user_id = req.session.userId;
    connection.query(
        "SELECT cafes.* FROM cafes JOIN favorites ON cafes.id = favorites.cafe_id WHERE favorites.user_id = ?",
        [user_id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(result);
        }
    );
});

router.post("/", requireLogin, (req, res) => {
    const user_id = req.session.userId;
    const { cafe_id } = req.body;
    connection.query(
        "INSERT INTO favorites (user_id, cafe_id) VALUES (?, ?)",
        [user_id, cafe_id],
        (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            return res.status(201).send();
        }
    );
});

router.delete("/", requireLogin, (req, res) => {
    const user_id = req.session.userId;
    const { cafe_id } = req.body;
    connection.query(
        "DELETE FROM favorites WHERE user_id = ? AND cafe_id = ?",
        [user_id, cafe_id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Favorite not found" });
            }
            return res.status(204).send();
        }
    );
});

module.exports = router;
