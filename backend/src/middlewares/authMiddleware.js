const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const ResponseFactory = require('../utils/responseFactory');

// Protect routes: ensures user has a valid JWT
const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Decode the JWT using secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Extract user from DB and attach to req for future middleware/controllers
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return ResponseFactory.error(res, 'Not authorized, user not found', 401);
            }

            next();
        } catch (error) {
            console.error(error);
            return ResponseFactory.error(res, 'Not authorized, token failed', 401);
        }
    }

    if (!token) {
        return ResponseFactory.error(res, 'Not authorized, no token', 401);
    }
});

// Authorize roles (Role-Based Access Control)
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return ResponseFactory.error(
                res,
                `User role '${req.user.role}' is not authorized to access this route`,
                403
            );
        }
        next();
    };
};

module.exports = { protect, authorize };
