# 🎣 Fishing Demo

**Fishing Demo** is a cybersecurity awareness training platform.  
It allows managers to run **phishing simulations** by sending mock malicious emails to their employees, tracking responses, and visualizing results.

---

## 🚀 Features

- **👨‍💼 Manager Dashboard**
  - Add workers under a manager account.
  - Manage employee details.

- **📧 Phishing Test**
  - Launch a phishing simulation with one click.
  - Automatically sends test emails to all assigned workers.
  - Each email contains a tracked "malicious" link.

- **📊 Results & Reporting**
  - Track which workers clicked the phishing link.
  - View results in real time under the **"View Test"** button.
  - Use reports to improve awareness training.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js + React + TailwindCSS
- **Backend:** Node.js (Next.js API routes)
- **Database:** PostgreSQL
- **Email Sending:** Nodemailer (or SMTP service)
- **Authentication:** Cookie-based login with session tokens

