# Summary Judgment Enforcement Dashboard

A production-ready Next.js 14+ dashboard for managing enforcement of a Florida default final judgment ($2,378,443.28) against Management Services Holdings, LLC (MSH) with actions across FL/TN/IN/CO jurisdictions.

![Dashboard Preview](https://img.shields.io/badge/Next.js-14-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)

## Features

- **📊 Overview Dashboard** - Hero section with judgment details, "Next 3 Moves" priority cards, and jurisdiction enforcement grid
- **🏛️ Enforcement Tracking** - Monitor progress across FL, TN, IN, and CO with detailed jurisdiction cards
- **✅ Kanban Task Board** - Drag-and-drop task management with status columns (Backlog → Done)
- **📁 File Browser** - 2-pane layout with autosaving notes editor and linked task display
- **📧 Email Log** - Track correspondence with filtering, search, and detail drawer
- **🔍 Global Search** - `⌘K` to search across tasks, files, and emails
- **💾 Local Persistence** - All data stored in localStorage with automatic seed data

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Fonts:** Inter, JetBrains Mono
- **State:** localStorage with custom React hooks

## Project Structure

```
├── app/
│   ├── page.tsx          # Overview dashboard
│   ├── enforcement/      # Jurisdiction tracking
│   ├── tasks/            # Kanban board
│   ├── files/            # File browser
│   └── emails/           # Email log
├── components/
│   ├── ui/               # Reusable UI components
│   └── ClientLayout.tsx  # App shell with search
├── lib/
│   ├── types.ts          # TypeScript interfaces
│   ├── seed-data.ts      # Initial data
│   └── hooks/            # Custom React hooks
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `⌘K` | Open global search |
| `Esc` | Close modals/search |
| `N` | New task (on Tasks page) |

## Customization

### Adding New Jurisdictions

1. Update the `Jurisdiction` type in `lib/types.ts`
2. Add color configuration in `JurisdictionBadge.tsx`
3. Update filter options in relevant pages

### Modifying Seed Data

Edit `lib/seed-data.ts` to customize the initial parties, files, tasks, and emails. Data will be seeded on first visit.

### Clearing Data

Open browser DevTools → Application → Local Storage → Clear `sjed-app-data`

## Deployment

This project is configured for Vercel deployment:

```bash
# Using Vercel CLI
vercel

# Or push to GitHub and connect via Vercel dashboard
```

## License

MIT
