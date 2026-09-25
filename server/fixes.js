const FIXES = {
  'missing-helmet': {
    title: 'Install and configure Helmet.js',
    code: `const helmet = require('helmet');\napp.use(helmet());\n// Automatically sets CSP, HSTS, and X-Frame-Options.`
  },
  'cors-wildcard': {
    title: 'Restrict CORS to your frontend origin',
    code: `app.use(cors({\n  origin: process.env.CLIENT_URL || 'https://yourdomain.com',\n  credentials: true\n}));`
  },
  'no-rate-limit-auth': {
    title: 'Add rate limiting to authentication routes',
    code: `const rateLimit = require('express-rate-limit');\nconst authLimiter = rateLimit({\n  windowMs: 15 * 60 * 1000,\n  max: 5,\n  message: 'Too many login attempts'\n});\napp.use('/api/auth', authLimiter);`
  },
  'jwt-no-expiry': {
    title: 'Add expiration to JWT generation',
    code: `const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {\n  expiresIn: '1h'\n});`
  },
  'nosql-injection': {
    title: 'Sanitize MongoDB queries',
    code: `const mongoSanitize = require('express-mongo-sanitize');\napp.use(mongoSanitize());\n// Cast query inputs explicitly:\nconst user = await User.findOne({ username: String(req.body.username) });`
  }
};

module.exports = FIXES;