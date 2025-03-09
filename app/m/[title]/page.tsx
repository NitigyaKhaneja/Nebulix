'use client'

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API;
const SEARCH_API_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;

const LANGUAGE_MAP: { [key: string]: string } = {
  en: "English",
  fr: "French",
  es: "Spanish",
  de: "German",
  it: "Italian",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
  hi: "Hindi",
  ru: "Russian",
  pt: "Portuguese",
  ar: "Arabic",
  nl: "Dutch",
  tr: "Turkish",
  sv: "Swedish",
  pl: "Polish",
  da: "Danish",
  fi: "Finnish",
  he: "Hebrew",
  id: "Indonesian",
  no: "Norwegian",
  th: "Thai",
  vi: "Vietnamese",
  // Add more if needed
};

export default function MovieDetails() {
  const router = useRouter();
  const params = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovie() {
      try {
        if (!params.title) return;
        const formattedTitle = decodeURIComponent(params.title).replace(/-/g, " ");
        const response = await fetch(`${SEARCH_API_URL}${formattedTitle}`);
        const data = await response.json();
        if (data.results.length > 0) {
          const movieId = data.results[0].id;
          const detailsResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits`);
          const details = await detailsResponse.json();
          setMovie(details);
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMovie();
  }, [params.title]);

  if (loading) return <div className="text-white text-center mt-10">Loading movie details...</div>;
  if (!movie) return <div className="text-white text-center mt-10">Movie not found.</div>;

  const trailer = movie.videos?.results.find((video: any) => video.type === "Trailer" && video.site === "YouTube");
  const language = LANGUAGE_MAP[movie.original_language] || movie.original_language.toUpperCase();

  return (
    <div 
      className="min-h-screen bg-black text-white p-6 flex justify-center items-center relative" 
      style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="bg-black bg-opacity-80 p-0 rounded-lg shadow-lg w-full max-w-5xl flex flex-col md:flex-row items-center md:items-stretch">
        
        {/* Movie Poster on Left - Covers the full div */}
        <div className="w-full md:w-1/2 flex">
          <img 
            src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} 
            alt={movie.title} 
            className="w-full h-full object-cover rounded-l-lg"
          />
        </div>

        {/* Movie Details on Right */}
        <div className="w-full md:w-1/2 text-left p-6 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-purple-500">{movie.title}</h2>
          <p className="text-gray-300 mt-2 text-lg">⭐ {movie.vote_average}</p>
          <p className="text-gray-400 mt-4 text-lg">{movie.overview}</p>
          <p className="text-gray-400 mt-2 text-lg">🎬 Language: {language}</p>
          <p className="text-gray-400 text-lg">📅 Release Date: {movie.release_date || "N/A"}</p>

          {movie.credits && movie.credits.cast.length > 0 && (
            <div className="mt-6">
              <h3 className="text-2xl font-semibold text-purple-400">Cast</h3>
              <ul className="mt-2 text-gray-300 text-lg">
                {movie.credits.cast.slice(0, 5).map((actor: any) => (
                  <li key={actor.id} className="mt-1">{actor.name} as {actor.character}</li>
                ))}
              </ul>
            </div>
          )}

          {trailer && (
            <a href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noopener noreferrer" 
              className="mt-4 inline-block px-6 py-3 bg-red-600 text-white text-lg font-bold text-center rounded-lg">
              🎬 Watch Trailer
            </a>
          )}

          <button onClick={() => router.back()} className="mt-4 px-6 py-3 bg-purple-500 text-lg rounded-lg">
            ❌ Close
          </button>
        </div>
      </div>
    </div>
  );
}
