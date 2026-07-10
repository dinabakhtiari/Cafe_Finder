const connection = require("../middleware/connectionDB.js");

const getUserById = (id, callback) => {
    connection.query("SELECT username, name, email, bio, photo_url FROM users WHERE id = ?", [id], callback);
};

const updateUser = (id, data, callback) => {
    const { username, name, email, bio, photo_url } = data;
    connection.query(
        "UPDATE users SET username = ?, name = ?, email = ?, bio = ?, photo_url = ? WHERE id = ?",
        [username, name, email, bio, photo_url, id],
        callback
    );
};

const updateUserWithPassword = (id, data, callback) => {
    const { username, name, email, hashedPwd, bio, photo_url } = data;
    connection.query(
        "UPDATE users SET username = ?, name = ?, email = ?, password = ?, bio = ?, photo_url = ? WHERE id = ?",
        [username, name, email, hashedPwd, bio, photo_url, id],
        callback
    );
};

const deleteUser = (id, callback) => {
    connection.query("DELETE FROM users WHERE id = ?", [id], callback);
};

module.exports = { getUserById, updateUser, updateUserWithPassword, deleteUser };
