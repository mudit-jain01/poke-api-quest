
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import PokemonCard from '@/components/PokemonCard';
import { Pokemon, searchPokemon, getPokemonList, getPokemon } from '@/services/pokemon';
import { toast } from "sonner";

const Search = () => {
  const [searchResults, setSearchResults] = useState<Pokemon[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [popularPokemon, setPopularPokemon] = useState<Pokemon[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Parse search query from URL
  const query = new URLSearchParams(location.search).get('q') || '';

  // Load popular Pokemon (for display when no search is performed)
  useEffect(() => {
    const loadPopularPokemon = async () => {
      try {
        // Get a selection of popular Pokemon IDs
        const popularIds = [25, 1, 4, 7, 9, 150, 151, 6, 149]; // Pikachu, Bulbasaur, etc.
        
        // Fetch details for each Pokemon
        const pokemonPromises = popularIds.map(id => getPokemon(id));
        const pokemonDetails = await Promise.all(pokemonPromises);
        
        // Filter out any null results
        setPopularPokemon(pokemonDetails.filter((p): p is Pokemon => p !== null));
      } catch (error) {
        console.error("Error loading popular Pokemon:", error);
      }
    };
    
    if (!query) {
      loadPopularPokemon();
    }
  }, []);

  // Perform search when query changes
  useEffect(() => {
    if (query) {
      performSearch(query);
    } else {
      setSearchResults([]);
      setHasSearched(false);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    try {
      setIsSearching(true);
      setHasSearched(true);
      
      const results = await searchPokemon(searchQuery);
      setSearchResults(results);
      
      if (results.length === 0) {
        toast.info(`No Pokémon found matching "${searchQuery}"`);
      }
    } catch (error) {
      console.error("Error performing search:", error);
      toast.error("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (newQuery: string) => {
    navigate(`/search?q=${encodeURIComponent(newQuery)}`);
  };

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
          <h1 className="text-3xl font-bold mb-6">
            Search Pokémon
          </h1>
          
          <SearchBar 
            onSearch={handleSearch} 
            placeholder="Type a Pokémon name..." 
            autoFocus={true}
            className="mb-8"
          />
        </motion.div>
        
        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div
              key="searching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-gray-600">Searching for Pokémon...</p>
            </motion.div>
          ) : hasSearched ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4">
                {searchResults.length > 0 
                  ? `Found ${searchResults.length} Pokémon` 
                  : 'No Pokémon found'}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {searchResults.map((pokemon, index) => (
                  <PokemonCard key={pokemon.id} pokemon={pokemon} index={index} />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="popular"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4">Popular Pokémon</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {popularPokemon.map((pokemon, index) => (
                  <PokemonCard key={pokemon.id} pokemon={pokemon} index={index} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Search;
