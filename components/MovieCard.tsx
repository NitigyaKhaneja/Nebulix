"use client";

import { MagicCard } from "@/components/magicui/magic-card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  vote_average: number;
  overview: string;
}

interface MovieCardProps {
  movie: Movie;
  onViewDetails?: () => void;
  onBookmark?: (id: number) => void; // Now optional
}

export default function MovieCard({ movie, onViewDetails, onBookmark }: MovieCardProps) {
  const router = useRouter();
  const formattedTitle = movie.title?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  // Load bookmark status from localStorage on mount
  useEffect(() => {
    const storedWatchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
    setIsBookmarked(storedWatchlist.some((m: Movie) => m.id === movie.id));
  }, [movie.id]); // Only runs when movie.id changes

  const toggleBookmark = () => {
    let storedWatchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");

    if (isBookmarked) {
      storedWatchlist = storedWatchlist.filter((m: Movie) => m.id !== movie.id);
    } else {
      storedWatchlist.push(movie);
    }

    localStorage.setItem("watchlist", JSON.stringify(storedWatchlist));
    setIsBookmarked(!isBookmarked);

    if (onBookmark) {
      onBookmark(movie.id); // Update watchlist state in parent
    }
  };

  return (
    <MagicCard
      gradientFrom="#6A0DAD"
      gradientColor="#6A0DAD"
      className="p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 border border-purple-500 bg-black flex flex-col justify-between"
    >
      <div className="flex-grow">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title || movie.name}
          className="w-full rounded-md"
        />
        <h3 className="mt-2 text-lg font-bold text-center text-purple-400">
          {movie.title || movie.name}
        </h3>
        <p className="text-purple-300 text-sm text-center">⭐ {movie.vote_average}</p>
      </div>

      {onViewDetails && (
        <button
          onClick={() => router.push(`/m/${formattedTitle}`)}
          className="mt-4 w-full bg-purple-700 text-white p-2 rounded-lg hover:bg-purple-800 transition"
        >
          View Details
        </button>
      )}

      {/* Bookmark Button */}
      <button
        onClick={toggleBookmark}
        className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-purple-700"
      >
        {isBookmarked ? "🔖" : "➕"}
      </button>
    </MagicCard>
  );
}
