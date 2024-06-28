// helpers/userHelpers.js
import { ref, get, set, push } from "firebase/database";
import { database } from "../config/firebaseConfig";

// Function to sanitize Firebase keys
const sanitizeKey = (key) => key.replace(/[.#$/[\]]/g, "_");

export const saveUserDetails = async (uid, userDetails) => {
  await set(ref(database, `users/${uid}`), userDetails);
};

export const addBooking = async (uid, eventId, bookingDate) => {
  const bookingRef = ref(database, `bookings/${uid}`);
  const newBookingRef = push(bookingRef);
  await set(newBookingRef, {
    eventId: sanitizeKey(eventId),
    bookingDate,
    attendance: true,
  });
};

export const getUserBookings = async (uid) => {
  const bookingsRef = ref(database, `bookings/${uid}`);
  const snapshot = await get(bookingsRef);
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return {};
};

export const fetchEventByIdFromFirebase = async (id) => {
  const sanitizedId = sanitizeKey(id);
  const eventRef = ref(database, `events/${sanitizedId}`);
  const snapshot = await get(eventRef);
  if (snapshot.exists()) {
    return snapshot.val();
  }
  throw new Error("Event not found");
};

export const getUserRole = async (uid) => {
  const userRef = ref(database, `users/${uid}/role`);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return "STUDENT";
};
