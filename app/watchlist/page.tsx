"use client";

import { useEffect, useState } from "react";
import MovieCard from "@/components/MovieCard";
import { Navbar } from "@/components/Navbar";

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  vote_average: number;
  overview: string;
}

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const storedWatchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
    setWatchlist(storedWatchlist);
  }, []);

  // Function to remove a movie from the watchlist
  const handleRemoveBookmark = (id: number) => {
    const updatedWatchlist = watchlist.filter((movie) => movie.id !== id);
    setWatchlist(updatedWatchlist);
    localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
  };

  return (
    <div className="min-h-screen p-6 bg-black text-white">
        <Navbar />
      <h1 className="text-3xl font-bold text-purple-400 text-center mt-20 mb-6">Your Watchlist</h1>

      {watchlist.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">Your watchlist is empty.</p>
      ) : (
        <div className="grid grid-cols-5 gap-6">
          {watchlist.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              bookmarked={watchlist.some((m) => m.id === movie.id)}
              onBookmark={handleRemoveBookmark} // Pass function to remove from watchlist
            />
          ))}
        </div>
      )}
    </div>
  );
}
