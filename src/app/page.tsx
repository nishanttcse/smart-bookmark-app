"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // 🔥 Auto redirect if already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        router.push("/dashboard");
      }
    };

    checkUser();
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          "https://smart-bookmark-app-six-mu.vercel.app/dashboard",
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
