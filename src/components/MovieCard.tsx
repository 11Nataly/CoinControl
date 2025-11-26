import { useState } from 'react';
import { ShoppingCart, Star, Info } from 'lucide-react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MovieDialog } from './MovieDialog';
import { Movie } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MovieCardProps {
  movie: Movie;
  onAddToCart: (movie: Movie) => void;
}

export function MovieCard({ movie, onAddToCart }: MovieCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    onAddToCart(movie);
    setTimeout(() => setIsAdding(false), 300);
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
        <div className="relative aspect-[2/3] overflow-hidden bg-gray-200">
          <ImageWithFallback
            src={movie.image}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-2 right-2 bg-black/70 text-white">
            {movie.genre}
          </Badge>
        </div>
        
        <CardContent className="p-4">
          <h3 className="mb-1 line-clamp-1">{movie.title}</h3>
          <p className="text-gray-600 mb-2">{movie.year}</p>
          
          <div className="flex items-center gap-1 mb-3">
            <Star className="size-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{movie.rating}/5</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-blue-600">${movie.price.toFixed(2)}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsDialogOpen(true)}
            >
              <Info className="size-4" />
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            className="w-full"
            disabled={isAdding}
          >
            <ShoppingCart className="size-4 mr-2" />
            {isAdding ? 'Agregado!' : 'Agregar al carrito'}
          </Button>
        </CardFooter>
      </Card>

      <MovieDialog
        movie={movie}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </>
  );
}
