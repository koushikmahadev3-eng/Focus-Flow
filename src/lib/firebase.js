// @ts-nocheck
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

let app, auth, db;

// Check if keys are actually set (checking just one is enough usually)
const hasKeys = typeof window !== 'undefined' ?
    // Client side: check if env vars were injected (Next.js inlines them usually)
    !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY :
    // Server/Build side: might be undefined
    !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

if (hasKeys && firebaseConfig.apiKey) {
    try {
        app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        auth = getAuth(app);
        db = getFirestore(app);
    } catch (e) {
        console.warn("Firebase Init Error:", e);
    }
} else {
    console.warn("Firebase Keys missing. Using Mock Mode.");
    // Leave undefined -> AuthContext will handle it
}

export { app, auth, db };
