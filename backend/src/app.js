const express = require('express');
const cors = require('cors');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

// Load Swagger Document
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
const { tenantMiddleware } = require('./middlewares/tenantMiddleware');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Set up
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Enforce Multi-Tenancy globally
app.use(tenantMiddleware);

// Default Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Import Routes (To be implemented)
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Inject Route Handlers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);

// Error Middleware (Chain of Responsibility)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
