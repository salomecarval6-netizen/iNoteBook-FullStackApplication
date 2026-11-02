import express from 'express';

import dotenv from "dotenv"; // Modern ES Module syntax
dotenv.config();

const app = express();
const port = process.env.PORT || 5000; // http://localhost:5000 (The Server Port)

import connectToMongo from './db.js';
import cors from 'cors';
import helmet from 'helmet'; // DEPLOYMENT FIX: Adds security-related HTTP headers.
import rateLimit from 'express-rate-limit'; // DEPLOYMENT FIX: Limits excessive API requests.

// npm i -D nodemon in terminal
// npx nodemon index.js

// DEPLOYMENT FIX: Configure CORS to allow only trusted frontend origins.
// In production, CLIENT_URL should contain your deployed Vercel URL.
// Multiple origins can be separated by commas.
const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

// Allow localhost during development.
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push(
    'http://localhost:5173',
    'http://localhost:3000'
  );
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests without an Origin header (e.g. health checks).
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'auth-token'],
}));

// DEPLOYMENT FIX: Trust the first proxy when deployed behind a hosting proxy.
// This is important for correct client IP detection by rate limiting.
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// DEPLOYMENT FIX: Adds secure HTTP response headers.
app.use(helmet());

// DEPLOYMENT FIX: Limit repeated requests to authentication routes.
// Helps reduce brute-force attempts against login/signup.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.'
  }
});

// This allows all origins
// OLD: app.use(cors());
// Replaced with the restricted CORS configuration above.

// is a middleware that tells your Express server to automatically read and parse incoming JSON data.
// Without this line: Express receives the raw text but doesn't know what to do. If you try to look at req.body to see the data, it will just show up as undefined.
// With this line: Express intercepts the request, reads the raw text, converts it into a clean JavaScript object, and stuffs it into req.body so you can easily read it.
app.use(express.json({ limit: '10kb' })); // DEPLOYMENT FIX: Limits JSON body size.

// DEPLOYMENT FIX: Health endpoint used by hosting platforms to check server status.
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'iNotebook backend is running'
  });
});

import authRouter from './routes/auth.routes.js';
import notesRouter from './routes/notes.routes.js';

// Available Routes:
app.use('/api/auth', authLimiter, authRouter); // Any incoming URL requests that begin with /api/auth should be handed over directly to the authRouter file.
app.use('/api/notes', notesRouter);

// async behaviour thus express loads first then mongo

app.use((err, req, res, next) => {
  console.error("[EXPRESS PIPELINE ERROR CRASHED]:");
  console.error(err.stack || err);

  const statusCode = err.statusCode || 500;
  const message = err.statusCode
    ? err.message
    : "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    message: message,
    errors: err.errors || []
  });
});

// DEPLOYMENT FIX: Connect to MongoDB BEFORE starting the server.
// This prevents the application from accepting API requests
// when the database connection has failed.
const startServer = async () => {
  try {
    await connectToMongo();

    app.listen(port, () => {
      console.log(`iNotebook backend listening on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to start server because MongoDB connection failed:', error);
    process.exit(1);
  }
};

startServer();