#!/bin/bash

# CivicSight-AI Backend Development Startup Script
echo "🚀 Starting CivicSight-AI Backend Server..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# CivicSight-AI Backend Environment Configuration
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/civicsight-ai
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
EOF
    echo "✅ .env file created with default values"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if MongoDB is running (optional)
echo "🔍 Checking MongoDB connection..."
if command -v mongod &> /dev/null; then
    if pgrep -x "mongod" > /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is not running. Please start MongoDB:"
        echo "   brew services start mongodb-community (macOS)"
        echo "   sudo systemctl start mongod (Linux)"
        echo "   Or start MongoDB manually"
    fi
else
    echo "⚠️  MongoDB not found. Please install MongoDB:"
    echo "   https://docs.mongodb.com/manual/installation/"
fi

echo ""
echo "🌐 Server will be available at:"
echo "   Local: http://localhost:3000"
echo "   Phone: http://192.168.0.118:3000"
echo "   Health: http://192.168.0.118:3000/health"
echo ""
echo "📱 Make sure your phone is connected to the same WiFi network!"
echo ""

# Start the server
echo "🚀 Starting server..."
npm run dev
