# Summary Judgment Enforcement Dashboard PRO

A production-ready Next.js 14+ dashboard for managing enforcement of a Florida default final judgment ($2,378,443.28) against Management Services Holdings, LLC (MSH) with actions across FL/TN/IN/CO jurisdictions.

![Dashboard Preview](https://img.shields.io/badge/Next.js-14-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)

## ✨ Features

### Core Dashboard
- **📊 Overview** - Hero with judgment details, metrics row, "Next 5 Priority Actions", jurisdiction grid
- **🏛️ Enforcement** - Track progress across FL, TN, IN, CO with detailed jurisdiction cards
- **✅ Tasks** - Kanban board with drag-drop, counsel assignment, category filtering
- **📁 Files** - Grid/list view, full-text search, autosave notes, drag-drop upload UI
- **📧 Emails** - Filterable log table with detail drawer

### New PRO Features
- **👥 Counsel Directory** - Manage attorneys/vendors, assign tasks, view email history
- **💰 Settlement Tracker** - Log offers, auto-calculate interest, CSV export
- **📈 Reports** - Executive summary, CSV exports for tasks/counsel/settlements
- **🔍 Global Search** - `⌘K` to search tasks, files, emails, counsel with quick actions
- **🌙 Dark Mode** - Toggle via header button
- **📱 PWA Ready** - Add to Home Screen on mobile

### Technical Features
- **localStorage Persistence** - All data stored locally with seed data
- **Auto-Interest Calculator** - 10% FL statutory rate
- **Responsive Design** - Desktop → Tablet → Mobile
- **Keyboard Shortcuts** - `⌘K` search, `N` new task, `Esc` close

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## 📁 Project Structure

```
├── app/
│   ├── page.tsx          # Overview dashboard
│   ├── enforcement/      # Jurisdiction tracking
│   ├── tasks/            # Kanban board
│   ├── files/            # File browser
│   ├── counsel/          # Counsel directory (NEW)
│   ├── settle/           # Settlement tracker (NEW)
│   ├── reports/          # Reports & exports (NEW)
│   └── emails/           # Email log
├── components/
│   ├── ui/               # Reusable UI components
│   └── ClientLayout.tsx  # App shell with search
├── lib/
│   ├── types.ts          # TypeScript interfaces
│   ├── seed-data.ts      # Initial data
│   └── hooks/            # Custom React hooks
└── public/
    └── manifest.json     # PWA manifest
```

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `⌘K` | Open global search / command palette |
| `N` | New task (via search) |
| `U` | Upload files (via search) |
| `C` | New counsel (via search) |
| `S` | Log settlement (via search) |
| `Esc` | Close modals/search |

## 🎨 Customization

### Adding Jurisdictions
1. Update `Jurisdiction` type in `lib/types.ts`
2. Add colors in `JurisdictionBadge.tsx`
3. Update filter options in pages

### Modifying Case Configuration
Edit `seedCaseConfig` in `lib/seed-data.ts`:
```typescript
export const seedCaseConfig: CaseConfig = {
  judgmentAmount: 2378443.28,
  judgmentDate: '2025-11-25',
  interestRate: 10,
  floorAmount: 1800000,
  caseNumber: '05-2024-CA-050807'
};
```

### Clearing Data
Open browser DevTools → Application → Local Storage → Clear `sjed-app-data`

## 📊 Reports & Exports

- **Tasks Export** - CSV with status, deadlines, assignments
- **Counsel Export** - CSV with directory info
- **Settlement History** - CSV with offers and status
- **Client Status Report** - Printable executive summary

## 🔧 Environment Variables (Optional)

For file upload functionality:
```
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## 📱 Mobile / PWA

Install as app on iOS/Android:
1. Open dashboard URL in Safari/Chrome
2. Tap Share → "Add to Home Screen"
3. Access like a native app

## 🚀 Deployment

```bash
# Deploy to Vercel
vercel

# Or push to GitHub for auto-deploy
git push origin main
```

## License

MIT
