import React from "react";
import Link from "next/link";
import { Home, Search, User, Bell, Bookmark } from "lucide-react";

export const Navbar = () => {
  return (
    <div className="relative w-full">
  {/* Particle Effect Behind Navbar */}

  {/* Navbar */}
  <nav className="w-full h-16 fixed top-0 left-0 flex items-center justify-between px-8 shadow-lg border-b border-gray-700 bg-black bg-opacity-90 backdrop-blur-lg z-50">
    {/* Logo */}
    <h1 className="text-2xl font-bold text-purple-400 tracking-wide neon-text">
      NebuLIX
    </h1>

    {/* Navigation Links */}
    <ul className="flex space-x-8 text-lg">
      <li>
        <Link href="/" className="flex items-center hover:text-purple-400 hover:scale-105 transition duration-300">
          <Home className="mr-2" /> Home
        </Link>
      </li>
      <li>
        <Link href="/search" className="flex items-center hover:text-purple-400 hover:scale-105 transition duration-300">
          <Search className="mr-2" /> Search
        </Link>
      </li>
      <li>
        <Link href="/watchlist" className="flex items-center hover:text-purple-400 hover:scale-105 transition duration-300">
          <Bookmark className="mr-2" /> Watchlist
        </Link>
      </li>
      <li>
        <Link href="/notifications" className="flex items-center hover:text-purple-400 hover:scale-105 transition duration-300">
          <Bell className="mr-2" /> Notifications
        </Link>
      </li>
    </ul>

    {/* Account Icon */}
    <Link href="/account" className="flex items-center hover:text-purple-400 hover:scale-105 transition duration-300">
      <User className="mr-2" /> Account
    </Link>
  </nav>
</div>

  );
};
