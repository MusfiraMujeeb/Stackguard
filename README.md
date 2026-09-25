# StackGuard — MERN Security Posture Scanner & Fix Advisor

> A full-stack security auditing tool that scans web applications for OWASP Top 10 vulnerabilities at both source-code and network levels, providing automated, actionable remediation code snippets.

---

## 🚀 What It Does
* **Network & Header Auditing:** Automatically inspects live URLs for missing HTTP security headers (CSP, HSTS, X-Frame-Options) and weak TLS configurations.
* **MERN Stack Code Checks:** Scans backend repositories for common security misconfigurations, including missing Helmet.js middleware, CORS wildcards, missing authentication rate limits, and NoSQL injection vulnerabilities.
* **Interactive Fix Advisor:** Goes beyond detection by outputting exact, copy-pasteable remediation code snippets for every detected finding.
* **Security Scoring & Visualization:** Calculates a dynamic security score and visualizes risk severity distribution using interactive charts.

---

## 🛠️ Tech Stack
* **Frontend:** React, Vite, Tailwind CSS, Recharts
* **Backend:** Node.js, Express.js, Axios, TLS/HTTPS modules
* **Database:** MongoDB, Mongoose
* **Utilities:** Simple-Git, Dotenv, Helmet, CORS

---

## 📊 Real-World Validation
StackGuard was validated by auditing a production MERN service-marketplace application (`LankaServe`):
* **Before Fixes:** 8 security findings (2 Critical, 3 High, 3 Medium) | Security Score: **42/100**
* **After Remediation:** 2 findings (Low severity) | Security Score: **91/100**
* **Key Improvements Added:** Enforced CSP headers, restricted CORS to trusted origins, implemented express-rate-limit on auth routes, and secured MongoDB query sanitization.

---

## ⚙️ Quick Start

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/MusfiraMujeeb/stackguard.git](https://github.com/MusfiraMujeeb/stackguard.git)
   cd stackguard
