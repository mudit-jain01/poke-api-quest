
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pokemon } from '@/services/pokemon';
import { cn } from '@/lib/utils';
import FavoriteButton from './FavoriteButton';

interface PokemonCardProps {
  pokemon: Pokemon;
  index?: number;
}

const PokemonCard = ({ pokemon, index = 0 }: PokemonCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const getTypeColor = (type: string) => {
    return `bg-pokemon-${type}`;
  };

  // Get the main artwork or fallback to sprite
  const imageUrl = 
    pokemon.sprites.other?.['official-artwork']?.front_default || 
    pokemon.sprites.front_default;

  // Format Pokemon ID to #001 format
  const formattedId = `#${pokemon.id.toString().padStart(3, '0')}`;
  
  // Capitalize Pokemon name
  const capitalizedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="group relative"
    >
      <Link 
        to={`/pokemon/${pokemon.id}`}
        className="block"
      >
        <div className="overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-lg">
          <div className={cn(
            "relative h-48 overflow-hidden bg-gradient-to-br",
            pokemon.types[0]?.type?.name ? `from-pokemon-${pokemon.types[0].type.name}/20 to-pokemon-${pokemon.types[0].type.name}/40` : "from-gray-100 to-gray-200"
          )}>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-16 w-16 animate-pulse rounded-full bg-gray-200"></div>
              </div>
            )}
            <img
              src={imageUrl}
              alt={pokemon.name}
              className={cn(
                "absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 transform object-contain transition-all duration-500",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
          
          <div className="p-4">
            <span className="text-sm font-semibold text-gray-500">{formattedId}</span>
            <h3 className="mb-2 text-lg font-bold text-gray-900">{capitalizedName}</h3>
            
            <div className="flex flex-wrap gap-2">
              {pokemon.types.map((typeInfo) => (
                <span 
                  key={typeInfo.type.name}
                  className={cn(
                    "type-badge",
                    getTypeColor(typeInfo.type.name),
                    "text-white"
                  )}
                >
                  {typeInfo.type.name.charAt(0).toUpperCase() + typeInfo.type.name.slice(1)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
      
      <div className="absolute right-3 top-3 z-10">
        <FavoriteButton pokemonId={pokemon.id} />
      </div>
    </motion.div>
  );
};

export default PokemonCard;
