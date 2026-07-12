const express = require('express');
const router = express.Router();
const connection = require("../middleware/connectionDB.js");
const requireLogin = require('../middleware/authMiddleware.js');

// Add cafe to favorites (Bookmark)
router.post("/:id/bookmark", requireLogin, (req, res) => {
    const userId = req.session.userId;
    const cafeId = req.params.id;

    connection.query(
        "INSERT IGNORE INTO favorites (user_id, cafe_id) VALUES (?, ?)",
        [userId, cafeId],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.status(200).send("Cafe added to favorites");
        }
    );
});

// Remove cafe from favorites (Unbookmark)
router.post("/:id/unbookmark", requireLogin, (req, res) => {
    const userId = req.session.userId;
    const cafeId = req.params.id;

    connection.query(
        "DELETE FROM favorites WHERE user_id = ? AND cafe_id = ?",
        [userId, cafeId],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.status(200).send("Cafe removed from favorites");
        }
    );
});

module.exports = router;