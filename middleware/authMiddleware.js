const requireLogin = (req, res, next) => {
    if (!req.session.userId) {
        const isAjax = req.headers['content-type']?.includes('application/json') || req.headers['x-requested-with'] === 'XMLHttpRequest';
        if (!isAjax && req.accepts("html")) {
            return res.redirect("/login-register");
        }
        return res.status(401).json({ error: "You must be logged in." });
    }
    next();
};

module.exports = requireLogin;
