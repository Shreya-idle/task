// Factory Pattern for standardizing API responses
class ResponseFactory {
    static success(res, data, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }

    static error(res, message = 'Server Error', statusCode = 500, errors = null) {
        return res.status(statusCode).json({
            success: false,
            message,
            errors: process.env.NODE_ENV === 'development' ? errors : undefined,
        });
    }
}

module.exports = ResponseFactory;
