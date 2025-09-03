# GEMINI.md

## Project Overview

This is a Next.js web application that serves as a Taylor Swift fan site with a cyberpunk theme, named "CYBERSWIFTIE2077". The application is built with a modern tech stack, including Next.js for the frontend, Supabase for the backend (authentication and database), and Tailwind CSS for styling. It features a visually rich and interactive user experience with animations and custom themes.

### Key Technologies

*   **Framework:** Next.js
*   **Language:** TypeScript
*   **Backend:** Supabase
*   **Styling:** Tailwind CSS, Framer Motion
*   **Linting:** ESLint

### Architecture

The project follows a standard Next.js `app` directory structure.
*   `src/app`: Contains the application's pages and layouts.
*   `src/components`: Houses reusable React components.
*   `src/lib/supabase`: Manages the Supabase client and server-side logic.
*   `src/middleware.ts`: Implements request middleware for route protection.
*   `public`: Stores static assets like images and fonts.

## Building and Running

### Prerequisites

*   Node.js
*   npm (or yarn/pnpm/bun)

### Installation

```bash
npm install
```

### Development

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production

To build the application for production:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

### Linting

To run the linter:

```bash
npm run lint
```

## Development Conventions

*   **Styling:** The project uses Tailwind CSS for styling. Custom styles, including neon and glow effects, are defined in `src/app/page.tsx`.
*   **Components:** Reusable components are located in the `src/components` directory.
*   **Authentication:** Authentication is handled by Supabase. The `/dashboard` route is protected and requires a logged-in user.
*   **Environment Variables:** The application requires Supabase environment variables to be set up for the client and server. These include `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY`.
