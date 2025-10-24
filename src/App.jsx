import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { UserService } from "./services/userService.js";
import LoadingScreen from "./components/LoadingScreen.jsx";
import Login from "./views/Login.jsx";
import Dashboard from "./views/Dashboard.jsx";
import AvatarCreator from "./views/AvatarCreator.jsx";
import Achievements from "./views/Achievements.jsx";
import GlobalChat from "./views/GlobalChat.jsx";
import DMChat from "./views/DMChat.jsx";
import Leaderboard from "./views/Leaderboard.jsx";
import Solo from "./views/Solo.jsx";
import Burnouts from "./views/Burnouts.jsx";
import Live from "./views/Live.jsx";
import Run from "./views/Run.jsx";
import Gameboard from "./views/Gameboard.jsx";
import Navbar from "./components/Navbar.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [checkingSetup, setCheckingSetup] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        const result = await UserService.getUserProfile(currentUser.uid);
        if (result.success && result.profile) {
          setUserProfile(result.profile);
        }
      }
      
      setLoading(false);
      setCheckingSetup(false);
    });
  }, []);

  if (loading || checkingSetup) return <LoadingScreen />;

  if (!user) return <Login />;

  if (!userProfile || !userProfile.hasCompletedSetup) {
    return <AvatarCreator user={user} isFirstTimeSetup={true} onSetupComplete={(profile) => setUserProfile(profile)} />;
  }

  return (
    <div>
      <Navbar user={user} userProfile={userProfile} />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/profile" element={<AvatarCreator user={user} userProfile={userProfile} />} />
        <Route path="/solo" element={<Solo user={user} userProfile={userProfile} />} />
        <Route path="/burnouts" element={<Burnouts />} />
        <Route path="/live" element={<Live />} />
        <Route path="/run" element={<Run />} />
        <Route path="/gameboard" element={<Gameboard />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/chat" element={<GlobalChat user={user} userProfile={userProfile} />} />
        <Route path="/dm" element={<DMChat user={user} userProfile={userProfile} />} />
        <Route path="/leaderboard" element={<Leaderboard user={user} />} />
      </Routes>
    </div>
  );
}
