
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import PokemonDetail from '@/components/PokemonDetail';
import { Pokemon, PokemonSpecies, getPokemon, getPokemonSpecies } from '@/services/pokemon';
import { toast } from "sonner";

const Detail = () => {
  const { id } = useParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPokemonDetails = async () => {
      if (!id) {
        navigate('/');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch Pokemon details
        const pokemonData = await getPokemon(id);
        
        if (!pokemonData) {
          setError('Pokémon not found');
          toast.error('Pokémon not found');
          return;
        }
        
        setPokemon(pokemonData);
        
        // Fetch species details
        const speciesData = await getPokemonSpecies(pokemonData.id);
        setSpecies(speciesData);
        
      } catch (error) {
        console.error("Error loading Pokemon details:", error);
        setError('Failed to load Pokémon details');
        toast.error('Failed to load Pokémon details');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPokemonDetails();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 pt-32">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-600">Loading Pokémon details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 pt-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <h1 className="text-3xl font-bold mb-4">Pokémon Not Found</h1>
            <p className="text-gray-600 mb-8">
              We couldn't find the Pokémon you're looking for.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-colors"
            >
              Back to Home
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <div className="pt-16">
        <PokemonDetail pokemon={pokemon} species={species} />
      </div>
    </div>
  );
};

export default Detail;
