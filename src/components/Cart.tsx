import { X, Minus, Plus, Trash2, CreditCard } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from './ui/sheet';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { CartItem } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CartProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (movieId: number, quantity: number) => void;
  onRemoveItem: (movieId: number) => void;
}

export function Cart({ items, isOpen, onClose, onUpdateQuantity, onRemoveItem }: CartProps) {
  const subtotal = items.reduce((sum, item) => sum + item.movie.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle>Carrito de Compras</SheetTitle>
          <SheetDescription>
            {items.length === 0 ? 'Tu carrito está vacío' : `${items.length} película(s) en tu carrito`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>Agrega películas a tu carrito para comenzar</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map(item => (
                <div key={item.movie.id} className="flex gap-4 bg-gray-50 p-3 rounded-lg">
                  <div className="w-20 h-28 flex-shrink-0 overflow-hidden rounded bg-gray-200">
                    <ImageWithFallback
                      src={item.movie.image}
                      alt={item.movie.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="line-clamp-1 mb-1">{item.movie.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">${item.movie.price.toFixed(2)}</p>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateQuantity(item.movie.id, item.quantity - 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="size-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateQuantity(item.movie.id, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="size-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemoveItem(item.movie.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                    <span className="text-blue-600">
                      ${(item.movie.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">IVA (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <Button className="w-full" size="lg">
                <CreditCard className="size-4 mr-2" />
                Proceder al pago
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
