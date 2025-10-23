# Rivalis Hub

## Overview
Rivalis Hub is a mobile-friendly, React-based fitness and gaming dashboard with Firebase authentication, avatar creator, achievements tracking, global and DM chat, and leaderboard functionality.

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
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── LoadingScreen.jsx
│   └── views/
│       ├── Login.jsx
│       ├── AvatarCreator.jsx
│       ├── Achievements.jsx
│       ├── GlobalChat.jsx
│       ├── DMChat.jsx
│       └── Leaderboard.jsx
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

## Development
- Dev server runs on port 5000
- Configured for Replit proxy with all hosts allowed
- Firebase authentication is pre-configured

## Recent Changes
- Initial project setup from GitHub import (October 23, 2025)
- All PNG assets moved to assets/images/
- Vite configured for Replit environment:
  - Port 5000 on 0.0.0.0 host
  - allowedHosts set to ['all'] to support Replit proxy
- Dependencies installed: React 18, Vite 4.5, Firebase 10, React Router 6, Emoji Mart
- Deployment configured for autoscale with preview server
