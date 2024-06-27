// firebaseHelpers/userHelpers.js
import { database } from "@/config/firebaseConfig";
import { get, push, ref, set } from "firebase/database";

export const saveUserDetails = async (uid, userDetails) => {
  await set(ref(database, `users/${uid}`), userDetails);
};
export const addBooking = async (uid, eventId, bookingDate) => {
  const bookingRef = ref(database, `bookings/${uid}`);
  const newBookingRef = push(bookingRef);
  await set(newBookingRef, {
    eventId,
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
