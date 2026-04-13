/**
 * EGLab Firebase Configuration
 * ============================================================
 * Firebase project: saas-of-funqa
 *
 * SETUP — fill in the three remaining values from:
 *   Firebase Console → Project Settings → Your apps → Web app config
 *
 *   apiKey            — from web app config
 *   messagingSenderId — from web app config
 *   appId             — from web app config
 *
 * See ADMIN_SETUP.md for the full step-by-step guide.
 * ============================================================
 */

// Firebase v9 modular SDK — loaded via CDN in HTML files
// These client-side values are intentionally public (secured by Firestore rules)

const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyDR2XdnemhSHYznMFI20or-WKIPgn1V7vc",
  authDomain:        "saas-of-funqa.firebaseapp.com",
  projectId:         "saas-of-funqa",
  storageBucket:     "saas-of-funqa.firebasestorage.app",
  messagingSenderId: "74495319833",
  appId:             "1:74495319833:web:d75e2d769b97c48bdeaf88"
};

// ── Firestore Collection Names ────────────────────────────────
const DB_COLLECTIONS = {
  POSTS:    'blog_posts',
  USERS:    'users',
  LLM_WIKI: 'llm_wiki'
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
