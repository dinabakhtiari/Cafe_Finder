const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/authMiddleware.js");
const upload = require("../middleware/upload.js");
const cafeModel = require("../models/cafes.js");

// Get cafes (Standard list)
router.get("/", (req, res) => {
    cafeModel.getAllCafes(req.query, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.render("cafes", { allCafes: result });
    });
});

// SEARCH ROUTE (Must be ABOVE /recent and /:id)
router.get("/search", (req, res) => {
    // Grab the city the user searched for, or default to 'Any'
    const searchTerm = req.query.city || "Any";
    
    // Pass req.query directly to Henrique's model so it applies the filters!
    cafeModel.getAllCafes(req.query, (err, result) => {
        if (err) {
            console.error("Search error:", err);
            return res.render("search-results", { city: searchTerm, cafes: [] });
        }
        
        // Render your dynamic EJS search page
        res.render("search-results", { city: searchTerm, cafes: result });
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

// Get specific cafe (Connects to cafe.ejs)
router.get("/:id", (req, res) => {
    cafeModel.getCafeById(req.params.id, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (result.length === 0) {
            // Safely render the page without a cafe if it isn't found
            return res.render("cafe", { cafe: null, comments: [] });
        }
        
        // Render the single cafe page! 
        // Note: I added `comments: []` as a placeholder so your EJS file doesn't crash 
        // until we build the actual comments database logic.
        res.render("cafe", { cafe: result[0], comments: [] });
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
                return res.redirect(`/cafe-page?id=${result.insertId}`);
            });
        } else {
            return res.redirect(`/cafe-page?id=${result.insertId}`);
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