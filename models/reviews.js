const connection = require("../middleware/connectionDB.js");

const getReviewsByCafe = (cafe_id, callback) => {
    connection.query("SELECT * FROM reviews WHERE cafe_id = ?", [cafe_id], callback);
};

const createReview = (data, callback) => {
    const { user_id, rating, cafe_id, wifi, outlets, quiet, tables, outdoor, ac, parking, student_discount, specialty_coffee, snacks, comment } = data;
    connection.query(
        "INSERT INTO reviews (user_id, rating, cafe_id, wifi, outlets, quiet, tables, outdoor, ac, parking, student_discount, specialty_coffee, snacks, comment) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [user_id, rating, cafe_id, wifi, outlets, quiet, tables, outdoor, ac, parking, student_discount, specialty_coffee, snacks, comment],
        callback
    );
};

const insertReviewPhoto = (review_id, url, callback) => {
    connection.query("INSERT INTO review_photos (review_id, url) VALUES (?, ?)", [review_id, url], callback);
};

const getReviewById = (id, callback) => {
    connection.query("SELECT * FROM reviews WHERE id = ?", [id], callback);
};

const updateReview = (id, data, callback) => {
    const { rating, wifi, outlets, quiet, tables, outdoor, ac, parking, student_discount, specialty_coffee, snacks, comment } = data;
    connection.query(
        "UPDATE reviews SET rating = ?, wifi = ?, outlets = ?, quiet = ?, tables = ?, outdoor = ?, ac = ?, parking = ?, student_discount = ?, specialty_coffee = ?, snacks = ?, comment = ? WHERE id = ?",
        [rating, wifi, outlets, quiet, tables, outdoor, ac, parking, student_discount, specialty_coffee, snacks, comment, id],
        callback
    );
};

const deleteReview = (id, callback) => {
    connection.query("DELETE FROM reviews WHERE id = ?", [id], callback);
};

module.exports = { getReviewsByCafe, createReview, insertReviewPhoto, getReviewById, updateReview, deleteReview };
