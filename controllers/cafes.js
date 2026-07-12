const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/authMiddleware.js");
const upload = require("../middleware/upload.js");
const cafeModel = require("../models/cafes.js");
const reviewModel = require("../models/reviews.js");
const favoritesModel = require("../models/favorites.js");

// Get cafes
router.get("/", (req, res) => {
    cafeModel.getAllCafes(req.query, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// Search cafes
router.get("/search", (req, res) => {
    const searchTerm = req.query.search || req.query.city || "";
    cafeModel.getAllCafes(req.query, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.render("search-results", { user: req.session.userId || null, cafes: result, searchTerm });
    });
});

// Get most recent
router.get("/recent", (req, res) => {
    cafeModel.getRecentCafes((err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).send("No cafes added yet");
        return res.json(result);
    });
});

// Get specific cafe
router.get("/:id", (req, res) => {
    cafeModel.getCafeById(req.params.id, (err, cafeResult) => {
        if (err) return res.status(500).json({ error: err.message });
        if (cafeResult.length === 0) return res.render("cafe-page", { user: req.session.userId || null, cafe: null, reviews: [], isFavorited: false });

        reviewModel.getReviewsByCafe(req.params.id, (err, reviews) => {
            if (err) return res.status(500).json({ error: err.message });

            const userId = req.session.userId;
            if (!userId) {
                return res.render("cafe-page", { user: null, cafe: cafeResult[0], reviews, isFavorited: false });
            }

            favoritesModel.isFavorite(userId, req.params.id, (err, isFavorited) => {
                return res.render("cafe-page", { user: userId, cafe: cafeResult[0], reviews, isFavorited: isFavorited || false });
            });
        });
    });
});

// Add cafe
router.post("/", requireLogin, upload.single("photo"), (req, res) => {
    const data = { ...req.body, user_id: req.session.userId };

    cafeModel.createCafe(data, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (req.file) {
            cafeModel.insertCafePhoto(result.insertId, req.file.path.replace("public", ""), (err) => {
                if (err) return res.status(500).json({ error: err.message });
                return res.redirect(`/cafes/${result.insertId}`);
            });
        } else {
            return res.redirect(`/cafes/${result.insertId}`);
        }
    });
});

// Delete cafe
router.delete('/:id', requireLogin, (req, res) => {
    const idDelete = Number(req.params.id);
    const sessionUserId = req.session.userId;

    cafeModel.getCafeById(idDelete, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).send("Cafe not found");

        if (sessionUserId == result[0].user_id) {
            cafeModel.deleteCafe(idDelete, (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                if (result.affectedRows === 0) return res.status(404).json({ error: "Cafe not found" });
                return res.status(204).send();
            });
        } else {
            return res.status(403).json({ error: "Forbidden" });
        }
    });
});

// Update cafe
router.patch("/:id", requireLogin, (req, res) => {
    const cafeId = req.params.id;
    const sessionUserId = req.session.userId;

    cafeModel.getCafeById(cafeId, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).send("Cafe not found");

        if (sessionUserId == result[0].user_id) {
            cafeModel.updateCafe(cafeId, req.body, (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                if (result.affectedRows === 0) return res.status(404).json({ error: "Cafe not found" });
                return res.status(204).send();
            });
        } else {
            return res.status(403).json({ error: "Forbidden" });
        }
    });
});

module.exports = router;
