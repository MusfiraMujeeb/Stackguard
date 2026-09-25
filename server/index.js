const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { checkHeaders, checkTLS } = require('./scanner');
const FIXES = require('./fixes');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory array to store the last 5 scans
let scanHistory = [];

app.post('/api/scan', async (req, res) => {
  const { liveUrl } = req.body;
  
  const headerFindings = await checkHeaders(liveUrl);
  const tlsFindings = await checkTLS(liveUrl);
  
  const allFindings = [...headerFindings, ...tlsFindings].map(f => ({
    ...f,
    fix: FIXES[f.name] || { title: 'General Remediation', code: f.remediation }
  }));

  const deduction = allFindings.reduce((acc, f) => {
    if (f.severity === 'Critical') return acc + 25;
    if (f.severity === 'High') return acc + 15;
    if (f.severity === 'Medium') return acc + 10;
    return acc + 5;
  }, 0);

  const score = Math.max(0, 100 - deduction);

  const scanResult = {
    liveUrl,
    findings: allFindings,
    score,
    scannedAt: new Date()
  };

  // Add to history and keep only the latest 5
  scanHistory.unshift(scanResult);
  if (scanHistory.length > 5) {
    scanHistory.pop();
  }

  res.json(scanResult);
});

// Endpoint to fetch recent scan history
app.get('/api/history', (req, res) => {
  res.json(scanHistory);
});

app.listen(5000, () => console.log('StackGuard Backend running seamlessly on port 5000'));