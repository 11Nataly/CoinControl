import { Star, Calendar, Tag, ShoppingCart } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Movie } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MovieDialogProps {
  movie: Movie;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: () => void;
}

export function MovieDialog({ movie, isOpen, onClose, onAddToCart }: MovieDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{movie.title}</DialogTitle>
          <DialogDescription>Detalles de la película</DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="aspect-[2/3] overflow-hidden rounded-lg bg-gray-200">
            <ImageWithFallback
              src={movie.image}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <div>
              <Badge>{movie.genre}</Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Star className="size-5 fill-yellow-400 text-yellow-400" />
                <span>{movie.rating}/5</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="size-5 text-gray-600" />
                <span>{movie.year}</span>
              </div>

              <div className="flex items-center gap-2">
                <Tag className="size-5 text-gray-600" />
                <span className="text-blue-600">${movie.price.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <h4 className="mb-2">Descripción</h4>
              <p className="text-gray-600">
                Una película extraordinaria que te mantendrá al borde de tu asiento. 
                Disfruta de una experiencia cinematográfica única con esta producción 
                de alta calidad que ha cautivado a audiencias de todo el mundo.
              </p>
            </div>

            <div>
              <h4 className="mb-2">Formato</h4>
              <p className="text-gray-600">Digital HD - Streaming ilimitado</p>
            </div>

            <Button onClick={onAddToCart} className="w-full">
              <ShoppingCart className="size-4 mr-2" />
              Agregar al carrito
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
