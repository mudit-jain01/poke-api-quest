
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import PokemonCard from '@/components/PokemonCard';
import { Pokemon, getFavorites, getPokemon } from '@/services/pokemon';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Favorites = () => {
  const [favoritePokemon, setFavoritePokemon] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setIsLoading(true);
        
        // Get IDs from local storage
        const favoriteIds = getFavorites();
        
        if (favoriteIds.length === 0) {
          setFavoritePokemon([]);
          return;
        }
        
        // Fetch details for each Pokemon
        const pokemonPromises = favoriteIds.map(id => getPokemon(id));
        const pokemonDetails = await Promise.all(pokemonPromises);
        
        // Filter out any null results
        setFavoritePokemon(pokemonDetails.filter((p): p is Pokemon => p !== null));
      } catch (error) {
        console.error("Error loading favorite Pokemon:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFavorites();
    
    // Listen for storage events to update favorites in real time
    const handleStorageChange = () => {
      loadFavorites();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Also re-check favorites when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const favoriteIds = getFavorites();
        if (favoriteIds.length !== favoritePokemon.length) {
          // Only reload if the number of favorites has changed
          const loadFavorites = async () => {
            const pokemonPromises = favoriteIds.map(id => getPokemon(id));
            const pokemonDetails = await Promise.all(pokemonPromises);
            setFavoritePokemon(pokemonDetails.filter((p): p is Pokemon => p !== null));
          };
          loadFavorites();
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [favoritePokemon.length]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <div className="container px-4 mx-auto pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center max-w-3xl mx-auto mb-12 mt-8"
        >
          <h1 className="text-3xl font-bold mb-4">
            Your Favorite Pokémon
          </h1>
          <p className="text-gray-600">
            Manage your collection of favorite Pokémon
          </p>
        </motion.div>
        
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-gray-600">Loading your favorites...</p>
            </motion.div>
          ) : favoritePokemon.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {favoritePokemon.map((pokemon, index) => (
                  <PokemonCard key={pokemon.id} pokemon={pokemon} index={index} />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="mb-6 p-4 rounded-full bg-gray-100">
                <Heart size={48} className="text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-3">No favorites yet</h2>
              <p className="text-gray-600 mb-8 max-w-md">
                You haven't added any Pokémon to your favorites yet. Click the heart icon on any Pokémon to add it to your collection.
              </p>
              <Link
                to="/"
                className="px-6 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-colors"
              >
                Browse Pokémon
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Favorites;
