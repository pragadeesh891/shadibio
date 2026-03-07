# ShadiBio - Setup and Installation Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Git (optional, for version control)

## Quick Start

### 1. Clone and Setup

```bash
# Clone the repository (if using Git)
git clone <repository-url>
cd shadibio

# Or navigate to your project directory
cd path/to/shadibio
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install backend dependencies
npm install

# Return to root directory
cd ..
```

### 3. Frontend Setup

```bash
# Navigate to client directory
cd client

# Install frontend dependencies
npm install

# Return to root directory
cd ..
```

### 4. Environment Configuration

Create a `.env` file in the root directory (copy from `.env.example`):

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/shadibio
# For MongoDB Atlas, use:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shadibio

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production

# Client Configuration
CLIENT_URL=http://localhost:3000
```

### 5. Start MongoDB

If using local MongoDB:
```bash
# Start MongoDB service (varies by OS)
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### 6. Run the Application

```bash
# Option 1: Run both frontend and backend simultaneously
npm run dev

# Option 2: Run backend only
npm run server

# Option 3: Run frontend only (in another terminal)
npm run client
```

## Development URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs (if implemented)

## Project Structure

```
shadibio/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # CSS/Tailwind styles
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/      # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── config/           # Configuration files
│   ├── utils/            # Utility functions
│   └── index.js         # Server entry point
├── .env                   # Environment variables
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore rules
├── package.json         # Root package.json
└── README.md           # Project documentation
```

## Key Features Implemented

### Authentication
- ✅ User registration with email validation
- ✅ Secure JWT-based login
- ✅ Password hashing with bcrypt
- ✅ Protected routes and API endpoints

### Biodata Creation
- ✅ Multi-step form wizard
- ✅ Personal details with automatic age calculation
- ✅ Family information section
- ✅ Education and profession details
- ✅ Optional horoscope section
- ✅ Profile photo upload with preview

### Templates & Preview
- ✅ Traditional template design
- ✅ Modern template design
- ✅ Real-time preview
- ✅ Template customization (colors, fonts)
- ✅ Responsive design

### Advanced Features
- ✅ Privacy controls (hide phone/email/income)
- ✅ Profile completion percentage
- ✅ PDF generation and download
- ✅ Template selection system

### Database
- ✅ MongoDB with Mongoose ODM
- ✅ User and Biodata collections
- ✅ Data validation and sanitization
- ✅ Profile completion calculation

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

### Biodata Management
- `POST /api/biodata` - Create biodata (protected)
- `GET /api/biodata/user/me` - Get user's biodata (protected)
- `PUT /api/biodata/:id` - Update biodata (protected)
- `DELETE /api/biodata/:id` - Delete biodata (protected)
- `GET /api/biodata/:id` - Get biodata by ID (public with privacy)
- `POST /api/biodata/:id/pdf` - Generate PDF (protected)

## Development Commands

```bash
# Backend development
npm run server        # Start backend with nodemon
npm start            # Start backend normally

# Frontend development
npm run client       # Start React development server
npm run build        # Build production frontend

# Both servers
npm run dev          # Start both frontend and backend
```

## Deployment

### Backend Deployment Options:
1. **Render** - https://render.com
2. **Railway** - https://railway.app
3. **Heroku** - https://heroku.com
4. **DigitalOcean App Platform** - https://digitalocean.com

### Frontend Deployment Options:
1. **Vercel** - https://vercel.com
2. **Netlify** - https://netlify.com
3. **GitHub Pages** - https://pages.github.com

### Database Options:
1. **MongoDB Atlas** (Recommended) - https://cloud.mongodb.com
2. **Local MongoDB** for development

## Environment Variables for Production

```env
# Production configuration
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shadibio
JWT_SECRET=your_production_secret_key_here
CLIENT_URL=https://your-frontend-domain.com
```

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network access for MongoDB Atlas

2. **Port Already in Use**
   - Change PORT in `.env`
   - Kill existing processes on the port

3. **CORS Errors**
   - Verify CLIENT_URL in `.env`
   - Check if frontend is running on correct port

4. **JWT Token Issues**
   - Ensure JWT_SECRET is set
   - Check token expiration settings

5. **PDF Generation Issues**
   - Verify html-pdf-node dependencies
   - Check server memory allocation

## Security Considerations

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Protected API routes
- ✅ Privacy controls for sensitive data

## Next Steps

1. **Testing**: Run comprehensive tests
2. **Optimization**: Implement performance improvements
3. **Documentation**: Add detailed API documentation
4. **Monitoring**: Add logging and error tracking
5. **Deployment**: Deploy to production environment

## Support

For issues and questions:
- Check the troubleshooting section above
- Review the project documentation
- Contact the development team

## License

This project is licensed under the MIT License.