
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import PokemonCard from '@/components/PokemonCard';
import { Pokemon, getPokemonList, getPokemon } from '@/services/pokemon';
import { toast } from "sonner";

const Index = () => {
  const [featuredPokemon, setFeaturedPokemon] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFeaturedPokemon = async () => {
      try {
        setIsLoading(true);
        // Get a list of Pokemon
        const list = await getPokemonList(0, 12);
        
        // Fetch details for each Pokemon
        const pokemonPromises = list.results.map(p => getPokemon(p.name));
        const pokemonDetails = await Promise.all(pokemonPromises);
        
        // Filter out any null results
        setFeaturedPokemon(pokemonDetails.filter((p): p is Pokemon => p !== null));
      } catch (error) {
        console.error("Error loading featured Pokemon:", error);
        toast.error("Failed to load Pokémon data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFeaturedPokemon();
  }, []);

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Explore the World of <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700">Pokémon</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Search for Pokémon by name or browse the complete Pokédex
              </p>
            </motion.div>
            
            <SearchBar onSearch={handleSearch} autoFocus={true} />
          </motion.div>
        </div>
      </section>
      
      {/* Featured Pokemon Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Featured Pokémon</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse" />
                  <div className="p-4">
                    <div className="h-4 w-1/4 bg-gray-200 animate-pulse mb-2" />
                    <div className="h-6 w-3/4 bg-gray-200 animate-pulse mb-4" />
                    <div className="h-4 w-1/2 bg-gray-200 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredPokemon.map((pokemon, index) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
