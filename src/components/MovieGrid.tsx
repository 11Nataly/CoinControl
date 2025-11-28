import { MovieCard } from './MovieCard';
import { Movie } from '../types';

interface MovieGridProps {
  movies: Movie[];
  onAddToCart: (movie: Movie) => void;
}

export function MovieGrid({ movies, onAddToCart }: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No se encontraron películas</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}
