const axios = require('axios');
const tls = require('tls');

const SECURITY_HEADERS = {
  'strict-transport-security': { severity: 'High', desc: 'HSTS missing — HTTPS downgrade attacks possible' },
  'content-security-policy': { severity: 'High', desc: 'CSP missing — XSS risk increased' },
  'x-frame-options': { severity: 'Medium', desc: 'Clickjacking protection missing' },
  'x-content-type-options': { severity: 'Medium', desc: 'MIME sniffing possible' },
  'referrer-policy': { severity: 'Low', desc: 'Referrer leakage risk' }
};

async function checkHeaders(url) {
  const findings = [];
  try {
    const res = await axios.get(url, { validateStatus: () => true, timeout: 10000 });
    for (const [header, meta] of Object.entries(SECURITY_HEADERS)) {
      if (!res.headers[header]) {
        findings.push({
          type: 'network', category: 'header', name: header,
          severity: meta.severity, description: meta.desc,
          remediation: `Add "${header}" via Helmet.js or manual middleware.`
        });
      }
    }
    if (res.headers['x-powered-by']) {
      findings.push({
        type: 'network', category: 'header', name: 'x-powered-by',
        severity: 'Low', description: 'Technology stack exposed.',
        remediation: 'Disable X-Powered-By header or use Helmet.js.'
      });
    }
  } catch (e) {
    findings.push({ type: 'network', category: 'error', severity: 'High', description: 'Target URL unreachable' });
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
            severity: 'Critical', description: `Deprecated protocol: ${protocol}`,
            remediation: 'Enforce TLS 1.2 or TLS 1.3 on your server.'
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