"use client";

import { supabase } from "@/lib/supabase";

export default function Home() {

  const handleLogin = async () => {
    const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL + "/dashboard";

  await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
      },
    });
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <button
        onClick={handleLogin}
        className="bg-black text-white px-6 py-3 rounded-lg"
      >
        Sign in with Google
      </button>
    </div>
  );
}
