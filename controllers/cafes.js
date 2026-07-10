const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/authMiddleware.js");
const upload = require("../middleware/upload.js");
const cafeModel = require("../models/cafes.js");

// Get cafes
router.get("/", (req, res) => {
    cafeModel.getAllCafes(req.query, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // Render the EJS page and pass the data!
        res.render("cafes", { allCafes: result });
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
    cafeModel.getCafeById(req.params.id, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).send("No cafe found");
        
        // DYNAMIC FIX: Render the EJS page and pass the single cafe object to it
        res.render("cafe", { cafe: result[0] });
    });
});

// Add cafe
router.post("/", requireLogin, upload.single("photo"), (req, res) => {
    const data = { ...req.body, user_id: req.session.userId };

    cafeModel.createCafe(data, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (req.file) {
            cafeModel.insertCafePhoto(result.insertId, req.file.path, (err) => {
                if (err) return res.status(500).json({ error: err.message });
                return res.status(201).json({ id: result.insertId });
            });
        } else {
            return res.status(201).json({ id: result.insertId });
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