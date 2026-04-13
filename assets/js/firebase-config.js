/**
 * EGLab Firebase Configuration
 * ============================================================
 * SETUP INSTRUCTIONS:
 *
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new project named "eglab-blog" (or similar)
 * 3. Enable Authentication → Sign-in method → Google
 * 4. Enable Firestore Database (start in production mode)
 * 5. Go to Project Settings → Your apps → Add web app
 * 6. Copy the firebaseConfig object and replace the values below
 * 7. Deploy Firestore rules from firebase/firestore.rules
 *
 * To set your first admin user:
 *   - Sign in once via /admin/ to register your Google account
 *   - In Firestore console, open users/{your-uid}
 *   - Set the "role" field to "admin"
 * ============================================================
 */

// Firebase v9 modular SDK — loaded via CDN in HTML files
// This config is intentionally public (secured by Firestore rules)

const FIREBASE_CONFIG = {
  apiKey:            "REPLACE_WITH_YOUR_API_KEY",
  authDomain:        "REPLACE_WITH_YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket:     "REPLACE_WITH_YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "REPLACE_WITH_YOUR_MESSAGING_SENDER_ID",
  appId:             "REPLACE_WITH_YOUR_APP_ID"
};

// ── Firestore Collection Names ────────────────────────────────
const DB_COLLECTIONS = {
  POSTS: 'blog_posts',
  USERS: 'users'
};

// ── User Roles ────────────────────────────────────────────────
const USER_ROLES = {
  ADMIN:   'admin',
  WRITER:  'writer',
  PENDING: 'pending'
};

// Export for use in other scripts
if (typeof module !== 'undefined') {
  module.exports = { FIREBASE_CONFIG, DB_COLLECTIONS, USER_ROLES };
}
