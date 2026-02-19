import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const serviceAccount = JSON.parse(
  process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY!
);

const app = getApps().length === 0 
  ? initializeApp({
      credential: cert(serviceAccount),
    })
  : getApp();

export const adminDb = getFirestore(app);
export const adminAuth = getAuth(app);