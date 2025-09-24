# 🌌 CyberSwiftie 2077

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

> **A futuristic, real-time social platform for Swifties — where Taylor’s eras meet cyberpunk.**

---

## ✨ Features

- **Era-Based Real-Time Chat:** Public chat rooms for every Taylor Swift album, plus private DMs.
- **Supabase-Powered Backend:** Authentication, PostgreSQL database, and live subscriptions.
- **Friendship System:** Send, accept, and manage friend requests.
- **Custom Profiles:** Avatars, bios, favorite albums, and social links.
- **Live Notifications:** Instantly see friend requests and more.
- **Immersive UI:** Neon cyberpunk vibes, custom fonts, and smooth animations.
- **Modern Stack:** Next.js 15 App Router, React, Tailwind CSS, TypeScript.

---

## 🏗️ Architecture Overview

### Frontend

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + PostCSS
- **Components:** Modular, with clear separation between Server and Client components
- **State:** React hooks (`useState`, `useEffect`, custom hooks like `useRealtimeChat`)
- **UI Library:** Inspired by [shadcn/ui](https://ui.shadcn.com/)

### Backend & Database

- **BaaS:** Supabase (Auth, Database, Storage, Realtime)
- **Authentication:** Supabase Auth, managed with `@supabase/ssr`
- **Database:** PostgreSQL with strict Row Level Security (RLS)
- **RPC Functions:** For advanced queries (e.g., user search with friendship status)
- **Triggers & ENUMs:** For profile creation and relationship management

---

## 🔄 How Real-Time Chat Works

1. **User types a message** in a chat room (e.g., `public.reputation`).
2. **`useRealtimeChat` hook** sends the message to Supabase via RPC.
3. **Supabase broadcasts** the new message to all connected clients.
4. **UI updates instantly** for everyone in the room.

---

## 🗄️ Database Schema Highlights

- **`profiles`**: Public user data, linked to `auth.users`
- **`direct_messages`**: Private DMs
- **`friendships`**: All friend relationships (`pending`, `accepted`, `blocked`)
- **`notifications`**: User notifications (e.g., friend requests)
- **Album Tables**: Each album (e.g., `public.1989`) has its own chat table

> **Security:** Every table is protected by RLS. Users can only access their own data.

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js v20+
- npm (or compatible package manager)

### 2. Environment Setup

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Get these from your Supabase dashboard (**Project Settings > API**).

### 3. Install & Run

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to explore CyberSwiftie 2077.

---

## 🛠️ Scripts

| Command         | Description                          |
|-----------------|--------------------------------------|
| `npm run dev`   | Start development server (Turbopack) |
| `npm run build` | Build for production                 |
| `npm run start` | Run production server                |
| `npm run lint`  | Lint code with ESLint                |

---

## 🧩 Project Structure & Conventions

- **Components:** `src/components/` (reusable, composable, shadcn/ui style)
- **Types:** `src/types/index.ts`
- **Supabase Helpers:** `src/lib/supabase/`, `src/utils/supabase/`
- **Styling:** Tailwind CSS utility classes in `.tsx` files
- **Linting:** ESLint with Next.js rules

---

## 💡 Inspiration

CyberSwiftie 2077 is a love letter to both Taylor Swift’s eras and the neon-lit worlds of cyberpunk.  
Connect, chat, and vibe with fellow Swifties — in style.

---

**Ready to join the cyber era?**  
_Clone, run, and become a CyberSwiftie!_