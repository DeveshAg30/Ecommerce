const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
};

const isAdmin = (req, res, next) => {
    if (req.session && req.session.userId && req.session.role === 'admin') {
        return next();
    }
    res.status(403).json({ message: 'Forbidden: Admin access required' });
};

module.exports = {
    isAuthenticated,
    isAdmin
}; 