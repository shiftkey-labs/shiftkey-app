import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase } from "firebase/database";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBtztgQCLuHDDqFwYHeP3HJrdGVpHUJIYA",
  authDomain: "shiftkey-app.firebaseapp.com",
  projectId: "shiftkey-app",
  storageBucket: "shiftkey-app.appspot.com",
  messagingSenderId: "770322625873",
  appId: "1:770322625873:web:2c991d993d8229dd8d8f70",
  measurementId: "G-PXC0N5BRXW",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const database = getDatabase(app);
// const analytics = getAnalytics(app);

export { auth, database };
