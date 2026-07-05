const connection = require("../middleware/connectionDB.js");

const getAllCafes = (filters, callback) => {
    let conditions = [];
    let values = [];

    if (filters.city) {
        conditions.push("cafes.city = ?");
        values.push(filters.city);
    }

    const tags = ["wifi", "outlets", "quiet", "tables", "outdoor", "ac", "parking", "student_discount", "specialty_coffee", "snacks"];
    tags.forEach(tag => {
        if (filters[tag]) {
            conditions.push(`reviews.${tag} = ?`);
            values.push(true);
        }
    });

    let query = "SELECT DISTINCT cafes.* FROM cafes LEFT JOIN reviews ON cafes.id = reviews.cafe_id";
    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }

    connection.query(query, values, callback);
};

const getRecentCafes = (callback) => {
    connection.query("SELECT * FROM cafes ORDER BY created_at DESC LIMIT 5", callback);
};

const getCafeById = (id, callback) => {
    connection.query("SELECT * FROM cafes WHERE id = ?", [id], callback);
};

const createCafe = (data, callback) => {
    const { name, description, city, address, user_id } = data;
    connection.query(
        "INSERT INTO cafes (name, description, city, address, user_id) VALUES (?,?,?,?,?)",
        [name, description, city, address, user_id],
        callback
    );
};

const insertCafePhoto = (cafe_id, url, callback) => {
    connection.query("INSERT INTO photos (cafe_id, url) VALUES (?, ?)", [cafe_id, url], callback);
};

const updateCafe = (id, data, callback) => {
    const { name, description, city, address } = data;
    connection.query(
        "UPDATE cafes SET name = ?, description = ?, city = ?, address = ? WHERE id = ?",
        [name, description, city, address, id],
        callback
    );
};

const deleteCafe = (id, callback) => {
    connection.query("DELETE FROM cafes WHERE id = ?", [id], callback);
};

module.exports = { getAllCafes, getRecentCafes, getCafeById, createCafe, insertCafePhoto, updateCafe, deleteCafe };

