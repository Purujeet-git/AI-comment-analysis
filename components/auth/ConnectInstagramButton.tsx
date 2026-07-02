"use client";

import { signIn, useSession } from "next-auth/react";
import { FaInstagram } from "react-icons/fa";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";


export default function ConnectInstagramButton() {
  const { status } = useSession();

  if (status === "authenticated") {
    return (
        <>
      <button
        disabled
        className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-white"
      >
        <FaInstagram className="text-lg" />
        
        Instagram Connected
      </button>
      <button
      onClick={() =>
        signOut({
          callbackUrl: "/test-auth",
        })
      }
      className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 font-medium text-white transition-all duration-200 hover:bg-red-700"
    >
      <LogOut size={18} />
      Sign Out
    </button>
      </>
    );
  }

  return (
    <>
    <button
      onClick={() =>
        signIn("facebook", {
          callbackUrl: "/dashboard",
        })
      }
      className="flex items-center gap-2 rounded-lg bg-linear-to-r from-pink-500 via-red-500 to-yellow-500 px-5 py-3 text-white transition hover:scale-105"
    >
      <FaInstagram className="text-lg" />
      Connect Instagram
    </button>
    

    </>
  );
}