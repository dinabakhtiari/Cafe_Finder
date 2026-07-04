const express = require('express');
const router = express.Router();
const connection = require("../middleware/connectionDB.js");
const requireLogin = require('../middleware/authMiddleware.js');
const upload = require("../middleware/upload.js");

router.post("/", requireLogin, upload.array("photos", 5), (req, res) => {
    const user_id = req.session.userId;
    const { rating, cafe_id, wifi, outlets, quiet, tables, outdoor, ac, parking, student_discount, specialty_coffee, snacks, comment } = req.body;

    connection.query(
        "INSERT INTO reviews (user_id, rating, cafe_id, wifi, outlets, quiet, tables, outdoor, ac, parking, student_discount, specialty_coffee, snacks, comment) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [user_id, rating, cafe_id, wifi, outlets, quiet, tables, outdoor, ac, parking, student_discount, specialty_coffee, snacks, comment],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (req.files && req.files.length > 0) {
                const review_id = result.insertId;
                req.files.forEach(file => {
                    connection.query(
                        "INSERT INTO review_photos (review_id, url) VALUES (?, ?)",
                        [review_id, file.path],
                        (err) => {
                            if (err) {
                                return res.status(500).json({ error: err.message });
                            }
                        }
                    );
                });
                return res.status(201).json({ id: review_id });
            } else {
                return res.status(201).json({ id: result.insertId });
            }
        }
    );
});

router.get("/", (req, res) => {
    const cafe_id = req.query.cafe_id;
    if (!cafe_id) {
        return res.status(400).json({ error: "cafe_id is required" });
    }

    connection.query(
        "SELECT * FROM reviews WHERE cafe_id = ?",
        [cafe_id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(result);
        }
    )
});

router.patch("/:id", requireLogin, (req, res) => {
    const reviewId = req.params.id;
    const sessionUserId = req.session.userId;
    const { rating, wifi, outlets, quiet, tables, outdoor, ac, parking, student_discount, specialty_coffee, snacks, comment } = req.body;

    connection.query(
        "SELECT * FROM reviews WHERE id=?",
        [reviewId],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result.length == 0) {
                return res.status(404).send("Review not found");
            }

            const reviewsUserId = result[0].user_id;

            if (sessionUserId == reviewsUserId) {
                connection.query(
                    "UPDATE reviews SET rating = ?, wifi = ?, outlets = ?, quiet = ?, tables = ?, outdoor = ?, ac = ?, parking = ?, student_discount = ?, specialty_coffee = ?, snacks = ?, comment = ? WHERE id = ?",
                    [rating, wifi, outlets, quiet, tables, outdoor, ac, parking, student_discount, specialty_coffee, snacks, comment, reviewId],
                    (err, result) => {
                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }
                        if (result.affectedRows === 0) {
                            return res.status(404).json({ error: "Review not found" });
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

router.delete('/:id', requireLogin, (req, res) => {
    const idDelete = Number(req.params.id);
    const sessionUserId = req.session.userId;

    connection.query(
        "SELECT * FROM reviews WHERE id=?",
        [idDelete],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result.length === 0) {
                return res.status(404).send("Review not found");
            }

            const reviewUserId = result[0].user_id;

            if (sessionUserId == reviewUserId) {
                connection.query(
                    "DELETE FROM reviews WHERE id = ?",
                    [idDelete],
                    (err, result) => {
                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }

                        if (result.affectedRows === 0) {
                            return res.status(404).json({ error: "Review not found" });
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
