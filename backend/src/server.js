require('dotenv').config();
const app = require('./app');
const dbInstance = require('./config/db');
const { connectRedis } = require('./config/redis');

const PORT = process.env.PORT || 5000;

// Connect to the DB and Redis
dbInstance.connect().then(async () => {
    try {
        await connectRedis();
    } catch (err) {
        console.log('Skipping Redis due to connection issue in dev');
    }
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to the database', err);
});
