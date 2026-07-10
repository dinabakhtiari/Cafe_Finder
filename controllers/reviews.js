const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/authMiddleware.js');
const upload = require("../middleware/upload.js");
const reviewModel = require("../models/reviews.js");

router.post("/", requireLogin, upload.array("photos", 5), (req, res) => {
    const data = { ...req.body, user_id: req.session.userId };

    reviewModel.createReview(data, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (req.files && req.files.length > 0) {
            const review_id = result.insertId;
            req.files.forEach(file => {
                reviewModel.insertReviewPhoto(review_id, file.path, (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                });
            });
            return res.status(201).json({ id: review_id });
        } else {
            return res.status(201).json({ id: result.insertId });
        }
    });
});

router.get("/", (req, res) => {
    const cafe_id = req.query.cafe_id;
    if (!cafe_id) return res.status(400).json({ error: "cafe_id is required" });

    reviewModel.getReviewsByCafe(cafe_id, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

router.patch("/:id", requireLogin, (req, res) => {
    const reviewId = req.params.id;
    const sessionUserId = req.session.userId;

    reviewModel.getReviewById(reviewId, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).send("Review not found");

        if (sessionUserId == result[0].user_id) {
            reviewModel.updateReview(reviewId, req.body, (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                if (result.affectedRows === 0) return res.status(404).json({ error: "Review not found" });
                return res.status(204).send();
            });
        } else {
            return res.status(403).json({ error: "Forbidden" });
        }
    });
});

router.delete('/:id', requireLogin, (req, res) => {
    const idDelete = Number(req.params.id);
    const sessionUserId = req.session.userId;

    reviewModel.getReviewById(idDelete, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).send("Review not found");

        if (sessionUserId == result[0].user_id) {
            reviewModel.deleteReview(idDelete, (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                if (result.affectedRows === 0) return res.status(404).json({ error: "Review not found" });
                return res.status(204).send();
            });
        } else {
            return res.status(403).json({ error: "Forbidden" });
        }
    });
});

module.exports = router;
