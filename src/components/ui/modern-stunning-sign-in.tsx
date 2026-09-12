"use client";

import * as React from "react";
import { useState } from "react";

export interface SignIn1Props {
  onSignInSuccess?: (user: { email: string }) => void;
  onClose?: () => void;
  className?: string;
}

const SignIn1: React.FC<SignIn1Props> = ({ onSignInSuccess, onClose, className = "" }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleSignIn = () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (onSignInSuccess) {
        onSignInSuccess({ email });
      } else {
        alert("Sign in successful! Welcome to 4Kit.");
      }
    }, 600);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-[#0F172A] relative overflow-hidden w-full rounded-2xl p-4 selection:bg-red-500 selection:text-white ${className}`}>
      {/* 4Kit Ambient Food Red Glows in the background */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-red-800/25 rounded-full blur-3xl pointer-events-none" />

      {/* Centered glass card with 4Kit Red gradient & accents */}
      <div className="relative z-10 w-full max-w-sm rounded-3xl bg-gradient-to-b from-white/[0.12] to-[#180404]/90 backdrop-blur-xl border border-red-500/20 shadow-[0_20px_50px_rgba(220,38,38,0.22)] p-8 flex flex-col items-center">
        {/* Close button if modal */}
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition p-1"
          >
            ✕
          </button>
        )}

        {/* 4Kit Logo */}
        <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500/30 to-red-900/40 p-1 mb-4 shadow-[0_0_20px_rgba(220,38,38,0.4)] border border-red-500/40">
          <img
            src="/4kit_logo.png"
            alt="4Kit Logo"
            className="w-full h-full object-contain drop-shadow"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/4logo_clean.png";
            }}
          />
        </div>

        {/* 4Kit Title & Tagline */}
        <h2 className="text-2xl font-black text-white tracking-tight mb-1 text-center font-display">
          4Kit
        </h2>
        <p className="text-xs text-red-200/80 mb-6 font-medium text-center">
          Superfast Hyperlocal Food &amp; Store Deliveries
        </p>

        {/* Form */}
        <div className="flex flex-col w-full gap-4">
          <div className="w-full flex flex-col gap-3">
            <div className="relative">
              <input
                placeholder="Email address"
                type="email"
                value={email}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.08] text-white placeholder-gray-400 text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-red-500/70 focus:border-red-500/50 transition"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <input
                placeholder="Password"
                type="password"
                value={password}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.08] text-white placeholder-gray-400 text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-red-500/70 focus:border-red-500/50 transition"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <div className="text-xs text-red-400 font-semibold text-left bg-red-950/40 border border-red-800/40 px-3 py-1.5 rounded-lg">
                {error}
              </div>
            )}
          </div>

          <hr className="border-white/10" />

          <div>
            {/* 4Kit Sign In Action Button */}
            <button
              onClick={handleSignIn}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#DC2626] to-[#991B1B] hover:from-[#EF4444] hover:to-[#B91C1C] active:scale-[0.99] text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-red-950/50 hover:shadow-red-600/30 transition mb-3 text-sm flex items-center justify-center cursor-pointer"
            >
              {isLoading ? "Signing in..." : "Sign in to 4Kit"}
            </button>

            {/* Google Sign In */}
            <button
              onClick={() => alert("Google Sign In demo")}
              className="w-full flex items-center justify-center gap-2.5 bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 rounded-xl px-5 py-3 font-medium text-white transition mb-2 text-sm cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.5 1.9 7.8l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
                />
              </svg>
              Continue with Google
            </button>

            <div className="w-full text-center mt-3">
              <span className="text-xs text-gray-400">
                Don&apos;t have an account?{" "}
                <a
                  href="#signup"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Sign up flow demo");
                  }}
                  className="underline text-red-400 hover:text-red-300 font-semibold"
                >
                  Sign up for 4Kit
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4Kit Foodie community count & active user avatars */}
      <div className="relative z-10 mt-10 flex flex-col items-center text-center max-w-xs">
        <p className="text-gray-400 text-xs mb-3">
          Join <span className="font-bold text-white">10,000+ foodies</span> in Trivandrum ordering with 4Kit.
        </p>
        <div className="flex -space-x-2.5">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
            alt="User 1"
            className="w-8 h-8 rounded-full border-2 border-[#0F172A] object-cover ring-1 ring-red-500/30"
          />
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces"
            alt="User 2"
            className="w-8 h-8 rounded-full border-2 border-[#0F172A] object-cover ring-1 ring-red-500/30"
          />
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces"
            alt="User 3"
            className="w-8 h-8 rounded-full border-2 border-[#0F172A] object-cover ring-1 ring-red-500/30"
          />
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces"
            alt="User 4"
            className="w-8 h-8 rounded-full border-2 border-[#0F172A] object-cover ring-1 ring-red-500/30"
          />
        </div>
      </div>
    </div>
  );
};

export { SignIn1 };
export default SignIn1;
