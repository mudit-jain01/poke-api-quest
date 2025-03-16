
import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import FavoriteButton from './FavoriteButton';
import { Pokemon, PokemonSpecies } from '@/services/pokemon';
import { cn } from '@/lib/utils';

interface PokemonDetailProps {
  pokemon: Pokemon;
  species: PokemonSpecies | null;
}

const PokemonDetail = ({ pokemon, species }: PokemonDetailProps) => {
  const [activeTab, setActiveTab] = useState<'about' | 'stats' | 'evolution'>('about');
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get English description
  const description = species?.flavor_text_entries
    .filter(entry => entry.language.name === 'en')
    .map(entry => entry.flavor_text)
    .slice(0, 1)
    .join(' ')
    .replace(/\f/g, ' ');

  // Extract genera (e.g., "Seed Pokémon")
  const genus = species?.genera
    .find(g => g.language.name === 'en')
    ?.genus || '';

  // Format height and weight
  const formattedHeight = (pokemon.height / 10).toFixed(1); // Convert to meters
  const formattedWeight = (pokemon.weight / 10).toFixed(1); // Convert to kg

  // Format Pokemon ID to #001 format
  const formattedId = `#${pokemon.id.toString().padStart(3, '0')}`;
  
  // Get background gradient based on Pokemon type
  const mainType = pokemon.types[0]?.type.name || 'normal';
  const secondaryType = pokemon.types[1]?.type.name || mainType;
  
  // Get the main artwork or fallback to sprite
  const imageUrl = 
    pokemon.sprites.other?.['official-artwork']?.front_default || 
    pokemon.sprites.front_default;

  return (
    <div className="mx-auto max-w-4xl px-4 pt-12 pb-16">
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </Link>
        <FavoriteButton pokemonId={pokemon.id} size="lg" />
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
        <div 
          className={cn(
            "relative overflow-hidden bg-gradient-to-br pt-12 pb-24",
            `from-pokemon-${mainType}/60 to-pokemon-${secondaryType}/80`
          )}
        >
          <div className="absolute top-4 left-4">
            <span className="text-lg font-semibold text-white/80">{formattedId}</span>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 capitalize">
              {pokemon.name}
            </h1>
            
            <div className="flex justify-center gap-3 mb-8">
              {pokemon.types.map((typeInfo) => (
                <span 
                  key={typeInfo.type.name}
                  className={cn(
                    "type-badge",
                    `bg-pokemon-${typeInfo.type.name}`,
                    "text-white px-4 py-1"
                  )}
                >
                  {typeInfo.type.name.charAt(0).toUpperCase() + typeInfo.type.name.slice(1)}
                </span>
              ))}
            </div>
            
            <div className="relative mx-auto h-60 w-60">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-24 w-24 animate-pulse rounded-full bg-white/20"></div>
                </div>
              )}
              <motion.img
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                src={imageUrl}
                alt={pokemon.name}
                className={cn(
                  "h-full w-full object-contain transition-opacity duration-500",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          </motion.div>
        </div>
        
        <div className="-mt-8 rounded-t-3xl bg-white px-6 pt-8 pb-12">
          <div className="flex justify-center mb-6">
            <nav className="flex gap-2 rounded-lg bg-gray-100 p-1">
              <TabButton active={activeTab === 'about'} onClick={() => setActiveTab('about')}>About</TabButton>
              <TabButton active={activeTab === 'stats'} onClick={() => setActiveTab('stats')}>Stats</TabButton>
              <TabButton active={activeTab === 'evolution'} onClick={() => setActiveTab('evolution')}>Evolution</TabButton>
            </nav>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'about' && (
                <div className="space-y-6">
                  {description && (
                    <p className="text-gray-600 leading-relaxed">
                      {description}
                    </p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-6">
                    <InfoItem label="Species" value={genus} />
                    <InfoItem label="Height" value={`${formattedHeight} m`} />
                    <InfoItem label="Weight" value={`${formattedWeight} kg`} />
                    <InfoItem 
                      label="Abilities" 
                      value={pokemon.abilities
                        .map(a => a.ability.name.replace('-', ' '))
                        .map(s => s.charAt(0).toUpperCase() + s.slice(1))
                        .join(', ')} 
                    />
                  </div>
                </div>
              )}
              
              {activeTab === 'stats' && (
                <div className="space-y-4">
                  {pokemon.stats.map((stat) => {
                    // Map stat names to more readable format
                    const statNames: Record<string, string> = {
                      'hp': 'HP',
                      'attack': 'Attack',
                      'defense': 'Defense',
                      'special-attack': 'Sp. Atk',
                      'special-defense': 'Sp. Def',
                      'speed': 'Speed'
                    };
                    
                    const statName = statNames[stat.stat.name] || stat.stat.name;
                    const statValue = stat.base_stat;
                    // Calculate percentage for bar (max stat is typically 255)
                    const percentage = Math.min(100, (statValue / 255) * 100);
                    
                    return (
                      <div key={stat.stat.name} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">{statName}</span>
                          <span className="text-sm font-semibold text-gray-900">{statValue}</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: 0.1 }}
                            className={`h-full rounded-full bg-pokemon-${mainType}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {activeTab === 'evolution' && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-gray-500">Evolution chain coming soon!</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TabButton = ({ active, onClick, children }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={cn(
      "px-4 py-2 text-sm font-medium rounded-md transition-all",
      active 
        ? "bg-white text-primary shadow-sm" 
        : "text-gray-600 hover:bg-gray-200/50"
    )}
  >
    {children}
  </button>
);

interface InfoItemProps {
  label: string;
  value: string;
}

const InfoItem = ({ label, value }: InfoItemProps) => (
  <div>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-base font-semibold text-gray-900 capitalize">{value}</dd>
  </div>
);

export default PokemonDetail;
