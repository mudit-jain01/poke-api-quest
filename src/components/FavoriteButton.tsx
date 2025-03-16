
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { addFavorite, removeFavorite, isFavorite } from '@/services/pokemon';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  pokemonId: number;
  size?: 'sm' | 'md' | 'lg';
}

const FavoriteButton = ({ pokemonId, size = 'md' }: FavoriteButtonProps) => {
  const [isFav, setIsFav] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check if this pokemon is in favorites
  useEffect(() => {
    setIsFav(isFavorite(pokemonId));
  }, [pokemonId]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAnimating(true);
    
    if (isFav) {
      removeFavorite(pokemonId);
    } else {
      addFavorite(pokemonId);
    }
    
    setIsFav(!isFav);
    
    // Reset animation state
    setTimeout(() => setIsAnimating(false), 600);
  };

  const sizeClasses = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3"
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 22
  };

  return (
    <button
      onClick={toggleFavorite}
      className={cn(
        "relative rounded-full transition-all duration-300",
        isFav 
          ? "bg-white shadow-md" 
          : "bg-white/80 hover:bg-white hover:shadow-sm",
        sizeClasses[size]
      )}
    >
      <AnimatePresence mode="wait">
        {isAnimating && isFav && (
          <motion.div
            key="favorite-animation"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="absolute inset-0 rounded-full bg-pink-500/20 animate-ping" />
          </motion.div>
        )}
      </AnimatePresence>
      
      <Heart
        size={iconSizes[size]}
        className={cn(
          "transition-colors duration-300",
          isFav ? "fill-pink-500 text-pink-500" : "text-gray-400"
        )}
      />
    </button>
  );
};

export default FavoriteButton;
