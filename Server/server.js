require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const connectDB = require('./database/db.js');
const cors = require('cors');
const User = require('./models/User.js');
const { truncate } = require('lodash');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
require('./auth/google'); // Google OAuth strategy setup
connectDB(); //Database connection

const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_ORIGINS = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());
const app = express();
app.set('trust proxy', 1);
app.use(
  cors({
    origin: FRONTEND_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);
// Body parsers
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'change_me_in_env',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL, // MongoDB connection string
      ttl: 14 * 24 * 60 * 60, // session expiration (14 days)
    }),
    cookie: {
      secure: NODE_ENV === 'production',
      sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);
// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
const AuthRoute = require('./routes/authRoute.js');
const googleStrategy = require('./routes/googleStrategy.js');
const fileuploadRoute = require('./routes/fileUpload.js');
const reviewRoute = require('./routes/reviewRoute.js');
app.use('/api/user', AuthRoute);
app.use('/api/user', googleStrategy);
app.use('/api/user', fileuploadRoute);
app.use('/api/user', reviewRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//  Protected route
// app.get('/protected', (req, res) => {
//     if (!req.isAuthenticated()) {
//         return res.status(401).json({ success: false, message: "Not authorized" });
//     }
//     res.json({ success: true, user: req.user });
// });

// // Logout
// app.get('/logout', (req, res) => {
//     req.logout(() => {
//         res.redirect('/');
//     });
// });
