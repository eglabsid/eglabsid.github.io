# EGLab Student Blog — Admin Setup Guide

This guide explains how to set up Firebase for the Student Blog platform.

---

## 1. Create a Firebase Project

1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Click **Add project** → name it `eglab-blog`
3. Disable Google Analytics (optional) → click **Create project**

---

## 2. Enable Google Authentication

1. In your Firebase project, go to **Build → Authentication**
2. Click **Get started**
3. Under **Sign-in method**, click **Google** → Enable → Save
4. Add your GitHub Pages domain to **Authorized domains**:
   - `eglabsid.github.io`
   - `localhost` (for local dev)

---

## 3. Create Firestore Database

1. Go to **Build → Firestore Database**
2. Click **Create database**
3. Choose **Production mode** → select a region closest to your users → Done

---

## 4. Deploy Firestore Security Rules

Install Firebase CLI if you haven't:
```bash
npm install -g firebase-tools
firebase login
```

From the project root:
```bash
firebase init firestore
# Select your project when prompted
# Use firebase/firestore.rules as the rules file path

firebase deploy --only firestore:rules
```

---

## 5. Get Your Firebase Config

1. Go to **Project Settings** (gear icon) → **Your apps**
2. Click **Add app** → **Web** (</>)
3. Register the app with name `eglab-web`
4. Copy the `firebaseConfig` object

---

## 6. Replace Config Values in Source Files

Replace `REPLACE_WITH_YOUR_*` placeholders in **all three files**:

- `admin/index.html` — search for `firebaseConfig` block
- `student-blog.html` — search for `firebaseConfig` block
- `student-post.html` — search for `firebaseConfig` block

Example:
```js
const firebaseConfig = {
  apiKey:            "AIzaSyABC123...",
  authDomain:        "eglab-blog.firebaseapp.com",
  projectId:         "eglab-blog",
  storageBucket:     "eglab-blog.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abc123"
};
```

> **Note:** These values are safe to commit to public repos — they are secured by Firestore rules.

---

## 7. Set the First Admin User

After deploying, the first person to sign in via `/admin/` will be created with role `pending`. To grant admin access:

1. Sign in at `/admin/` with your Google account
2. Go to **Firebase Console → Firestore → users collection**
3. Find your document (named by your Google UID)
4. Change the `role` field from `pending` to `admin`

Now you can grant access to students directly from the Admin panel.

---

## 8. Grant Students Access

1. Ask students to sign in at `/admin/` (they will see "Access Pending" message)
2. Go to **Admin panel → Users tab**
3. Find the student's name, change their role from `pending` to `writer`
4. They can now log in and write posts

---

## User Roles

| Role    | Can do                                         |
|---------|------------------------------------------------|
| pending | Sign in, but cannot write or view admin panel  |
| writer  | Write posts, edit/delete their own posts       |
| admin   | All writer actions + manage all posts + manage users |

---

## 9. Running Tests

Install dependencies:
```bash
npm install
npx playwright install
```

Start Jekyll server in one terminal:
```bash
bundle exec jekyll serve
```

Run Playwright tests in another terminal:
```bash
npm run test:e2e
```

View test report:
```bash
npm run test:e2e:report
```

---

## Firestore Data Structure

```
blog_posts/
  {postId}/
    title:       string
    content:     string (HTML)
    author:      string
    authorId:    string (Firebase UID)
    tags:        string[]
    excerpt:     string
    status:      "published" | "draft"
    createdAt:   Timestamp
    updatedAt:   Timestamp

users/
  {uid}/
    displayName: string
    email:       string
    photoURL:    string
    role:        "pending" | "writer" | "admin"
    lastLogin:   Timestamp
```

---

## Local Development

```bash
# Install Ruby dependencies
bundle install

# Serve Jekyll locally
bundle exec jekyll serve

# Site available at:
open http://localhost:4000
open http://localhost:4000/student-blog.html
open http://localhost:4000/admin/
```

---

## Deployment

The site is automatically deployed to GitHub Pages on push to `main`. Firebase config changes require a commit and push.
