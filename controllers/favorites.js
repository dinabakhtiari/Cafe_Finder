const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/authMiddleware.js");
const favoritesModel = require("../models/favorites.js");

// GET: Fetch and render the user's saved cafes
router.get("/", requireLogin, (req, res) => {
    favoritesModel.getFavoritesByUser(req.session.userId, (err, result) => {
        if (err) {
            console.error("Error fetching favorites:", err);
            // If there's an error, render the page with an empty array so it doesn't crash
            return res.render("saved-cafes", { savedCafes: [] });
        }
        
        // DYNAMIC FIX: Render the EJS page and pass the database results!
        res.render("saved-cafes", { savedCafes: result });
    });
});

// POST: Add a cafe to favorites (API route for your frontend JS)
router.post("/", requireLogin, (req, res) => {
    const { cafe_id } = req.body;
    favoritesModel.addFavorite(req.session.userId, cafe_id, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(201).send();
    });
});

// DELETE: Remove a cafe from favorites (API route for your frontend JS)
router.delete("/", requireLogin, (req, res) => {
    const { cafe_id } = req.body;
    favoritesModel.removeFavorite(req.session.userId, cafe_id, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Favorite not found" });
        return res.status(204).send();
    });
});

module.exports = router;