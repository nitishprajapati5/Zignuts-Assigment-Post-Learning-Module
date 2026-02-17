import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const serviceAccount = JSON.parse(
  process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY!
);

// Check if any apps are already initialized
const app = getApps().length === 0 
  ? initializeApp({
      credential: cert(serviceAccount),
    })
  : getApp(); // Reuse the existing [DEFAULT] app

export const adminDb = getFirestore(app);
export const adminAuth = getAuth(app);