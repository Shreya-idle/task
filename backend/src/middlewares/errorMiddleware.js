const ResponseFactory = require('../utils/responseFactory');

// Chain of Responsibility Pattern: Catching requests throwing Error
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Global Error Handler
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    const message = err.message || 'Internal Server Error';

    // Format the error using Factory Pattern
    return ResponseFactory.error(res, message, statusCode, err.stack);
};

module.exports = { notFound, errorHandler };
