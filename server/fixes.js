const FIXES = {
  'strict-transport-security': {
    title: 'Enable HSTS',
    code: `app.use(helmet.hsts({\n  maxAge: 31536000,\n  includeSubDomains: true,\n  preload: true\n}));`
  },
  'content-security-policy': {
    title: 'Add Content Security Policy',
    code: `app.use(helmet.contentSecurityPolicy({\n  directives: {\n    defaultSrc: ["'self'"],\n    scriptSrc: ["'self'"],\n    styleSrc: ["'self'", "'unsafe-inline'"],\n    imgSrc: ["'self'", "data:", "https:"],\n    objectSrc: ["'none'"]\n  }\n}));`
  },
  'x-frame-options': {
    title: 'Block clickjacking',
    code: `app.use(helmet.frameguard({ action: 'deny' }));`
  },
  'x-content-type-options': {
    title: 'Prevent MIME sniffing',
    code: `app.use(helmet.noSniff());`
  },
  'referrer-policy': {
    title: 'Set Referrer-Policy',
    code: `app.use(helmet.referrerPolicy({\n  policy: 'strict-origin-when-cross-origin'\n}));`
  },
  'x-powered-by': {
    title: 'Hide tech stack',
    code: `app.disable('x-powered-by');\n// Helmet removes this automatically too`
  },
  'weak-tls': {
    title: 'Enforce TLS 1.2+',
    code: `// nginx:\nssl_protocols TLSv1.2 TLSv1.3;\n\n// Node.js:\nhttps.createServer({\n  minVersion: 'TLSv1.2',\n  ...options\n}, app);`
  },
  // Code scanner fixes
  'missing-helmet': {
    title: 'Install and configure Helmet.js',
    code: `const helmet = require('helmet');\napp.use(helmet());`
  },
  'cors-wildcard': {
    title: 'Restrict CORS to your frontend origin',
    code: `app.use(cors({\n  origin: process.env.CLIENT_URL || 'https://yourdomain.com',\n  credentials: true\n}));`
  },
  'no-rate-limit-auth': {
    title: 'Add rate limiting to auth routes',
    code: `const rateLimit = require('express-rate-limit');\nconst authLimiter = rateLimit({\n  windowMs: 15 * 60 * 1000,\n  max: 5,\n  message: 'Too many login attempts'\n});\napp.use('/api/auth', authLimiter);`
  },
  'jwt-no-expiry': {
    title: 'Add expiry to JWT tokens',
    code: `const token = jwt.sign(\n  { userId: user._id },\n  process.env.JWT_SECRET,\n  { expiresIn: '1h' }\n);`
  },
  'nosql-injection': {
    title: 'Sanitize MongoDB queries',
    code: `const mongoSanitize = require('express-mongo-sanitize');\napp.use(mongoSanitize());\nconst user = await User.findOne({\n  username: String(req.body.username)\n});`
  }
};

module.exports = FIXES;