"use client";

import { useEffect, useState } from "react";
import MovieCard from "@/components/MovieCard";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { LoadMoreButton } from "@/components/LoadMoreButton";
import { useRouter } from "next/navigation";
import Particles from "@/components/Particles/Particles";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API;
const DISCOVER_API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`;
const SEARCH_API_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;
const LANGUAGE_API_URL = `https://api.themoviedb.org/3/configuration/languages?api_key=${API_KEY}`;

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path?: string;
  vote_average: number;
  overview: string;
  release_date?: string;
  genres?: { id: number; name: string }[];
  original_language?: string;
  credits?: {
    cast: { id: number; name: string; character: string }[];
  };
  videos?: {
    results: { key: string; site: string; type: string }[];
  };
}

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [languages, setLanguages] = useState<{ [key: string]: string }>({});
  const [watchlist, setWatchlist] = useState<Movie[]>([]);

  const router = useRouter();

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const storedWatchlist = localStorage.getItem("watchlist");
    if (storedWatchlist) {
      setWatchlist(JSON.parse(storedWatchlist));
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    fetch(LANGUAGE_API_URL)
      .then((res) => res.json())
      .then((data) => {
        const langMap: { [key: string]: string } = {};
        data.forEach((lang: any) => {
          langMap[lang.iso_639_1] = lang.english_name;
        });
        setLanguages(langMap);
      })
      .catch((err) => console.error("Error fetching languages:", err));
  }, []);

  useEffect(() => {
    fetchMovies(DISCOVER_API_URL, 1);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim() === "") {
        fetchMovies(DISCOVER_API_URL, 1);
      } else {
        fetchMovies(`${SEARCH_API_URL}${search}`, 1);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const fetchMovies = (url: string, newPage: number) => {
    setLoading(true);
    fetch(`${url}&page=${newPage}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.results.length > 0) {
          setMovies((prevMovies) => {
            const uniqueMovies = [...prevMovies, ...data.results].filter(
              (movie, index, self) =>
                self.findIndex((m) => m.id === movie.id) === index
            );
            return newPage === 1 ? data.results : uniqueMovies;
          });
          setPage(newPage);
        } else {
          setHasMore(false);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const loadMoreMovies = () => {
    fetchMovies(DISCOVER_API_URL, page + 1);
  };

  // Toggle movie in watchlist
  const handleBookmark = (movie: Movie) => {
    setWatchlist((prevWatchlist) => {
      const isBookmarked = prevWatchlist.some((m) => m.id === movie.id);
      return isBookmarked
        ? prevWatchlist.filter((m) => m.id !== movie.id) // Remove if already bookmarked
        : [...prevWatchlist, movie]; // Add to watchlist
    });
  };

  return (
    <div className="relative min-h-screen text-white">
      <div className="absolute inset-0 z-0 bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(18,18,38,1)_0%,_rgba(0,0,0,1)_100%)]">
          <Particles />
        </div>
        <div className="absolute inset-0 bg-stars" />
      </div>

      <div className="relative z-10">
        <Navbar />

        <div className="w-full mt-16 px-6">
          <motion.div className="flex justify-center p-6">
            <div className="relative w-full max-w-3xl">
              <input
                type="text"
                placeholder="Search Movies..."
                className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={() => setSearch("")}
                >
                  ✖
                </button>
              )}
            </div>
          </motion.div>

          {loading && page === 1 ? (
            <p className="text-center text-white text-lg">Loading movies...</p>
          ) : (
            <motion.div className="grid grid-cols-5 gap-6 p-5">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onViewDetails={() => router.push(`/m/${movie.id}`)}
                  bookmarked={watchlist.some((m) => m.id === movie.id)}
                  onBookmark={() => handleBookmark(movie)}
                />
              ))}
            </motion.div>
          )}

          <LoadMoreButton onLoadMore={loadMoreMovies} hasMore={hasMore} />
        </div>
      </div>
    </div>
  );
}
