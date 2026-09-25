# Changelog

All notable changes to StackGuard are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Framework-aware fix generation (Express vs Next.js)
- Source-code scanning for MERN backends
- GitHub repo URL input (clone + scan)
- PDF report export
- Persistent scan history (MongoDB)

## [1.0.0] - 2026-09-25

### Added
- Live HTTP security header scanner (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- TLS protocol inspection via Node's `tls` module
- Information disclosure detection (`X-Powered-By`)
- Fix advisor returning ready-to-paste Helmet.js / Next.js remediation code
- 0–100 security score with OWASP-aligned severity weights
- React dashboard with severity-coded finding cards and pie chart
- In-memory scan history (last 5 audits)
- Before/after validation against a production Next.js application (60 → 100)

### Security
- Passive scanning only — no exploitation, no payload injection
