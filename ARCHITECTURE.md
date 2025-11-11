# 🏗️ KodeBlocks Architecture

> **Comprehensive technical documentation for developers**

This document provides an in-depth overview of KodeBlocks' architecture, design decisions, and implementation patterns.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture Principles](#architecture-principles)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Data Flow](#data-flow)
- [Layer Documentation](#layer-documentation)
- [Database Schema](#database-schema)
- [Authentication Flow](#authentication-flow)
- [State Management](#state-management)
- [Design Patterns](#design-patterns)
- [Adding New Features](#adding-new-features)
- [Performance Considerations](#performance-considerations)

---

## Overview

KodeBlocks follows a **clean, layered architecture** inspired by Domain-Driven Design (DDD) and Clean Architecture principles, adapted for SvelteKit's conventions.

### Core Principles

1. **Separation of Concerns** - Each layer has a single, well-defined responsibility
2. **Dependency Rule** - Dependencies point inward (Routes → Features → Services → API)
3. **Thin Routes** - Routes are 3-5 lines, delegating to feature pages
4. **Feature-Based Organization** - Code organized by feature, not by type
5. **Testability** - Business logic isolated from framework and UI

---

## Architecture Principles

### 1. Thin Routes (Controller Pattern)

Routes should **ONLY** handle:
- Loading data via services
- Rendering feature page components
- Basic authentication checks

**Why?**
- ✅ Routes stay simple and predictable
- ✅ Business logic is reusable
- ✅ Easier to test
- ✅ Better separation of concerns

### 2. Feature-Based Components

Components are organized by **feature/domain**, not by type.

```
❌ Bad (Type-based):
components/
├── buttons/
├── cards/
├── tables/

✅ Good (Feature-based):
components/
├── common/        # Shared across features
├── dashboard/     # Dashboard-specific
├── leaderboard/   # Leaderboard-specific
```

**Why?**
- ✅ Related code stays together
- ✅ Easier to understand feature boundaries
- ✅ Simpler to refactor or remove features
- ✅ Better code ownership

### 3. Unidirectional Data Flow

```
Routes → Feature Pages → Components → Services → API → Database
                ↓           ↓
              Props      Events
```

Data flows **down** via props, events flow **up**.

---

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (Client)                        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              SvelteKit Frontend                         │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  Routes (Thin - Routing Only)                    │  │  │
│  │  │  • +page.svelte (3-5 lines)                      │  │  │
│  │  │  • +page.server.js (data loading)                │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │                        ↓                                │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  Feature Pages (UI Composition)                  │  │  │
│  │  │  • DashboardPage.svelte                          │  │  │
│  │  │  • LeaderboardPage.svelte                        │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │                        ↓                                │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  Reusable Components                             │  │  │
│  │  │  • StatCard, ProgressBar, ProblemCard           │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                         │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Services (Business Logic)                              │  │
│  │  • getDashboardData()                                   │  │
│  │  • calculateStreak()                                    │  │
│  │  • aggregateLeaderboard()                               │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Data Access Layer                          │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  API Functions (Database Queries)                       │  │
│  │  • getUserById()                                        │  │
│  │  • getProgressForUser()                                 │  │
│  │  • getProblems()                                        │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   Supabase (Backend as a Service)               │
│  ┌───────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  PostgreSQL   │  │  Auth        │  │  Real-time       │   │
│  │  Database     │  │  (OAuth)     │  │  Subscriptions   │   │
│  └───────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

### Complete Directory Tree

```
kodeblocks/
├── src/
│   ├── components/                    # UI Components (Feature-based)
│   │   ├── common/                   # Shared components
│   │   │   ├── Navbar.svelte        # Navigation bar
│   │   │   ├── Footer.svelte        # Page footer
│   │   │   └── DifficultyBadge.svelte # Problem difficulty badge
│   │   │
│   │   ├── dashboard/                # Dashboard-specific
│   │   │   ├── StatCard.svelte      # Statistic display card
│   │   │   └── ProgressBar.svelte   # Progress visualization
│   │   │
│   │   ├── leaderboard/              # Leaderboard-specific
│   │   │   └── LeaderboardTable.svelte # Ranking table
│   │   │
│   │   ├── login/                    # Login-specific
│   │   │   ├── GoogleLoginButton.svelte # OAuth button
│   │   │   └── EmailLoginForm.svelte    # Email/password form
│   │   │
│   │   ├── profile/                  # Profile-specific
│   │   │   └── (future components)
│   │   │
│   │   └── tracks/                   # Tracks-specific
│   │       └── ProblemCard.svelte   # Individual problem card
│   │
│   ├── lib/
│   │   ├── features/                 # Feature Pages (NEW!)
│   │   │   ├── dashboard/
│   │   │   │   └── DashboardPage.svelte    # Dashboard composition
│   │   │   ├── leaderboard/
│   │   │   │   └── LeaderboardPage.svelte  # Leaderboard composition
│   │   │   ├── login/
│   │   │   │   └── LoginPage.svelte        # Login page composition
│   │   │   ├── profile/
│   │   │   │   └── ProfilePage.svelte      # Profile composition
│   │   │   └── tracks/
│   │   │       └── TrackPage.svelte        # Track detail composition
│   │   │
│   │   ├── api/                      # Data Access Layer
│   │   │   ├── problems.js          # Problem CRUD operations
│   │   │   ├── users.js             # User queries
│   │   │   ├── leaderboard.js       # Leaderboard queries
│   │   │   └── progress.js          # Progress tracking queries
│   │   │
│   │   ├── services/                 # Business Logic Layer
│   │   │   ├── dashboard.js         # Dashboard data aggregation
│   │   │   ├── leaderboard.js       # Ranking calculations
│   │   │   ├── profile.js           # Profile data transformations
│   │   │   └── tracks.js            # Track progress logic
│   │   │
│   │   ├── config/                   # Configuration
│   │   │   ├── tracks.js            # Track definitions & metadata
│   │   │   ├── badges.js            # Achievement criteria
│   │   │   └── constants.js         # App-wide constants
│   │   │
│   │   ├── stores.js                 # Svelte stores (user, session)
│   │   ├── supabase.js              # Supabase client configuration
│   │   └── utils.js                 # Utility functions
│   │
│   ├── routes/                       # Routing Layer (THIN!)
│   │   ├── dashboard/
│   │   │   ├── +page.server.js      # Load dashboard data
│   │   │   └── +page.svelte         # Render DashboardPage (5 lines)
│   │   │
│   │   ├── leaderboard/
│   │   │   ├── +page.server.js      # Load leaderboard data
│   │   │   └── +page.svelte         # Render LeaderboardPage (5 lines)
│   │   │
│   │   ├── login/
│   │   │   ├── +page.server.js      # Auth handling
│   │   │   └── +page.svelte         # Render LoginPage (3 lines)
│   │   │
│   │   ├── profile/
│   │   │   ├── +page.server.js      # Load profile data
│   │   │   └── +page.svelte         # Render ProfilePage (5 lines)
│   │   │
│   │   ├── tracks/
│   │   │   └── [trackName]/
│   │   │       ├── +page.server.js  # Load track problems
│   │   │       └── +page.svelte     # Render TrackPage (5 lines)
│   │   │
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── +server.js       # OAuth callback handler
│   │   │
│   │   ├── +layout.server.js        # Root layout data (session)
│   │   ├── +layout.svelte           # Root layout (Navbar, Footer)
│   │   └── +page.svelte             # Landing page
│   │
│   ├── app.css                       # Global styles (Tailwind v4)
│   ├── app.d.ts                      # TypeScript declarations
│   ├── app.html                      # HTML template
│   └── hooks.server.js               # Server hooks (auth middleware)
│
├── static/                           # Static assets
│   ├── robots.txt
│   └── (images, fonts, etc.)
│
├── database/                         # Database files
│   └── schema.sql                   # Supabase schema
│
├── package.json                      # Dependencies
├── svelte.config.js                  # SvelteKit configuration
├── postcss.config.js                 # PostCSS configuration (Tailwind v4)
├── vite.config.js                    # Vite configuration
└── jsconfig.json                     # JavaScript configuration
```

---

## Data Flow

### Request Flow (Server-Side Rendering)

```
1. User navigates to /dashboard
   ↓
2. SvelteKit matches route → routes/dashboard/+page.server.js
   ↓
3. +page.server.js:load()
   • Gets user session from locals
   • Calls getDashboardData(supabase, userId)
   ↓
4. services/dashboard.js:getDashboardData()
   • Calls API functions (getUserById, getProgressForUser, etc.)
   • Performs calculations (streaks, points, aggregations)
   • Transforms data for UI
   • Returns formatted data
   ↓
5. API functions (lib/api/*.js)
   • Execute Supabase queries
   • Return raw database data
   ↓
6. Data returned to +page.server.js
   ↓
7. +page.svelte receives data as prop
   • Renders DashboardPage component
   • Passes data down
   ↓
8. DashboardPage.svelte
   • Composes UI using components
   • Passes specific props to child components
   ↓
9. Components (StatCard, ProgressBar, etc.)
   • Render UI with received props
   • Emit events for user interactions
   ↓
10. HTML sent to browser
```

### Client-Side Interaction Flow

```
1. User clicks "Mark as Complete" on a problem
   ↓
2. ProblemCard component handles click event
   ↓
3. Component calls markProblemComplete(problemId)
   ↓
4. Function makes POST request to API endpoint
   ↓
5. Server updates database via Supabase
   ↓
6. Response triggers UI update
   • SvelteKit invalidates cached data
   • Re-runs load function
   • Re-renders with new data
```

---

## Layer Documentation

### 1. Routes Layer (`src/routes/`)

**Responsibility:** Routing, data loading, page rendering

**Files:**
- `+page.server.js` - Server-side data loading
- `+page.svelte` - Client-side page rendering
- `+layout.server.js` - Layout data loading
- `+layout.svelte` - Layout rendering
- `+server.js` - API endpoints

**Rules:**
- ✅ Must be thin (3-5 lines for .svelte files)
- ✅ Only call service layer functions
- ✅ Only pass data to feature pages
- ❌ NO business logic
- ❌ NO database queries
- ❌ NO data transformations
- ❌ NO complex UI

**Example: `routes/dashboard/+page.server.js`**

```javascript
import { getDashboardData } from '$lib/services/dashboard.js';
import { createSupabaseServerClient } from '$lib/supabase.js';

export const load = async (event) => {
  const { session } = await event.locals.safeGetSession?.() || {};
  const supabase = createSupabaseServerClient(event);
  const userId = session?.user?.id;
  
  if (!userId) {
    throw redirect(303, '/login');
  }
  
  return await getDashboardData(supabase, userId);
};
```

**Example: `routes/dashboard/+page.svelte`**

```svelte
<script>
  import DashboardPage from '$lib/features/dashboard/DashboardPage.svelte';
  export let data;
</script>

<DashboardPage {data} />
```

---

### 2. Feature Pages (`src/lib/features/`)

**Responsibility:** Page composition, UI logic, local state

**Rules:**
- ✅ Compose components into pages
- ✅ Handle page-specific UI logic
- ✅ Manage local component state
- ✅ Handle form submissions
- ❌ NO business logic calculations
- ❌ NO database queries
- ❌ NO service calls (receive data via props)

**Example: `lib/features/dashboard/DashboardPage.svelte`**

```svelte
<script>
  import { Trophy, Code2, Award, Zap } from 'lucide-svelte';
  import StatCard from '$components/dashboard/StatCard.svelte';
  import ProgressBar from '$components/dashboard/ProgressBar.svelte';
  
  export let data;
  
  // Local UI state
  let selectedTrack = null;
</script>

<div class="max-w-7xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8">
    Welcome back, {data.profile?.display_name || 'User'}! 👋
  </h1>
  
  <!-- Stats Grid -->
  <div class="grid grid-cols-4 gap-6 mb-8">
    <StatCard 
      title="Problems Solved" 
      value={data.totalSolved} 
      icon={Code2} 
      iconColor="blue" 
    />
    <StatCard 
      title="Total Points" 
      value={data.totalPoints} 
      icon={Trophy} 
      iconColor="green" 
    />
    <StatCard 
      title="This Week" 
      value={data.currentWeekPoints} 
      icon={Zap} 
      iconColor="yellow" 
    />
    <StatCard 
      title="Streak Weeks" 
      value={data.streakWeeks} 
      icon={Award} 
      iconColor="purple" 
    />
  </div>
  
  <!-- Weekly Progress -->
  <div class="card mb-8">
    <ProgressBar 
      value={data.currentWeekPoints} 
      max={5} 
      label="Weekly Progress" 
    />
    <p class="text-sm text-gray-600 mt-2">
      {#if data.currentWeekPoints >= 5}
        🎉 Great job! You've met your weekly target!
      {:else}
        Keep going! Solve {5 - data.currentWeekPoints} more points worth of problems.
      {/if}
    </p>
  </div>
  
  <!-- Tracks Section -->
  <!-- ... more UI composition ... -->
</div>
```

---

### 3. Components (`src/components/`)

**Responsibility:** Reusable UI elements

**Rules:**
- ✅ Pure presentation
- ✅ Accept props for data
- ✅ Emit events for interactions
- ✅ Reusable across features
- ❌ NO business logic
- ❌ NO database queries
- ❌ NO API calls

**Example: `components/dashboard/StatCard.svelte`**

```svelte
<script>
  export let title;
  export let value;
  export let icon = null;
  export let iconColor = 'blue';
  export let subtitle = '';
</script>

<div class="card p-6">
  <div class="flex items-center justify-between mb-2">
    <span class="text-sm font-medium text-gray-600">{title}</span>
    {#if icon}
      <svelte:component 
        this={icon} 
        class="h-5 w-5 text-{iconColor}-600" 
      />
    {/if}
  </div>
  
  <div class="text-3xl font-bold text-gray-900">
    {value}
  </div>
  
  {#if subtitle}
    <p class="text-sm text-gray-500 mt-1">{subtitle}</p>
  {/if}
</div>
```

---

### 4. Services Layer (`src/lib/services/`)

**Responsibility:** Business logic, calculations, data transformations

**Rules:**
- ✅ Business logic & calculations
- ✅ Data transformations
- ✅ Aggregations
- ✅ Call API layer functions
- ❌ NO direct database queries
- ❌ NO UI rendering

**Example: `lib/services/dashboard.js`**

```javascript
import { getUserById } from '$lib/api/users.js';
import { getProgressForUser } from '$lib/api/progress.js';
import { getProblems } from '$lib/api/problems.js';

/**
 * Aggregate all dashboard data for a user
 * @param {object} supabase - Supabase client
 * @param {string} userId - User ID
 * @returns {Promise<object>} Dashboard data
 */
export async function getDashboardData(supabase, userId) {
  // Fetch raw data from API layer
  const [profile, progress, allProblems] = await Promise.all([
    getUserById(supabase, userId),
    getProgressForUser(supabase, userId),
    getProblems(supabase)
  ]);
  
  // Business logic: Calculate total points
  const totalPoints = progress.reduce((sum, p) => {
    return sum + (p.problems?.points || 0);
  }, 0);
  
  // Business logic: Calculate current week points
  const currentWeekPoints = calculateCurrentWeekPoints(progress);
  
  // Business logic: Calculate streak
  const streakWeeks = calculateStreakWeeks(progress);
  
  // Business logic: Group by track
  const tracks = groupProgressByTrack(progress, allProblems);
  
  return {
    profile,
    totalSolved: progress.length,
    totalPoints,
    currentWeekPoints,
    streakWeeks,
    tracks
  };
}

/**
 * Calculate points earned in current week
 * @param {Array} progress - User's completed problems
 * @returns {number} Points this week
 */
function calculateCurrentWeekPoints(progress) {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay()); // Sunday
  weekStart.setHours(0, 0, 0, 0);
  
  return progress
    .filter(p => new Date(p.completed_at) >= weekStart)
    .reduce((sum, p) => sum + (p.problems?.points || 0), 0);
}

/**
 * Calculate consecutive weekly streak
 * @param {Array} progress - User's completed problems
 * @returns {number} Streak count in weeks
 */
function calculateStreakWeeks(progress) {
  // Group by week
  const weeklyPoints = new Map();
  
  progress.forEach(p => {
    const date = new Date(p.completed_at);
    const weekKey = getWeekKey(date);
    const points = weeklyPoints.get(weekKey) || 0;
    weeklyPoints.set(weekKey, points + (p.problems?.points || 0));
  });
  
  // Count consecutive weeks with 5+ points
  let streak = 0;
  let currentWeek = new Date();
  
  while (true) {
    const weekKey = getWeekKey(currentWeek);
    const points = weeklyPoints.get(weekKey) || 0;
    
    if (points >= 5) {
      streak++;
      currentWeek.setDate(currentWeek.getDate() - 7);
    } else {
      break;
    }
  }
  
  return streak;
}

/**
 * Get week key for grouping (YYYY-Www)
 */
function getWeekKey(date) {
  const year = date.getFullYear();
  const week = getWeekNumber(date);
  return `${year}-W${week.toString().padStart(2, '0')}`;
}

/**
 * Group progress by track with stats
 */
function groupProgressByTrack(progress, allProblems) {
  const trackStats = {};
  
  // Initialize tracks
  const tracks = ['Building Blocks', 'Interview Prep', 'Deep Dive', 'Problem Solving'];
  tracks.forEach(track => {
    const trackProblems = allProblems.filter(p => p.track === track);
    const completed = progress.filter(p => p.problems?.track === track);
    
    trackStats[track] = {
      total: trackProblems.length,
      completed: completed.length
    };
  });
  
  return trackStats;
}
```

---

### 5. API Layer (`src/lib/api/`)

**Responsibility:** Database queries, external API calls

**Rules:**
- ✅ Supabase queries ONLY
- ✅ Raw data retrieval
- ✅ CRUD operations
- ❌ NO business logic
- ❌ NO calculations
- ❌ NO data transformations

**Example: `lib/api/users.js`**

```javascript
/**
 * Get user by ID
 * @param {object} supabase - Supabase client
 * @param {string} id - User ID
 * @returns {Promise<object>} User profile
 */
export async function getUserById(supabase, id) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Get all users for leaderboard
 * @param {object} supabase - Supabase client
 * @returns {Promise<Array>} All users
 */
export async function getAllUsers(supabase) {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, display_name, profile_picture, created_at');
  
  if (error) throw error;
  return data;
}

/**
 * Update user profile
 * @param {object} supabase - Supabase client
 * @param {string} userId - User ID
 * @param {object} updates - Profile updates
 * @returns {Promise<object>} Updated profile
 */
export async function updateUserProfile(supabase, userId, updates) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}
```

**Example: `lib/api/progress.js`**

```javascript
/**
 * Get user's progress (completed problems)
 * @param {object} supabase - Supabase client
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Progress records with problem details
 */
export async function getProgressForUser(supabase, userId) {
  const { data, error } = await supabase
    .from('user_progress')
    .select(`
      id,
      user_id,
      problem_id,
      completed_at,
      problems (
        id,
        title,
        difficulty,
        points,
        track
      )
    `)
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

/**
 * Mark problem as complete
 * @param {object} supabase - Supabase client
 * @param {string} userId - User ID
 * @param {string} problemId - Problem ID
 * @returns {Promise<object>} Progress record
 */
export async function markProblemComplete(supabase, userId, problemId) {
  const { data, error } = await supabase
    .from('user_progress')
    .insert({
      user_id: userId,
      problem_id: problemId,
      completed_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}
```

---

## Database Schema

### Entity-Relationship Diagram

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │──┐
│ email           │  │
│ display_name    │  │
│ profile_picture │  │
│ batch           │  │
│ created_at      │  │
└─────────────────┘  │
                     │
                     │ 1:N
                     │
         ┌───────────┴──────────┐
         │                      │
         ↓                      ↓
┌─────────────────┐    ┌─────────────────┐
│ user_progress   │    │   problems      │
├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │
│ user_id (FK)    │───→│ title           │
│ problem_id (FK) │←───│ difficulty      │
│ completed_at    │    │ points          │
└─────────────────┘    │ track           │
                       │ problem_url     │
                       │ order_index     │
                       └─────────────────┘
```

### Table Definitions

#### `users`
Stores user profiles and authentication data.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  profile_picture TEXT,
  batch TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

**Columns:**
- `id` - Primary key (UUID)
- `email` - User email (unique, from auth)
- `display_name` - Display name for UI
- `profile_picture` - Avatar URL
- `batch` - Student batch/cohort
- `created_at` - Account creation timestamp

---

#### `problems`
Stores DSA problems across all tracks.

```sql
CREATE TABLE problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  points INTEGER NOT NULL CHECK (points > 0),
  track TEXT NOT NULL,
  problem_url TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(track, order_index)
);

-- Indexes
CREATE INDEX idx_problems_track ON problems(track);
CREATE INDEX idx_problems_difficulty ON problems(difficulty);
CREATE INDEX idx_problems_order ON problems(track, order_index);
```

**Columns:**
- `id` - Primary key (UUID)
- `title` - Problem name
- `difficulty` - Easy (1pt), Medium (2pts), Hard (3pts)
- `points` - Points awarded for completion
- `track` - Track name (Building Blocks, Interview Prep, Deep Dive, Problem Solving)
- `problem_url` - External link (LeetCode, etc.)
- `order_index` - Display order within track
- `created_at` - Problem creation timestamp

---

#### `user_progress`
Tracks which problems each user has completed.

```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, problem_id)
);

-- Indexes
CREATE INDEX idx_progress_user ON user_progress(user_id);
CREATE INDEX idx_progress_completed ON user_progress(completed_at);
CREATE INDEX idx_progress_user_completed ON user_progress(user_id, completed_at);
```

**Columns:**
- `id` - Primary key (UUID)
- `user_id` - Foreign key to users
- `problem_id` - Foreign key to problems
- `completed_at` - Completion timestamp

**Constraints:**
- Unique constraint on (user_id, problem_id) - can't complete same problem twice
- Cascade delete - if user deleted, delete their progress

---

### Common Queries

**Get user's total points:**
```sql
SELECT 
  u.id,
  u.display_name,
  COALESCE(SUM(p.points), 0) as total_points
FROM users u
LEFT JOIN user_progress up ON u.id = up.user_id
LEFT JOIN problems p ON up.problem_id = p.id
GROUP BY u.id, u.display_name
ORDER BY total_points DESC;
```

**Get weekly leaderboard:**
```sql
SELECT 
  u.id,
  u.display_name,
  COALESCE(SUM(p.points), 0) as week_points
FROM users u
LEFT JOIN user_progress up ON u.id = up.user_id AND up.completed_at >= date_trunc('week', NOW())
LEFT JOIN problems p ON up.problem_id = p.id
GROUP BY u.id, u.display_name
ORDER BY week_points DESC
LIMIT 50;
```

**Get user's progress by track:**
```sql
SELECT 
  p.track,
  COUNT(DISTINCT up.problem_id) as completed,
  COUNT(DISTINCT p.id) as total
FROM problems p
LEFT JOIN user_progress up ON p.id = up.problem_id AND up.user_id = $1
GROUP BY p.track;
```

---

## Authentication Flow

### OAuth Flow (Google)

```
1. User clicks "Sign in with Google"
   ↓
2. Frontend redirects to Supabase Auth
   • URL: supabase.auth.signInWithOAuth({ provider: 'google' })
   ↓
3. User authenticates with Google
   ↓
4. Google redirects to Supabase
   ↓
5. Supabase creates/updates user
   • Creates entry in auth.users
   • Triggers database function to create public.users record
   ↓
6. Supabase redirects to /auth/callback
   ↓
7. Callback handler (routes/auth/callback/+server.js)
   • Exchanges code for session
   • Sets cookies
   • Redirects to /dashboard
   ↓
8. Dashboard loads with authenticated session
```

### Session Management

**Server-Side (hooks.server.js):**
```javascript
export const handle = async ({ event, resolve }) => {
  event.locals.supabase = createSupabaseServerClient(event);
  
  event.locals.safeGetSession = async () => {
    const { data: { session } } = await event.locals.supabase.auth.getSession();
    return { session, user: session?.user ?? null };
  };
  
  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range';
    }
  });
};
```

**Client-Side (+layout.svelte):**
```javascript
onMount(() => {
  const { data } = supabase.auth.onAuthStateChange((event, _session) => {
    invalidate('supabase:auth');
  });
  
  return () => data.subscription.unsubscribe();
});
```

---

## Styling with Tailwind CSS v4

KodeBlocks uses **Tailwind CSS v4** with the modern `@theme` approach (no `tailwind.config.js`).

### Custom Theme Configuration

All custom colors and theme variables are defined in `src/app.css`:

```css
@import 'tailwindcss';

@theme {
  /* Primary brand colors */
  --color-primary-50: #F0F7FF;
  --color-primary-100: #E0EFFF;
  --color-primary-200: #C0DFFF;
  --color-primary-300: #A0CFFF;
  --color-primary-400: #60AFFF;
  --color-primary-500: #208FFF;
  --color-primary-600: #0077EE;
  --color-primary-700: #0066CC;
  --color-primary-800: #0055AA;
  --color-primary-900: #004488;
  --color-primary-950: #003366;
  
  /* Semantic colors */
  --color-success-100: #F0FFF6;
  --color-success-700: #00AA55;
  
  --color-warning-100: #FFFBEB;
  --color-warning-700: #B45309;
  
  --color-danger-100: #FEF2F2;
  --color-danger-700: #B91C1C;
}
```

### Usage in Components

Use custom colors just like built-in Tailwind colors:

```svelte
<!-- Primary brand color -->
<button class="bg-primary-600 text-white hover:bg-primary-700">
  Click me
</button>

<!-- Semantic colors -->
<div class="bg-success-100 text-success-700">Success message</div>
<div class="bg-warning-100 text-warning-700">Warning message</div>
<div class="bg-danger-100 text-danger-700">Error message</div>
```

### Utility Classes

Global utility classes are defined in `app.css`:

```css
/* Card component */
.card {
  @apply p-5 md:p-6 bg-white border border-gray-200 rounded-xl shadow-sm;
}

/* Difficulty badges */
.badge-easy {
  @apply inline-flex px-3 py-1 text-xs font-medium rounded-full 
         bg-success-100 text-success-700;
}

.badge-medium {
  @apply inline-flex px-3 py-1 text-xs font-medium rounded-full 
         bg-warning-100 text-warning-700;
}

.badge-hard {
  @apply inline-flex px-3 py-1 text-xs font-medium rounded-full 
         bg-danger-100 text-danger-700;
}
```

**Why Tailwind v4?**
- ✅ No config file needed - everything in CSS
- ✅ Faster build times with new engine
- ✅ Better TypeScript support
- ✅ CSS-native approach
- ✅ Easier to understand and maintain

---

## State Management

### Global State (Svelte Stores)

**Location:** `src/lib/stores.js`

```javascript
import { writable } from 'svelte/store';

// User session
export const session = writable(null);

// User profile
export const user = writable(null);
```

**Usage in +layout.svelte:**
```javascript
import { session, user } from '$lib/stores.js';

// Update stores when data changes
$: session.set(data.session);
$: user.set(data.user);
```

**Usage in components:**
```svelte
<script>
  import { user } from '$lib/stores.js';
</script>

{#if $user}
  <p>Welcome, {$user.display_name}!</p>
{/if}
```

### Local State

Use regular Svelte reactive variables within components:

```svelte
<script>
  let count = 0;
  let showModal = false;
  
  function increment() {
    count += 1;
  }
</script>

<button on:click={increment}>
  Clicked {count} times
</button>
```

---

## Design Patterns

### 1. Service Pattern

All business logic goes in service functions:

```javascript
// ✅ Good
export async function getDashboardData(supabase, userId) {
  const data = await fetchData(supabase, userId);
  return calculateStats(data);
}

// ❌ Bad (business logic in route)
export const load = async ({ locals }) => {
  const data = await supabase.from('users').select();
  const stats = data.reduce(...); // NO! This belongs in service
  return stats;
};
```

### 2. Repository Pattern (API Layer)

All database queries in dedicated functions:

```javascript
// ✅ Good (lib/api/users.js)
export async function getUserById(supabase, id) {
  return await supabase.from('users').select('*').eq('id', id).single();
}

// ❌ Bad (query directly in service)
export async function getDashboardData(supabase, userId) {
  const user = await supabase.from('users').select('*')...
}
```

### 3. Component Composition

Build complex UIs from simple components:

```svelte
<!-- ✅ Good -->
<DashboardPage {data}>
  <StatsGrid>
    <StatCard {...stat1} />
    <StatCard {...stat2} />
  </StatsGrid>
  <ProgressSection>
    <ProgressBar {value} {max} />
  </ProgressSection>
</DashboardPage>

<!-- ❌ Bad (monolithic component) -->
<div>
  <!-- 500 lines of HTML in one component -->
</div>
```

### 4. Dependency Injection

Pass dependencies (like Supabase client) as parameters:

```javascript
// ✅ Good
export async function getUserData(supabase, userId) {
  return await getUserById(supabase, userId);
}

// ❌ Bad (tight coupling)
import { supabase } from './supabase.js';
export async function getUserData(userId) {
  return await supabase.from('users')...
}
```

---

## Adding New Features

### Step-by-Step Guide

**Example: Adding a "Study Groups" feature**

#### 1. Database Schema
```sql
-- Add table
CREATE TABLE study_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE study_group_members (
  group_id UUID REFERENCES study_groups(id),
  user_id UUID REFERENCES users(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (group_id, user_id)
);
```

#### 2. API Layer (`lib/api/study-groups.js`)
```javascript
export async function getStudyGroups(supabase) {
  const { data, error } = await supabase
    .from('study_groups')
    .select('*');
  if (error) throw error;
  return data;
}

export async function createStudyGroup(supabase, groupData) {
  const { data, error } = await supabase
    .from('study_groups')
    .insert(groupData)
    .select()
    .single();
  if (error) throw error;
  return data;
}
```

#### 3. Service Layer (`lib/services/study-groups.js`)
```javascript
import { getStudyGroups, getGroupMembers } from '$lib/api/study-groups.js';

export async function getStudyGroupsData(supabase, userId) {
  const groups = await getStudyGroups(supabase);
  
  // Business logic: Enrich with member counts
  const enrichedGroups = await Promise.all(
    groups.map(async (group) => {
      const members = await getGroupMembers(supabase, group.id);
      return {
        ...group,
        memberCount: members.length,
        isUserMember: members.some(m => m.user_id === userId)
      };
    })
  );
  
  return enrichedGroups;
}
```

#### 4. Components (`components/study-groups/`)
```
components/study-groups/
├── StudyGroupCard.svelte
├── CreateGroupModal.svelte
└── MemberList.svelte
```

#### 5. Feature Page (`lib/features/study-groups/StudyGroupsPage.svelte`)
```svelte
<script>
  import StudyGroupCard from '$components/study-groups/StudyGroupCard.svelte';
  export let data;
</script>

<div class="max-w-7xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">Study Groups</h1>
  
  <div class="grid grid-cols-3 gap-6">
    {#each data.groups as group}
      <StudyGroupCard {group} />
    {/each}
  </div>
</div>
```

#### 6. Route (`routes/study-groups/`)
```javascript
// +page.server.js
import { getStudyGroupsData } from '$lib/services/study-groups.js';

export const load = async ({ locals }) => {
  const { session } = await locals.safeGetSession();
  return await getStudyGroupsData(locals.supabase, session.user.id);
};
```

```svelte
<!-- +page.svelte -->
<script>
  import StudyGroupsPage from '$lib/features/study-groups/StudyGroupsPage.svelte';
  export let data;
</script>

<StudyGroupsPage {data} />
```

---

## Performance Considerations

### 1. Database Queries

**Use Select Specific Columns:**
```javascript
// ✅ Good
.select('id, email, display_name')

// ❌ Bad
.select('*')
```

**Use Indexes:**
```sql
CREATE INDEX idx_progress_user_completed 
ON user_progress(user_id, completed_at);
```

**Batch Queries:**
```javascript
// ✅ Good (parallel)
const [users, problems, progress] = await Promise.all([
  getUsers(supabase),
  getProblems(supabase),
  getProgress(supabase)
]);

// ❌ Bad (sequential)
const users = await getUsers(supabase);
const problems = await getProblems(supabase);
const progress = await getProgress(supabase);
```

### 2. Component Optimization

**Lazy Loading:**
```svelte
<script>
  import { onMount } from 'svelte';
  
  let HeavyComponent;
  
  onMount(async () => {
    HeavyComponent = (await import('./HeavyComponent.svelte')).default;
  });
</script>

{#if HeavyComponent}
  <svelte:component this={HeavyComponent} />
{/if}
```

**Virtual Lists:**
For large lists (100+ items), use virtual scrolling.

### 3. Caching

SvelteKit automatically caches page data. Invalidate when needed:

```javascript
import { invalidate } from '$app/navigation';

async function markComplete() {
  await markProblemComplete(...);
  await invalidate('app:dashboard'); // Re-fetch dashboard data
}
```

---

## Development Guidelines

### Code Style

- Use **Prettier** for formatting
- Use **ESLint** for linting
- Follow **Conventional Commits** for commit messages
- Write descriptive variable names
- Add JSDoc comments to functions

### Testing

**Unit Tests (Services & API):**
```javascript
import { describe, it, expect } from 'vitest';
import { calculateStreakWeeks } from '$lib/services/dashboard.js';

describe('calculateStreakWeeks', () => {
  it('should calculate streak correctly', () => {
    const progress = [/* test data */];
    expect(calculateStreakWeeks(progress)).toBe(3);
  });
});
```

**Integration Tests (Routes):**
```javascript
import { test, expect } from '@playwright/test';

test('dashboard loads correctly', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.locator('h1')).toContainText('Welcome back');
});
```

---

## Troubleshooting

### Common Issues

**1. Supabase Client Not Working**
- Check environment variables
- Verify Supabase project is active
- Check Row Level Security (RLS) policies

**2. Data Not Loading**
- Check network tab for errors
- Verify API layer functions return data
- Check service layer transformations

**3. Components Not Rendering**
- Verify props are passed correctly
- Check for reactive statements ($:)
- Inspect browser console for errors

---

## Future Enhancements

### Planned Features
- **Real-time Updates** - Supabase subscriptions for live leaderboard
- **Discussions** - Problem discussion threads
- **Code Submissions** - Submit solutions for review
- **Analytics** - Detailed progress analytics
- **Mobile App** - React Native or Flutter

### Technical Improvements
- **Testing** - Comprehensive test suite
- **CI/CD** - Automated testing and deployment
- **Monitoring** - Error tracking (Sentry)
- **Performance** - Server-side caching (Redis)

---

## Resources

- [SvelteKit Docs](https://kit.svelte.dev/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

<p align="center">
  <strong>Questions? Check <a href="CONTRIBUTING.md">CONTRIBUTING.md</a> or open a discussion!</strong>
</p>

<p align="center">
  <a href="#-kodeblocks-architecture">Back to Top ↑</a>
</p>
