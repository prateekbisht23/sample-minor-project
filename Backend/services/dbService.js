const mongoose = require('mongoose');
require('dotenv').config();

/**
 * Database connection service
 * Handles MongoDB connection using Mongoose
 */
class DatabaseService {
  constructor() {
    this.isConnected = false;
  }

  /**
   * Connect to MongoDB database
   */
  async connect() {
    try {
      if (this.isConnected) {
        console.log('Database already connected');
        return;
      }

      const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/civicsight';
      
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      this.isConnected = true;
      console.log('✅ Connected to MongoDB successfully');
      
      // Handle connection events
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.log('⚠️ MongoDB disconnected');
        this.isConnected = false;
      });

    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
      this.isConnected = false;
      throw error;
    }
  }

  /**
   * Disconnect from MongoDB
   */
  async disconnect() {
    try {
      if (this.isConnected) {
        await mongoose.connection.close();
        this.isConnected = false;
        console.log('✅ Disconnected from MongoDB');
      }
    } catch (error) {
      console.error('❌ Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    return this.isConnected;
  }
}

// Export singleton instance
module.exports = new DatabaseService();
