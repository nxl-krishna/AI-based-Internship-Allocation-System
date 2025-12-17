# 🏛️ National Internship Portal (InternAI)

A full-stack AI-powered Internship Allocation System built for Indian  youth to allocate the internship provided by the government (problem statement from the SIH2025). This platform automates the matching of students to internships using Machine Learning for resume parsing and an algorithmic allocation engine for merit-based selection.

## ✨ Key Features
- **AI Resume Parsing:** Automatically extracts skills and predicts job categories (e.g., "Data Science", "React Developer") using a Python/HuggingFace API.
- **Smart Allocation Engine:** Admin tools to run algorithmic matching based on merit (CGPA) and quotas.
- **Dual Role System:** Separate dashboards for **Students** (Apply/View Status) and **Admins** (Manage Jobs/Run Algo).
- **Auto-Apply Logic:** Automatically matches students to relevant openings based on their AI profile.
- **Government-Style UI:** Landing page designed to match Indian Government portal aesthetics.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- **[Bun](https://bun.sh/)** (v1.0 or higher) - *We use Bun for super-fast package management.*
- **Git**

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <YOUR_REPOSITORY_URL>
cd internship-allocation-system


### 2. Install Dependencies
Use Bun to install the required packages:

bun install


Here is a comprehensive README.md file tailored for your Internship Allocation System. It includes all the necessary instructions for another developer to clone, set up, and run your project using Bun.

Create a file named README.md in your project root and paste this content:

Markdown

# 🏛️ National Internship Portal (InternAI)

A full-stack AI-powered Internship Allocation System built for IIT Gandhinagar. This platform automates the matching of students to internships using Machine Learning for resume parsing and an algorithmic allocation engine for merit-based selection.

![Tech Stack](https://img.shields.io/badge/Tech-Next.js_15-black) ![Tech Stack](https://img.shields.io/badge/Database-MySQL_(Aiven)-blue) ![Tech Stack](https://img.shields.io/badge/Auth-Clerk-purple) ![Tech Stack](https://img.shields.io/badge/Runtime-Bun-f4f4f4)

## ✨ Key Features
- **AI Resume Parsing:** Automatically extracts skills and predicts job categories (e.g., "Data Science", "React Developer") using a Python/HuggingFace API.
- **Smart Allocation Engine:** Admin tools to run algorithmic matching based on merit (CGPA) and quotas.
- **Dual Role System:** Separate dashboards for **Students** (Apply/View Status) and **Admins** (Manage Jobs/Run Algo).
- **Auto-Apply Logic:** Automatically matches students to relevant openings based on their AI profile.
- **Government-Style UI:** Landing page designed to match Indian Government portal aesthetics.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- **[Bun](https://bun.sh/)** (v1.0 or higher) - *We use Bun for super-fast package management.*
- **Git**

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <YOUR_REPOSITORY_URL>
cd internship-allocation-system
2. Install Dependencies
Use Bun to install the required packages:

Bash

bun install
3. Configure Environment Variables
Create a .env file in the root directory. Copy the following variables and fill in your keys:

Code snippet

# Database Connection (Aiven or Local MySQL)
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/defaultdb?ssl-mode=REQUIRED"

# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Redirects after Login/Signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/home
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/home

# AI Model API (Hugging Face / Python Backend)
NEXT_PUBLIC_AI_API_URL="[https://divyanshnahar15-resume-parse.hf.space/predict/pdf](https://divyanshnahar15-resume-parse.hf.space/predict/pdf)"
4. Setup the Database (Prisma)
Sync your Prisma schema with your database (Aiven Cloud or Local):

Bash

# Push schema to the database
bunx prisma db push

# Generate TypeScript client
bunx prisma generate
Note: If you encounter network errors like P1001 on college Wi-Fi, switch to a mobile hotspot.

🏃‍♂️ Running the Project
Start the development server:

Bash

bun run dev
Open http://localhost:3000 in your browser.

👮‍♂️ Setting up an Admin User
By default, all new users are registered as APPLICANT. To access the Admin Panel:

Sign Up on the website normally.

Access the Database (via MySQL Workbench) OR use a temporary API route if deployed.

Run this SQL query to promote your user:

SQL

UPDATE User 
SET role = 'ADMIN' 
WHERE email = 'your-email@example.com';
Refresh the website. You will now see the Admin Panel link in the navigation bar.

📂 Project Structure
Bash

├── app/
│   ├── admin/          # Admin Dashboard & Algo Logic
│   ├── dashboard/      # Student Dashboard
│   ├── home/           # Central Hub (Post-login)
│   ├── api/            # Backend API Routes
│   ├── layout.tsx      # Global Navbar & Auth Logic
│   └── page.tsx        # Public Landing Page (Govt Style)
├── lib/
│   ├── actions.ts      # Server Actions (Apply, Accept, Reject)
│   └── ml-service.ts   # AI API Integration
├── prisma/
│   └── schema.prisma   # Database Models
└── middleware.ts       # Route Protection (Clerk)
🐞 Troubleshooting
Error: Export acceptOffer doesn't exist

Ensure you are importing from @/lib/actions (plural), not action.

Error: Property aiCategory does not exist

Run bunx prisma generate and restart your VS Code TypeScript server (Ctrl+Shift+P -> Restart TS Server).

Database Connection Errors

Ensure your IP is whitelisted on Aiven (set to 0.0.0.0/0 for broad access).

Ensure your DATABASE_URL ends with ?ssl-mode=REQUIRED.

📜 License
This project is developed for academic purposes.
