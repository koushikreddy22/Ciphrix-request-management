const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// ----- SECURITY MIDDLEWARE -----

// 1️⃣ Helmet - secure HTTP headers
app.use(helmet());

// 2️⃣ Disable "X-Powered-By"
app.disable('x-powered-by');

// 3️⃣ Prevent huge JSON payloads
app.use(express.json({ limit: "1mb" }));

// 4️⃣ Rate limiting (for /api/auth to prevent brute force)
app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // 50 requests per IP per 15 mins
    message: "Too many login attempts. Try again later.",
  })
);

// 5️⃣ CORS - allow only your frontend
const allowedOrigins = [
  "http://localhost:8000",
  "https://ciphrix-request-management.vercel.app", // replace with actual Vercel URL
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// 6️⃣ Logging (use combined in production)
app.use(morgan("dev"));

// -------- ROUTES --------
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/requests', require('./src/routes/requests'));
app.use('/api/users', require('./src/routes/users'));

app.get('/', (req, res) => {
  res.send('Server is running securely.');
});

// -------- START SERVER --------
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
