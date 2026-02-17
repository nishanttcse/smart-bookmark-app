Smart Bookmark App
🔗 Live Demo

https://smart-bookmark-app-six-mu.vercel.app

📦 GitHub Repository

[Add your GitHub repo link here]

📌 Overview

Smart Bookmark App is a secure, real-time bookmark manager built using:

Next.js (App Router)

Supabase (Auth, Postgres, Realtime)

Tailwind CSS

Vercel Deployment

Users can:

Sign in using Google OAuth

Add bookmarks (title + URL)

Delete their own bookmarks

See updates in real-time across multiple tabs

Access only their own data (fully isolated)

🛠 Tech Stack

Frontend: Next.js (App Router, Client Components)

Backend: Supabase (Auth + Postgres + Realtime)

Database Security: Row Level Security (RLS)

Styling: Tailwind CSS

Deployment: Vercel

🔐 Authentication

Implemented Google OAuth using Supabase Auth.

Flow:

User clicks “Sign in with Google”

Google authenticates user

Google redirects to Supabase callback

Supabase establishes session

App redirects to /dashboard

Production redirect handling was configured using:

Supabase URL Configuration

Google Cloud OAuth Authorized Redirect URI

Vercel environment variables

🗄 Database Design

Table: bookmarks

Columns:

id (uuid, primary key)

user_id (uuid)

title (text)

url (text)

created_at (timestamp)

🔒 Security Implementation (RLS)

Row Level Security (RLS) was enabled on the bookmarks table.

Policies implemented:

SELECT
user_id = auth.uid()

INSERT (WITH CHECK)
user_id = auth.uid()

DELETE
user_id = auth.uid()


This ensures:

Users can only view their own bookmarks

Users can only insert rows with their own user_id

Users cannot delete other users’ data

Security is enforced at the database layer, not just frontend filtering.

⚡ Real-Time Updates

Used Supabase postgres_changes subscription:

Subscribed to changes on public.bookmarks

On INSERT/DELETE → re-fetch bookmarks

Two tabs update instantly without refresh

This satisfies the real-time requirement.

🚧 Problems Faced & Debugging Process

Here are the actual issues encountered and how they were resolved:

1️⃣ Google OAuth Client ID Error

Problem:
Supabase rejected the Client ID due to incorrect value (project name pasted instead of actual OAuth client ID).

Solution:
Created proper OAuth 2.0 credentials in Google Cloud:

Application type: Web Application

Added Supabase callback URL

Used correct Client ID and Client Secret

2️⃣ Redirect Loop After Deployment

Problem:
After deploying to Vercel, login redirected back to the login page instead of /dashboard.

Cause:
The login page did not automatically check for an existing session.

Solution:
Added session check in page.tsx:

useEffect(() => {
  const checkUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      router.push("/dashboard");
    }
  };
  checkUser();
}, []);


This ensured logged-in users are redirected properly.

3️⃣ Production Redirect Mismatch

Problem:
OAuth redirect was failing or landing on root page.

Cause:
Mismatch between:

Vercel environment variable

Supabase Site URL

Google Authorized Redirect URI

Solution:

Set NEXT_PUBLIC_SITE_URL correctly in Vercel

Updated Supabase Site URL

Ensured only Supabase callback URL was added in Google Cloud

Redeployed application

4️⃣ Bookmarks Not Appearing After Insert

Problem:
Bookmark was not showing in UI after being added.

Debugging Steps:

Checked Supabase table manually

Added error logging in insert query

Verified RLS insert policy

Confirmed user_id column type was uuid

Final Fix:
Ensured:

INSERT policy used WITH CHECK (user_id = auth.uid())

Realtime subscription re-fetches bookmarks

Loading state handled correctly

5️⃣ Loading State Misplacement

Problem:
Loading JSX was incorrectly returned inside useEffect, causing logic issues.

Solution:
Moved loading UI outside useEffect:

if (loading) {
  return <p>Loading...</p>;
}

🧠 Key Learnings

OAuth configuration must be perfectly aligned across Google, Supabase, and Vercel.

RLS is critical for multi-user security.

Production environment variables must be redeployed after changes.

Authentication state must be checked on initial page load.

Debugging is often about configuration alignment, not just code.

🚀 Possible Improvements

Edit bookmark functionality

Bookmark categories

Search & filtering

Better UI animations

Middleware-based route protection

✅ Final Status

Google OAuth working in production

Bookmarks private per user

Real-time updates working

RLS fully enforced

Successfully deployed on Vercel