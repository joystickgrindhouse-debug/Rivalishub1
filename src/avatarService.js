import { updateProfile } from "firebase/auth";

export const generateAvatarForUser = async (user, options = {}) => {
  const seed = user.uid;
  const { hair = "brown", eyes = "black", clothes = "blue" } = options;

  const avatarURL = `https://avatars.dicebear.com/api/avataaars/${seed}.svg?hairColor=${hair}&eyeColor=${eyes}&clothesColor=${clothes}`;

  await updateProfile(user, { photoURL: avatarURL });
  return avatarURL;
};
