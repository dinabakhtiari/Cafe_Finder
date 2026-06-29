const requireLogin = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).send("You must be logged in.");
    }
    next();
};

module.exports = requireLogin;
