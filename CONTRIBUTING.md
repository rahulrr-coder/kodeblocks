# 🤝 Contributing to KodeBlocks

First off, **thank you** for considering contributing! We're excited to build this platform with you. This is a project by students, for students, and every contribution makes a difference.

Before you start, please read our [README.md](README.md) to get an overview of the project, its philosophy, and how to set it up locally.

---

## 📋 Table of Contents

- [How to Contribute](#-how-to-contribute)
- [Contribution Workflow](#-contribution-workflow)
- [Branching Strategy](#-branching-strategy)
- [Commit Message Convention](#-commit-message-convention)
- [Architecture & Code Style](#-architecture--code-style)
- [Testing Guidelines](#-testing-guidelines)
- [Code of Conduct](#-code-of-conduct)

---

## 🎯 How to Contribute

We welcome all types of contributions, including:

- ✨ **Adding new features**
- 🐛 **Fixing bugs**
- 📚 **Improving documentation**
- 💡 **Submitting new problem ideas**
- ♻️ **Refactoring code**
- 🎨 **Improving UI/UX**
- 🧪 **Writing tests**

If you're not sure where to start, check out the [Issues](https://github.com/rahulrr-coder/kodeblocks/issues) tab for `good first issue` or `help wanted` labels.

---

## 📝 Contribution Workflow

### 1. Find or Create an Issue
All work should be tied to an issue. If you have a new idea or bug fix, please [create an issue](https://github.com/rahulrr-coder/kodeblocks/issues/new) first to discuss it with the team.

### 2. Fork the Repository
Create a fork of this repo to your own GitHub account.

```bash
# Click the "Fork" button on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/kodeblocks.git
cd kodeblocks
```

### 3. Create a Branch
Create a new branch from `main` on your fork. Please use our [branching conventions](#-branching-strategy).

```bash
git checkout -b feat/your-feature-name
```

### 4. Make Your Changes
Write your code, following our [architecture](#-architecture--code-style) and code style guidelines.

```bash
# Install dependencies
bun install

# Start development server
bun run dev
```

### 5. Commit Your Changes
Commit your work with clear, descriptive messages using our [commit conventions](#-commit-message-convention).

```bash
git add .
git commit -m "feat(dashboard): add weekly progress chart"
```

### 6. Push to Your Fork
Push your branch to your forked repository.

```bash
git push origin feat/your-feature-name
```

### 7. Open a Pull Request
Open a Pull Request (PR) from your branch to the `main` branch of the original kodeblocks repository.

**In your PR description:**
- Link the issue you are solving (e.g., "Closes #123")
- Provide a clear description of the changes
- Include any testing you've done
- Add screenshots/videos if UI changes are involved

---

## 🌿 Branching Strategy

We use a simple branching model where `main` is our stable branch. All work is done on feature branches.

### Branch Naming Convention

Please name your branches using the following prefixes, separated by a `/`:

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feat/` | New features | `feat/add-password-reset` |
| `fix/` | Bug fixes | `fix/profile-avatar-not-loading` |
| `docs/` | Documentation changes | `docs/update-readme` |
| `refactor/` | Code refactoring | `refactor/move-auth-service` |
| `chore/` | Build/package updates | `chore/update-sveltekit` |
| `style/` | UI/styling changes | `style/improve-button-colors` |
| `test/` | Adding/updating tests | `test/add-dashboard-tests` |

### Examples

```bash
feat/add-google-oauth
fix/leaderboard-sorting
docs/contributing-guide
refactor/extract-leaderboard-service
chore/upgrade-tailwind-v4
```

---

## 💬 Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) to keep our commit history clean and readable. This helps automate release notes and makes it easy to see what changed.

### Format

```
type(scope): subject

[optional body]

[optional footer]
```

### Type

Must be one of the following:

| Type | Description |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `style` | Changes that don't affect code meaning (formatting, whitespace) |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvements |
| `test` | Adding or correcting tests |
| `chore` | Build process or tooling changes |

### Scope (Optional)

The part of the app you're changing:

`dashboard`, `auth`, `tracks`, `profile`, `leaderboard`, `api`, `deps`, etc.

### Subject

A short, imperative description of the change (lowercase, no period).

### Examples

```bash
feat(auth): implement email/password login
fix(dashboard): correct stat card percentage calculation
docs(readme): add setup instructions
refactor(api): move user queries to separate function
chore(deps): update sveltekit to 2.x
perf(leaderboard): optimize ranking calculation
style(button): update primary button colors
test(profile): add unit tests for badge logic
```

### Full Example with Body

```
feat(tracks): add problem filtering by difficulty

Implemented a new filter component that allows users to filter
problems by Easy, Medium, or Hard difficulty levels.

Closes #45
```

---

## 🏗️ Architecture & Code Style

To keep the project maintainable, we follow a **strict layered architecture**. Your PR will not be merged if it violates these rules.

### The Golden Rule: Keep Routes Thin! 🎯

Routes should be **3-5 lines maximum**. All logic goes in feature pages and services.

### Architecture Layers

```
Routes (Thin)
    ↓
Feature Pages (UI Composition)
    ↓
Components (Reusable UI)
    ↓
Services (Business Logic)
    ↓
API (Database Queries)
```

---

### 1. Routes Layer (`src/routes/`)

**Purpose:** Routing only - load data and render feature pages.

**Rules:**
- ✅ Import feature page component
- ✅ Pass data to component
- ❌ NO business logic
- ❌ NO UI code (beyond rendering the feature page)
- ❌ NO direct database queries

**Example: `routes/dashboard/+page.svelte`**

```svelte
<script>
  import DashboardPage from '$lib/features/dashboard/DashboardPage.svelte';
  export let data;
</script>

<DashboardPage {data} />
```

**Example: `routes/dashboard/+page.server.js`**

```javascript
import { getDashboardData } from '$lib/services/dashboard.js';
import { createSupabaseServerClient } from '$lib/supabase.js';

export const load = async (event) => {
  const { session } = await event.locals.safeGetSession?.() || {};
  const supabase = createSupabaseServerClient(event);
  const userId = session?.user?.id;
  
  return await getDashboardData(supabase, userId);
};
```

---

### 2. Feature Pages (`src/lib/features/`)

**Purpose:** Page-specific composition and layout.

**Rules:**
- ✅ Assemble components
- ✅ Handle page-specific UI logic
- ✅ Manage local state
- ❌ NO business logic calculations
- ❌ NO database queries

**Example: `lib/features/dashboard/DashboardPage.svelte`**

```svelte
<script>
  import StatCard from '$components/dashboard/StatCard.svelte';
  import ProgressBar from '$components/dashboard/ProgressBar.svelte';
  export let data;
</script>

<div class="max-w-7xl mx-auto px-4 py-8">
  <h1>Welcome back, {data.profile?.display_name}! 👋</h1>
  
  <div class="grid grid-cols-4 gap-6">
    <StatCard title="Problems Solved" value={data.totalSolved} />
    <StatCard title="Total Points" value={data.totalPoints} />
  </div>
  
  <ProgressBar value={data.weeklyProgress} max={5} />
</div>
```

---

### 3. Components (`src/components/`)

**Purpose:** Reusable UI components.

**Rules:**
- ✅ Pure presentation
- ✅ Accept props
- ✅ Emit events
- ❌ NO business logic
- ❌ NO database queries
- ❌ NO service calls

**Organization:**

```
components/
├── common/          # Shared across multiple pages
│   ├── Navbar.svelte
│   ├── Footer.svelte
│   └── DifficultyBadge.svelte
├── dashboard/       # Dashboard-specific
│   ├── StatCard.svelte
│   └── ProgressBar.svelte
├── leaderboard/     # Leaderboard-specific
│   └── LeaderboardTable.svelte
└── tracks/          # Tracks-specific
    └── ProblemCard.svelte
```

**Example: `components/dashboard/StatCard.svelte`**

```svelte
<script>
  export let title;
  export let value;
  export let icon = null;
</script>

<div class="card">
  {#if icon}
    <svelte:component this={icon} class="h-6 w-6" />
  {/if}
  <h3>{title}</h3>
  <p class="text-3xl font-bold">{value}</p>
</div>
```

---

### 4. Services Layer (`src/lib/services/`)

**Purpose:** Business logic, calculations, and data transformations.

**Rules:**
- ✅ Business logic and calculations
- ✅ Data transformations
- ✅ Call API layer functions
- ❌ NO direct database queries
- ❌ NO UI code

**Example: `lib/services/dashboard.js`**

```javascript
import { getUserById, getProgressForUser } from '$lib/api/users.js';

export async function getDashboardData(supabase, userId) {
  // Fetch raw data from API layer
  const profile = await getUserById(supabase, userId);
  const progress = await getProgressForUser(supabase, userId);
  
  // Business logic: calculate total points
  const totalPoints = progress.reduce((sum, p) => sum + p.problems.points, 0);
  
  // Business logic: calculate streak
  const streakWeeks = calculateStreak(progress);
  
  return {
    profile,
    totalPoints,
    streakWeeks,
    totalSolved: progress.length
  };
}

function calculateStreak(progress) {
  // Complex streak calculation logic
  // ...
}
```

---

### 5. API Layer (`src/lib/api/`)

**Purpose:** Database queries only.

**Rules:**
- ✅ Supabase queries
- ✅ External API calls
- ❌ NO business logic
- ❌ NO calculations
- ❌ NO data transformations

**Example: `lib/api/users.js`**

```javascript
export async function getUserById(supabase, id) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function getProgressForUser(supabase, userId) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*, problems(*)')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });
  
  if (error) throw error;
  return data;
}
```

---

### Styling Guidelines

- ✅ Use **Tailwind CSS** utility classes
- ✅ Follow existing color scheme (primary, success, warning, danger)
- ✅ Use existing components from `components/common/`
- ✅ Make responsive (mobile-first)
- ❌ NO inline styles (except dynamic values)
- ❌ NO custom CSS files (use `app.css` for global styles only)

**Good:**
```svelte
<div class="card p-6 hover:shadow-lg transition-shadow">
  <h2 class="text-2xl font-bold text-gray-900">Title</h2>
</div>
```

**Bad:**
```svelte
<div style="padding: 24px; background: white;">
  <h2 style="font-size: 24px;">Title</h2>
</div>
```

---

## 🧪 Testing Guidelines

### Before Submitting a PR

1. **Test locally** - Run `bun run dev` and test your changes
2. **Check for errors** - No console errors or warnings
3. **Test edge cases** - Empty states, loading states, error states
4. **Mobile responsive** - Test on mobile viewport
5. **Cross-browser** - Test in Chrome, Firefox, Safari if possible

### Writing Tests (Coming Soon)

We're working on adding a comprehensive test suite. Stay tuned!

---

## 📜 Code of Conduct

We are committed to a welcoming and inclusive environment. Please follow the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

### Our Standards

- ✅ Be respectful and kind
- ✅ Be constructive in feedback
- ✅ Welcome newcomers
- ✅ Focus on what's best for the community
- ❌ No harassment or trolling
- ❌ No spam or self-promotion

---

## 🎉 Recognition

All contributors will be recognized in our README and release notes. Thank you for helping us build KodeBlocks!

---

## 📬 Questions?

- **Issues:** [GitHub Issues](https://github.com/rahulrr-coder/kodeblocks/issues)
- **Discussions:** [GitHub Discussions](https://github.com/rahulrr-coder/kodeblocks/discussions)

---

<p align="center">
  <strong>Thank you for contributing to KodeBlocks! 🚀</strong>
</p>

<p align="center">
  <a href="#-contributing-to-kodeblocks">Back to Top ↑</a>
</p>