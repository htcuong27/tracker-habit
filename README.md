# 📸 Habit Snap - Visual Habit Tracker PWA

A modern, mobile-first Progressive Web App for tracking habits with photo evidence and Pomodoro timer.

## ✨ Features

### 🎯 Core Features
- **Visual Habit Tracking**: Capture photos as proof of habit completion
- **IndexedDB Storage**: Persistent local storage for habits and photos
- **Service Worker**: Full offline support and PWA capabilities
- **Pomodoro Timer**: Built-in focus timer with work/break modes
- **Calendar View**: Visual calendar showing all captured habit photos
- **Real-time Stats**: Track completion rates and streaks

### 🎨 Design
- **Mobile-First**: Optimized for mobile devices
- **Glassmorphism UI**: Modern glass-effect design with gradients
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations and transitions
- **Dark Mode**: Beautiful dark theme by default

### 📱 Pages
1. **Home** (`/`) - Dashboard with habit cards and progress tracking
2. **History** (`/history`) - Calendar view of all photos
3. **Pomodoro** (`/pomodoro`) - Focus timer with work/break modes
4. **Profile** (`/profile`) - User stats and app settings

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Storage**: IndexedDB
- **PWA**: Service Worker + next-pwa
- **Camera**: MediaDevices getUserMedia API

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🗂️ Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home dashboard
│   ├── history/page.tsx      # Photo calendar
│   ├── pomodoro/page.tsx     # Pomodoro timer
│   ├── profile/page.tsx      # Profile & settings
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── BottomNav.tsx         # Bottom navigation
│   ├── HabitCard.tsx         # Habit item card
│   └── CaptureModal.tsx      # Camera capture modal
└── lib/
    ├── types.ts              # TypeScript types
    ├── db.ts                 # IndexedDB wrapper
    └── hooks/
        └── useHabits.ts      # Habits management hook
```

## 💾 Data Storage

### IndexedDB Stores
1. **habits** - Stores habit data (id, name, icon, color, streak, completedDays)
2. **photos** - Stores captured photos (id, habitId, date, dataUrl, note)

### Service Worker
- Caches static assets and pages
- Enables offline functionality
- Network-first strategy with cache fallback

## 🎯 Usage

### Adding a Habit
1. Click the "+" button in the bottom navigation
2. Fill in habit details (name, icon, color)
3. Save to IndexedDB

### Completing a Habit
1. Click the checkmark button to mark as complete
2. Or click the camera button to capture photo proof
3. Photo is saved to IndexedDB and linked to the habit

### Using Pomodoro
1. Navigate to Pomodoro tab
2. Choose work/break mode
3. Click start to begin timer
4. Receive notifications when timer completes

## 🌐 PWA Features

- **Installable**: Add to home screen on mobile devices
- **Offline Support**: Full functionality without internet
- **Push Notifications**: Timer completion alerts
- **App-like Experience**: Standalone display mode

## 📱 Mobile Optimization

- Safe area insets for notched devices
- Touch-optimized UI elements
- Responsive design (max-width: 600px)
- Smooth animations and transitions
- Camera access for photo capture

## 🎨 Customization

### Colors
Edit `tailwind.config.js` and `globals.css` to customize the color scheme:
- Primary: Indigo (#6366f1)
- Secondary: Pink (#ec4899)
- Accent: Cyan (#06b6d4)
- Background: Dark Blue (#0f172a)

### Timer Durations
Edit `src/app/pomodoro/page.tsx`:
```typescript
const WORK_TIME = 25 * 60;      // 25 minutes
const SHORT_BREAK = 5 * 60;     // 5 minutes
const LONG_BREAK = 15 * 60;     // 15 minutes
```

## 🔒 Privacy

- All data stored locally in IndexedDB
- No external servers or analytics
- Photos never leave your device
- Complete privacy and control

## 📄 License

MIT License - Feel free to use for personal or commercial projects

## 🙏 Credits

Built with ❤️ using Next.js, Tailwind CSS, and modern web technologies.

---

**Version**: 2.7.12
**Author**: Tex  
**Last Updated**: January 2026
# tracker-habit
