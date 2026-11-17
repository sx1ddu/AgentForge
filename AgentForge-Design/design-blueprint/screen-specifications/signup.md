# Signup route behavior

No distinct signup API or email/password registration exists. Do not fabricate one. The page uses the same Google authentication entry as login with a slightly different title (“Create your workspace”) and same `signInWithPopup` → ID token → `/api/auth/login` flow. Existing users are signed in; new users are created by backend auth controller. Keep this distinction explicit in UI copy.
