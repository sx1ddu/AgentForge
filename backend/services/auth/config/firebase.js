import admin from "firebase-admin";

let app = null;

export const getFirebaseApp = () => {
  if (app) return app;

  if (admin.apps.length > 0) {
    app = admin.apps[0];
    return app;
  }

  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (process.env.FIREBASE_PROJECT_ID && privateKey && process.env.FIREBASE_CLIENT_EMAIL) {
    try {
      app = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
      });
      console.log("Firebase Admin initialized with service account");
      return app;
    } catch (err) {
      console.error("Firebase Admin initialization error:", err.message);
    }
  } else {
    console.warn("Firebase Admin credentials not fully configured in environment.");
  }

  // Fallback default init if available
  try {
    app = admin.initializeApp();
  } catch (e) {
    // Already initialized or dummy
  }
  return app;
};

export { app };
