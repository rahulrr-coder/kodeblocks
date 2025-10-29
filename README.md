# 🧩 KodeBlocks

> **Master Data Structures & Algorithms through first-principles thinking**

KodeBlocks is an open-source, gamified learning platform designed to help students master DSA through structured learning paths, consistent practice, and community collaboration.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=flat&logo=svelte&logoColor=white)](https://kit.svelte.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)

---

## 🌟 Philosophy

**Our mission is to cultivate a strong, collaborative coding culture.**

### First-Principles Thinking
We believe in understanding concepts from the ground up. Our learning tracks build intuition, not just pattern recognition.

### Community-Driven  
Learning DSA is hard, and it's better together. KodeBlocks features community events, leaderboards, and collaborative problem-solving.

### Quality Over Quantity
Curated, high-quality learning paths that genuinely prepare students for success—not thousands of random problems.

### Open Source
Built by students, for students. A FOSS project welcoming all contributors.

---

## ✨ Features

- 📚 **Structured Learning Tracks** - Curated paths for Foundations, Interview Prep, Deep Dives, and Problem Solving
- 🎮 **Gamification** - Earn badges, maintain weekly streaks, and track progress  
- 🏆 **Leaderboards** - Friendly competition to stay motivated
- 📊 **Personal Dashboard** - Visualize your progress and achievements
- 🎯 **Weekly Challenges** - Earn 5+ points per week to maintain streaks
- 👤 **Profile System** - Track solved problems by difficulty and earn achievements

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | [SvelteKit](https://kit.svelte.dev/) |
| **Runtime** | [Bun](https://bun.sh/) |
| **Backend & Auth** | [Supabase](https://supabase.com/) |
| **Database** | PostgreSQL (via Supabase) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Icons** | [Lucide Svelte](https://lucide.dev/) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 🚀 Quick Start

### Prerequisites

- **Bun** (v1.0+) - [Install Bun](https://bun.sh/docs/installation)
- **Supabase Account** - [Sign up for free](https://supabase.com/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/rahulrr-coder/kodeblocks.git
cd kodeblocks

# 2. Install dependencies
bun install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and add your Supabase credentials:
# VITE_SUPABASE_URL=your_project_url
# VITE_SUPABASE_ANON_KEY=your_anon_key

# 4. Run database migrations
# Go to your Supabase dashboard > SQL Editor
# Run the SQL from supabase-schema.sql

# 5. Start development server
bun run dev
```

Your app will be running at **http://localhost:5173/** 🎉

---

## 🏗️ Architecture

KodeBlocks follows **industry-standard SvelteKit best practices** with a clean, layered architecture.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     User Interface                      │
│                    (Svelte Components)                  │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│                   Routes (Thin Layer)                   │
│              • Data loading (+page.server.js)           │
│              • Rendering (+page.svelte)                 │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│              Feature Pages (lib/features/)              │
│              • Page composition & layout                │
│              • UI logic orchestration                   │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│            Services Layer (lib/services/)               │
│              • Business logic                           │
│              • Data transformations                     │
│              • Calculations & formatting                │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│               API Layer (lib/api/)                      │
│              • Database queries (Supabase)              │
│              • External API calls                       │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│                  Database (PostgreSQL)                  │
│              • Users, Problems, Progress                │
└─────────────────────────────────────────────────────────┘
```

### Project Structure

```
kodeblocks/
├── src/
│   ├── components/              # UI Components (feature-based)
│   │   ├── common/             # Shared: Navbar, Footer, DifficultyBadge
│   │   ├── dashboard/          # StatCard, ProgressBar
│   │   ├── leaderboard/        # LeaderboardTable
│   │   ├── login/              # GoogleLoginButton, EmailLoginForm
│   │   ├── profile/            # Profile-specific components
│   │   └── tracks/             # ProblemCard
│   │
│   ├── lib/
│   │   ├── features/           # Page compositions (NEW!)
│   │   │   ├── dashboard/DashboardPage.svelte
│   │   │   ├── leaderboard/LeaderboardPage.svelte
│   │   │   ├── login/LoginPage.svelte
│   │   │   ├── profile/ProfilePage.svelte
│   │   │   └── tracks/TrackPage.svelte
│   │   │
│   │   ├── api/                # Database queries
│   │   │   ├── problems.js     # Problem queries
│   │   │   ├── users.js        # User queries
│   │   │   ├── leaderboard.js  # Leaderboard queries
│   │   │   └── progress.js     # Progress tracking
│   │   │
│   │   ├── services/           # Business logic
│   │   │   ├── dashboard.js    # Dashboard data logic
│   │   │   ├── leaderboard.js  # Ranking calculations
│   │   │   ├── profile.js      # Profile aggregations
│   │   │   └── tracks.js       # Track progress logic
│   │   │
│   │   ├── config/             # Configuration
│   │   │   ├── tracks.js       # Track definitions
│   │   │   ├── badges.js       # Badge criteria
│   │   │   └── constants.js    # App constants
│   │   │
│   │   ├── stores.js           # Svelte stores (user, session)
│   │   ├── supabase.js         # Supabase client setup
│   │   ├── utils.js            # Utility functions
│   │   └── mockData.js         # Mock data for development
│   │
│   ├── routes/                 # Thin routing layer
│   │   ├── dashboard/          # +page.server.js, +page.svelte
│   │   ├── leaderboard/        # +page.server.js, +page.svelte
│   │   ├── login/              # +page.server.js, +page.svelte
│   │   ├── profile/            # +page.server.js, +page.svelte
│   │   ├── tracks/[trackName]/ # +page.server.js, +page.svelte
│   │   ├── auth/callback/      # OAuth callback
│   │   ├── +layout.server.js   # Root layout data
│   │   ├── +layout.svelte      # Root layout UI
│   │   └── +page.svelte        # Landing page
│   │
│   ├── app.css                 # Global styles (Tailwind v4)
│   ├── app.html                # HTML template
│   └── hooks.server.js         # Server hooks (auth)
│
├── static/                     # Static assets
├── supabase-schema.sql         # Database schema
├── package.json                # Dependencies
├── svelte.config.js            # SvelteKit config
├── tailwind.config.js          # Tailwind config
└── vite.config.js              # Vite config
```

### Key Architectural Principles

#### 1. **Thin Routes** (3-5 lines)
Routes only handle data loading and rendering. All UI logic lives in feature pages.

```svelte
<!-- routes/dashboard/+page.svelte -->
<script>
  import DashboardPage from '$lib/features/dashboard/DashboardPage.svelte';
  export let data;
</script>

<DashboardPage {data} />
```

#### 2. **Feature-Based Components**
Components organized by the page/feature they belong to, not by type.

```
✅ components/dashboard/StatCard.svelte
✅ components/login/GoogleLoginButton.svelte
❌ components/StatCard.svelte (flat structure)
```

#### 3. **Clear Separation of Concerns**

| Layer | Responsibility | Example |
|-------|---------------|---------|
| **Routes** | Routing only | Import feature page, pass data |
| **Features** | Page composition | Assemble components, layout |
| **Components** | UI presentation | Reusable UI elements |
| **Services** | Business logic | Calculations, transformations |
| **API** | Data access | Database queries |

#### 4. **Path Aliases for Clean Imports**

```javascript
import DashboardPage from '$lib/features/dashboard/DashboardPage.svelte';
import StatCard from '$components/dashboard/StatCard.svelte';
import { getDashboardData } from '$lib/services/dashboard.js';
```

---

## 📊 Database Schema

### Core Tables

**users** - User profiles and authentication
```sql
- id (uuid, pk)
- email (text)
- display_name (text)
- profile_picture (text)
- batch (text)
- created_at (timestamp)
```

**problems** - DSA problems
```sql
- id (uuid, pk)
- title (text)
- difficulty (Easy/Medium/Hard)
- points (integer)
- track (text)
- problem_url (text)
- order_index (integer)
```

**user_progress** - Solved problems tracking
```sql
- id (uuid, pk)
- user_id (uuid, fk)
- problem_id (uuid, fk)
- completed_at (timestamp)
```

---

## 🎯 Features in Detail

### Learning Tracks
- **Foundations** - Core DSA concepts
- **Interview Prep** - Common interview patterns
- **Deep Dive** - Advanced algorithms
- **Problem Solving** - Practice problems

### Gamification System
- **Points** - Earn based on problem difficulty
- **Streaks** - Maintain weekly momentum (5+ points/week)
- **Badges** - Unlock achievements
- **Leaderboard** - Global and weekly rankings

### Mock Mode
Development mode with mock data (no Supabase required):
```bash
# Set in .env
VITE_USE_MOCK_DATA=true
```

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing architecture patterns
- Keep routes thin (3-5 lines)
- Organize components by feature
- Write meaningful commit messages
- Test your changes locally

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📚 Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Detailed architecture documentation
- **[STRUCTURE_SUMMARY.md](STRUCTURE_SUMMARY.md)** - Quick reference guide
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Step-by-step setup instructions
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Production deployment guide

---

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Kalvium Students** - For inspiring this project
- **SvelteKit Team** - For an amazing framework
- **Supabase Team** - For the best backend platform
- **Bun Team** - For blazing-fast tooling
- **All Contributors** - For making this project better

---

## 📬 Contact & Support

- **Issues** - [GitHub Issues](https://github.com/rahulrr-coder/kodeblocks/issues)
- **Discussions** - [GitHub Discussions](https://github.com/rahulrr-coder/kodeblocks/discussions)

---

<p align="center">
  Made with ❤️ by students, for students
</p>

<p align="center">
  <a href="#-kodeblocks">Back to Top ↑</a>
</p>