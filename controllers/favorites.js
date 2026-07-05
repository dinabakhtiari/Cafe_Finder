const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/authMiddleware.js");
const favoritesModel = require("../models/favorites.js");

router.get("/", requireLogin, (req, res) => {
    favoritesModel.getFavoritesByUser(req.session.userId, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

router.post("/", requireLogin, (req, res) => {
    const { cafe_id } = req.body;
    favoritesModel.addFavorite(req.session.userId, cafe_id, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(201).send();
    });
});

router.delete("/", requireLogin, (req, res) => {
    const { cafe_id } = req.body;
    favoritesModel.removeFavorite(req.session.userId, cafe_id, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Favorite not found" });
        return res.status(204).send();
    });
});

module.exports = router;
