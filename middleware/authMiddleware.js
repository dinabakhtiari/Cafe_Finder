const requireLogin = (req, res, next) => {
    if (!req.session.userId) {
        if (req.accepts("html")) { // for page route calls
            return res.redirect("/login-register");
        }
        return res.status(401).json({ error: "You must be logged in." }); // for API calls
    }
    next();
};

module.exports = requireLogin;
