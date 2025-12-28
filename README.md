# 🔐 CRYPTUS - DSA Learning Platform

A modern, gamified Data Structures & Algorithms learning platform with an integrated code editor, AI assistant, and competitive leaderboard.

![CRYPTUS Banner](https://img.shields.io/badge/CRYPTUS-DSA%20Guide-6366f1?style=for-the-badge&logo=bookstack&logoColor=white)

## ✨ Features

- 📚 **Comprehensive DSA Curriculum** - Topics covering Arrays, Strings, Linked Lists, Binary Search, Recursion, DP, and more
- 💻 **Built-in Code Editor** - Monaco Editor with syntax highlighting for C++, Python, Java, JavaScript, and C
- ▶️ **Run & Submit** - Execute code against test cases with real-time feedback
- 🤖 **AI Assistant** - Context-aware AI that helps with hints (not solutions!) and debugging
- 🏆 **Leaderboard** - Compete with others based on streak, XP, and problems solved
- 🔥 **Streak System** - Build consistency with daily problem-solving streaks
- 📊 **Progress Tracking** - Track XP, solved problems, and difficulty breakdown
- 🔐 **Google OAuth** - Secure authentication with Google accounts
- 📖 **Worked Examples** - Detailed step-by-step walkthroughs for each problem

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **TailwindCSS** for styling
- **Wouter** for routing
- **TanStack Query** for data fetching
- **Monaco Editor** for code editing
- **Radix UI** for accessible components

### Backend
- **Node.js** with Express
- **TypeScript**
- **Drizzle ORM** with PostgreSQL
- **Passport.js** with Google OAuth
- **Piston API** for code execution

### AI
- **Groq API** with Llama 3.1 for AI assistance

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** v18 or higher
- **npm** v9 or higher
- **PostgreSQL** database (or use a cloud service like [Supabase](https://supabase.com), [Neon](https://neon.tech), or [Railway](https://railway.app))
- **Google Cloud Console** account (for OAuth)
- **Groq API Key** (optional, for AI features) - [Get it here](https://console.groq.com)

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Dedeep007/Cryptus-DSA-Guide.git
cd Cryptus-DSA-Guide
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Database (PostgreSQL connection string)
DATABASE_URL=postgresql://username:password@host:port/database

# Session Secret (generate a random string)
SESSION_SECRET=your-super-secret-session-key-here

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=your-redirect-url

# Environment
NODE_ENV=development

# Groq AI API Key (optional - for AI assistant)
GROQ_API_KEY=gsk_your_groq_api_key
```

### 4. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Select **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)
7. Copy the **Client ID** and **Client Secret** to your `.env` file

### 5. Set Up the Database

Push the schema to your database:

```bash
npm run db:push
```

### 6. Ingest Curriculum Data (Optional)

To populate the database with DSA problems:

```bash
npx tsx scripts/ingest-curriculum.ts
```

### 7. Start the Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:5000**

## 📁 Project Structure

```
Cryptus-DSA-Guide/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   └── lib/            # Utilities
├── server/                 # Backend Express server
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Database operations
│   ├── auth.ts             # Authentication logic
│   ├── executor.ts         # Code execution engine
│   └── ai-service.ts       # AI assistant service
├── shared/                 # Shared types and schemas
│   ├── schema.ts           # Drizzle database schema
│   └── routes.ts           # API type definitions
├── scripts/                # Data ingestion scripts
└── drizzle.config.ts       # Drizzle ORM configuration
```

## 🎮 Usage

### For Students
1. **Sign in** with your Google account
2. **Browse topics** in the sidebar
3. **Select a problem** to solve
4. **Write code** in the editor
5. **Run** to test against sample cases
6. **Submit** to validate against all test cases and earn XP
7. **Ask the AI** for hints if stuck

### XP System
| Difficulty | XP Earned |
|------------|-----------|
| Easy       | 50 XP     |
| Medium     | 100 XP    |
| Hard       | 200 XP    |

### Leaderboard Ranking
Rankings are based on (in order of priority):
1. 🔥 **Streak** - Consecutive days of solving
2. 🎯 **XP** - Total experience points
3. 🏆 **Problems Solved** - Total count

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Drizzle Studio |

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- DSA problems inspired by [Striver's A2Z DSA Sheet](https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2)
- Code execution powered by [Piston API](https://github.com/engineer-man/piston)
- AI powered by [Groq](https://groq.com)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/Dedeep007">Dedeep</a>
</p>
