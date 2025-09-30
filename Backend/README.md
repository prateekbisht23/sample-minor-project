# CivicSight-AI Backend API

A complete backend API for the CivicSight-AI project, built with Express.js and MongoDB. This API handles civic issue reporting, AI-powered classification, user authentication, and admin management.

## 🚀 Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Issue Reporting**: Submit civic issues with photos, voice recordings, and location data
- **AI Integration**: Mocked AI services for image classification and voice transcription
- **File Uploads**: Support for image and audio file uploads with validation
- **Admin Panel**: Complete admin interface for managing issues and users
- **Real-time Updates**: Status tracking and issue management
- **RESTful API**: Well-structured endpoints with proper HTTP methods
- **Data Validation**: Comprehensive input validation and error handling
- **Pagination**: Efficient data retrieval with pagination support

## 🛠️ Tech Stack

- **Framework**: Express.js (Node.js)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken) with bcryptjs for password hashing
- **File Uploads**: Multer for handling multipart/form-data
- **Validation**: express-validator for request validation
- **Environment**: dotenv for environment variable management
- **CORS**: Cross-origin resource sharing support

## 📁 Project Structure

```
civicsight-api/
├── .env                    # Environment variables
├── package.json            # Dependencies and scripts
├── server.js               # Main server file
├── routes/                 # Express route definitions
│   ├── authRoutes.js       # Authentication routes
│   ├── issueRoutes.js      # Issue management routes
│   └── adminRoutes.js      # Admin panel routes
├── controllers/            # Request handlers
│   ├── authController.js   # Authentication logic
│   ├── issueController.js  # Issue management logic
│   └── adminController.js  # Admin panel logic
├── services/               # Business logic and external API calls
│   ├── dbService.js        # Database connection
│   ├── authService.js      # Authentication services
│   ├── issueService.js     # Issue management services
│   └── aiService.js        # Mocked AI services
├── models/                 # Mongoose schemas
│   └── dbModels.js         # Database models
├── middlewares/            # Custom middleware
│   └── auth.js             # Authentication middleware
├── utils/                  # Helper functions
│   ├── errorHandler.js     # Error handling utilities
│   └── responseHelper.js   # Response formatting utilities
├── uploads/                # File upload directory
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd civicsight-ai/Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your configuration:
   ```env
   # Database Configuration
   MONGO_URI=mongodb://localhost:27017/civicsight
   
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # File Upload Configuration
   MAX_FILE_SIZE=5242880
   UPLOAD_PATH=./uploads
   ```

4. **Start MongoDB**
   - **Local MongoDB**: Ensure MongoDB is running on your system
   - **MongoDB Atlas**: Update the `MONGO_URI` in your `.env` file

5. **Start the server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Verify installation**
   Visit `http://localhost:3000/health` to check if the server is running.

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login user | Public |
| GET | `/auth/profile` | Get user profile | Private |
| PUT | `/auth/profile` | Update user profile | Private |
| PUT | `/auth/change-password` | Change password | Private |

### Issue Management Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/issues` | Submit new issue | Private |
| POST | `/issues/ai-image` | Submit issue with AI image analysis | Private |
| POST | `/issues/ai-voice` | Submit issue with AI voice analysis | Private |
| GET | `/issues/user` | Get user's issues | Private |
| GET | `/issues/:id` | Get issue by ID | Private |
| PUT | `/issues/:id` | Update issue | Private |
| DELETE | `/issues/:id` | Delete issue | Private |
| POST | `/issues/upload/photo` | Upload photo | Private |
| POST | `/issues/upload/voice` | Upload voice | Private |
| POST | `/issues/classify-image` | Classify image with AI | Private |
| POST | `/issues/transcribe-voice` | Transcribe voice with AI | Private |

### Admin Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/admin/dashboard` | Get dashboard statistics | Admin |
| GET | `/admin/issues` | Get all issues | Admin |
| GET | `/admin/issues/:id` | Get issue by ID | Admin |
| PUT | `/admin/issues/:id` | Update issue | Admin |
| PATCH | `/admin/issues/:id/status` | Update issue status | Admin |
| DELETE | `/admin/issues/:id` | Delete issue | Admin |
| GET | `/admin/users` | Get all users | Admin |
| PATCH | `/admin/users/:id/role` | Update user role | Admin |
| DELETE | `/admin/users/:id` | Delete user | Admin |

## 🔧 Usage Examples

### 1. User Registration

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "role": "user"
  }'
```

### 2. User Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

### 3. Submit Issue

```bash
curl -X POST http://localhost:3000/api/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Pothole on Main Street",
    "description": "Large pothole causing damage to vehicles",
    "category": "Pothole",
    "latitude": 40.7128,
    "longitude": -74.0060
  }'
```

### 4. Upload Photo

```bash
curl -X POST http://localhost:3000/api/issues/upload/photo \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "photo=@/path/to/your/image.jpg"
```

### 5. Submit Issue with AI Image Analysis

```bash
curl -X POST http://localhost:3000/api/issues/ai-image \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/your/image.jpg" \
  -F "title=AI Detected Issue" \
  -F "description=Issue detected using AI"
```

## 🤖 AI Services

The API includes mocked AI services that simulate real AI functionality:

### Image Classification
- Analyzes uploaded images
- Categorizes issues (Pothole, Trash, Street Light, etc.)
- Provides confidence scores
- Returns suggestions and descriptions

### Voice Transcription
- Transcribes audio recordings
- Extracts keywords and context
- Categorizes issues based on speech content
- Provides confidence scores

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Register/Login**: Get a JWT token
2. **Include Token**: Add `Authorization: Bearer <token>` header to protected routes
3. **Token Expiry**: Tokens expire after 7 days (configurable)

## 📊 Database Schema

### User Schema
```javascript
{
  email: String (unique, required),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date,
  updatedAt: Date
}
```

### Issue Schema
```javascript
{
  reporterId: ObjectId (ref: 'User', required),
  title: String (required),
  description: String (required),
  category: String (required, enum: ['Pothole', 'Trash', 'Street Light', 'Traffic Signal', 'Other']),
  status: String (enum: ['PENDING', 'VERIFIED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'], default: 'PENDING'),
  mediaUrl: String,
  latitude: Number,
  longitude: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## 🛡️ Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation and sanitization
- File upload restrictions
- CORS protection
- Error handling without sensitive data exposure

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/civicsight
JWT_SECRET=your_very_secure_jwt_secret_key
MAX_FILE_SIZE=10485760
UPLOAD_PATH=/app/uploads
```

### Docker Deployment (Optional)

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN mkdir -p uploads
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

Test the API using tools like:
- **Postman**: Import the API collection
- **curl**: Command-line testing
- **Thunder Client**: VS Code extension
- **Insomnia**: API testing tool

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

## 🔧 Development

### Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests (when implemented)
```

### Code Structure

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and database operations
- **Models**: Define database schemas and validation
- **Routes**: Define API endpoints and middleware
- **Middlewares**: Custom authentication and validation logic
- **Utils**: Helper functions and error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API documentation
- Review the error messages
- Check server logs for detailed error information
- Ensure all environment variables are properly set

## 🔄 Updates

- **v1.0.0**: Initial release with core functionality
- Mocked AI services for development and testing
- Complete CRUD operations for issues and users
- Admin panel with dashboard and management features
- File upload support with validation
- Comprehensive error handling and validation

---

**Happy Coding! 🚀**
