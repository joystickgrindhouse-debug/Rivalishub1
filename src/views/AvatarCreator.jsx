import React from "react";
import UserAvatarCustomizer from "../components/UserAvatarCustomizer";

export default function AvatarCreator({ user }) {
  return (
    <div className="hero-background">
      <div className="overlay-card">
        <h2>{user.email}'s Profile</h2>
        <UserAvatarCustomizer />
      </div>
    </div>
  );
}
