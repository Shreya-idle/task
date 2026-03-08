const mongoose = require('mongoose');

// Singleton Pattern for Database Connection
class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    if (this.connection) {
      console.log('Using existing database connection');
      return this.connection;
    }

    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);

      this.connection = conn;
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return this.connection;
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  }
}

const dbInstance = new Database();
module.exports = dbInstance;
