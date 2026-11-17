# Login

**Purpose:** authenticate with the existing Firebase Google provider.

**Design:** split layout on desktop: 54% brand panel with work-rail diagram, 46% focused form surface. On mobile use one column, no decorative panel. Single provider button “Continue with Google”; no email/password fields. Terms/privacy links only if actual destinations exist.

**States:** idle, popup pending, popup blocked/cancelled, token exchange pending, server rejection, success. Disable CTA while pending. Error text stays near button and is announced. Preserve Firebase auth + POST `/api/auth/login`.

**Signup:** there is no separate signup capability. `/signup` should resolve to the same Google account-creation/sign-in flow; explain “New here? Your workspace is created when you continue with Google.”
