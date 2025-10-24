# Rivalis Hub

## Overview
Rivalis Hub is a mobile-friendly, React-based fitness and gaming dashboard with Firebase authentication, user profiles with nicknames, avatar creator, achievements tracking, real-time global and DM chat with Firestore persistence, and a comprehensive leaderboard integrating all game modes including Solo mode.

## Tech Stack
- React 18
- Vite 4 (dev server)
- React Router v6
- Firebase (Authentication & Firestore)
- Emoji Mart for chat emojis

## Project Structure
```
rivalis-hub/
├── index.html
├── vite.config.js
├── package.json
├── src/
│   ├── main.jsx (entry point)
│   ├── App.jsx (main app with routing)
│   ├── firebase.js (Firebase config)
│   ├── avatarService.js (legacy avatar generation)
│   ├── components/
│   │   ├── Navbar.jsx (displays user avatar and nickname)
│   │   ├── LoadingScreen.jsx
│   │   ├── UserAvatar.jsx
│   │   └── UserAvatarCustomizer.jsx (avatar creation with nickname)
│   ├── services/
│   │   ├── userService.js (user profile management)
│   │   ├── nicknameService.js (nickname generation and validation)
│   │   ├── chatService.js (chat message persistence)
│   │   └── leaderboardService.js (score tracking and retrieval)
│   └── views/
│       ├── Login.jsx
│       ├── Dashboard.jsx (with flickering "FITNESS REIMAGINED")
│       ├── AvatarCreator.jsx
│       ├── Solo.jsx (internal rep tracker, 1 rep = 1 point)
│       ├── Achievements.jsx
│       ├── GlobalChat.jsx (persists last 50 messages)
│       ├── DMChat.jsx (persists last 50 messages with user search)
│       ├── Leaderboard.jsx (aggregates all game modes)
│       ├── Burnouts.jsx
│       ├── Live.jsx
│       ├── Run.jsx
│       └── Gameboard.jsx
└── assets/
    ├── images/
    │   ├── background.png
    │   ├── burnouts.png
    │   ├── gameboard.jpeg
    │   ├── live.png
    │   ├── run.png
    │   └── solo.png
    └── styles/
        └── main.css
```

## Available Images
- background.png - Main hero background
- burnouts.png - Burnouts tile
- gameboard.jpeg - Game board image
- live.png - Live tile
- run.png - Run tile
- solo.png - Solo tile

## Key Features

### First-Time User Flow
1. User signs up and logs in
2. Forced to create avatar and nickname before accessing app
3. Profile saved to Firestore with `hasCompletedSetup` flag
4. Can edit profile anytime via Profile page

### Chat System
- **Global Chat**: Real-time messaging with all users, displays avatars and nicknames
- **Direct Messages**: Search for users by nickname, send private messages
- Both systems persist last 50 messages to Firestore for history

### Solo Mode & Leaderboard
- Internal Solo mode tracks reps with simple counter
- Each rep = 1 point automatically submitted to leaderboard
- Leaderboard aggregates scores across all game modes
- Filter by specific game mode or view combined totals

### Avatar System
- 10 DiceBear avatar styles with customization
- Nickname generation with validation
- Avatar and nickname displayed in navbar and chats

## Firestore Collections
- `users`: User profiles with nickname, avatar, setup status
- `globalChat`: Global chat messages with user info and avatars
- `directMessages`: Direct messages between users
- `leaderboard`: Scores from all game modes with metadata

## Development
- Dev server runs on port 5000
- Configured for Replit proxy with all hosts allowed
- Firebase authentication and Firestore pre-configured

## Recent Changes

### October 24, 2025 - Major Feature Implementation
- **User Profile System**: Users create nickname and avatar on first login (required before app access)
- **Nickname System**: Auto-generated nicknames with manual customization and validation
- **Chat System Overhaul**:
  - GlobalChat: Real-time messaging with last 50 messages persisted to Firestore
  - DMChat: Direct messaging with user search, recipient selection, last 50 messages persisted
  - Both chats display user avatars and nicknames (no more emails)
- **Solo Mode Integration**: 
  - Created internal Solo page matching app design (no longer external link)
  - Rep tracking system with automatic leaderboard submission (1 rep = 1 point)
- **Leaderboard Enhancement**: 
  - Aggregates scores from all game modes including Solo
  - Filter by game mode or view all combined
  - Displays individual mode breakdowns for each player
- **Dashboard Update**: Added flickering "FITNESS REIMAGINED" power surge effect
- **Navbar Enhancement**: Displays user avatar and nickname

### October 23, 2025 - Initial Setup
- Initial project setup from GitHub import
- All PNG assets moved to assets/images/
- Vite configured for Replit environment:
  - Port 5000 on 0.0.0.0 host
  - allowedHosts set to true to support Replit proxy
- Dependencies installed: React 18, Vite 4.5, Firebase 10, React Router 6, Emoji Mart
- Deployment configured for autoscale with preview server
- Modern DiceBear avatar creator implemented:
  - 10 beautiful avatar styles to choose from
  - DiceBear API v7.x integration
  - Smart avatar persistence (preserves both DiceBear and external URLs)
  - Mobile-responsive design with vertical layout
  - Randomize and custom seed functionality
  - Backward compatible with legacy avatars (auto-migrates 9.x to 7.x)
  - Clean, modern UI with gradients and smooth animations
