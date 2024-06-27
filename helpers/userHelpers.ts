// firebaseHelpers/userHelpers.js
import { database } from "@/config/firebaseConfig";
import { ref, set } from "firebase/database";

export const saveUserDetails = async (uid, userDetails) => {
  await set(ref(database, `users/${uid}`), userDetails);
};
