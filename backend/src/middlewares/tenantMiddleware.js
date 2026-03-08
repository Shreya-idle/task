const ResponseFactory = require('../utils/responseFactory');

// Multi-Tenant Middleware: Extacts tenant ID from headers
// This enforces data isolation per tenant (e.g. diff organizations)
const tenantMiddleware = (req, res, next) => {
    const tenantId = req.headers['x-tenant-id'];

    if (!tenantId) {
        return ResponseFactory.error(res, 'Missing x-tenant-id header for Multi-Tenant architecture', 400);
    }

    req.tenant = tenantId;
    next();
};

module.exports = { tenantMiddleware };
