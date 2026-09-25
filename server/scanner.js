const axios = require('axios');
const tls = require('tls');

const SECURITY_HEADERS = {
  'strict-transport-security': {
    severity: 'High',
    desc: 'HSTS missing — HTTPS downgrade attacks possible',
    fixTitle: 'Enable HSTS',
    fixCode: `app.use(helmet.hsts({\n  maxAge: 31536000,\n  includeSubDomains: true,\n  preload: true\n}));`
  },
  'content-security-policy': {
    severity: 'High',
    desc: 'CSP missing — XSS risk increased',
    fixTitle: 'Add Content Security Policy',
    fixCode: `app.use(helmet.contentSecurityPolicy({\n  directives: {\n    defaultSrc: ["'self'"],\n    scriptSrc: ["'self'"],\n    styleSrc: ["'self'", "'unsafe-inline'"],\n    imgSrc: ["'self'", "data:", "https:"],\n    objectSrc: ["'none'"]\n  }\n}));`
  },
  'x-frame-options': {
    severity: 'Medium',
    desc: 'Clickjacking protection missing',
    fixTitle: 'Block clickjacking',
    fixCode: `app.use(helmet.frameguard({ action: 'deny' }));`
  },
  'x-content-type-options': {
    severity: 'Medium',
    desc: 'MIME sniffing possible',
    fixTitle: 'Prevent MIME sniffing',
    fixCode: `app.use(helmet.noSniff());`
  },
  'referrer-policy': {
    severity: 'Low',
    desc: 'Referrer leakage risk',
    fixTitle: 'Set Referrer-Policy',
    fixCode: `app.use(helmet.referrerPolicy({\n  policy: 'strict-origin-when-cross-origin'\n}));`
  }
};

async function checkHeaders(url) {
  const findings = [];
  try {
    const res = await axios.get(url, { validateStatus: () => true, timeout: 10000 });
    for (const [header, meta] of Object.entries(SECURITY_HEADERS)) {
      if (!res.headers[header]) {
        findings.push({
          type: 'network',
          category: 'header',
          name: header,
          severity: meta.severity,
          description: meta.desc,
          fix: { title: meta.fixTitle, code: meta.fixCode }
        });
      }
    }
    if (res.headers['x-powered-by']) {
      findings.push({
        type: 'network',
        category: 'header',
        name: 'x-powered-by',
        severity: 'Low',
        description: 'Technology stack exposed.',
        fix: {
          title: 'Hide tech stack',
          code: `app.disable('x-powered-by');\n// Helmet removes this automatically too`
        }
      });
    }
  } catch (e) {
    findings.push({
      type: 'network', category: 'error', severity: 'High',
      description: 'Target URL unreachable',
      fix: { title: 'Verify URL', code: `// Check that ${url} is reachable` }
    });
  }
  return findings;
}

function checkTLS(url) {
  return new Promise((resolve) => {
    try {
      const host = new URL(url).hostname;
      const socket = tls.connect(443, host, { servername: host }, () => {
        const findings = [];
        const protocol = socket.getProtocol();
        if (protocol === 'TLSv1' || protocol === 'TLSv1.1') {
          findings.push({
            type: 'network', category: 'tls', name: 'weak-tls',
            severity: 'Critical',
            description: `Deprecated protocol: ${protocol}`,
            fix: {
              title: 'Enforce TLS 1.2+',
              code: `// nginx:\nssl_protocols TLSv1.2 TLSv1.3;\n\n// Node.js:\nhttps.createServer({\n  minVersion: 'TLSv1.2',\n  ...options\n}, app);`
            }
          });
        }
        socket.end();
        resolve(findings);
      });
      socket.on('error', () => resolve([]));
    } catch (e) {
      resolve([]);
    }
  });
}

module.exports = { checkHeaders, checkTLS };