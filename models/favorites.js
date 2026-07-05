const connection = require("../middleware/connectionDB.js");

const getFavoritesByUser = (user_id, callback) => {
    connection.query(
        "SELECT cafes.* FROM cafes JOIN favorites ON cafes.id = favorites.cafe_id WHERE favorites.user_id = ?",
        [user_id],
        callback
    );
};

const addFavorite = (user_id, cafe_id, callback) => {
    connection.query("INSERT INTO favorites (user_id, cafe_id) VALUES (?, ?)", [user_id, cafe_id], callback);
};

const removeFavorite = (user_id, cafe_id, callback) => {
    connection.query("DELETE FROM favorites WHERE user_id = ? AND cafe_id = ?", [user_id, cafe_id], callback);
};

module.exports = { getFavoritesByUser, addFavorite, removeFavorite };
