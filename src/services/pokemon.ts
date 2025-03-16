
import { toast } from "sonner";

// Types
export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
      'home': {
        front_default: string;
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
  height: number;
  weight: number;
  abilities: {
    ability: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  species: {
    url: string;
  };
}

export interface PokemonSpecies {
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
    };
  }[];
  genera: {
    genus: string;
    language: {
      name: string;
    };
  }[];
  evolution_chain: {
    url: string;
  };
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}

const BASE_URL = "https://pokeapi.co/api/v2";
const LIMIT = 20;

// Get a list of Pokemon
export const getPokemonList = async (offset = 0, limit = LIMIT): Promise<PokemonListResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch Pokémon list');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching Pokemon list:", error);
    toast.error("Failed to load Pokémon. Please try again.");
    return { count: 0, next: null, previous: null, results: [] };
  }
};

// Get a specific Pokemon by name or ID
export const getPokemon = async (nameOrId: string | number): Promise<Pokemon | null> => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon/${nameOrId.toString().toLowerCase()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokémon: ${nameOrId}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching Pokémon ${nameOrId}:`, error);
    toast.error(`Failed to load Pokémon: ${nameOrId}`);
    return null;
  }
};

// Get Pokemon species information
export const getPokemonSpecies = async (nameOrId: string | number): Promise<PokemonSpecies | null> => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon-species/${nameOrId.toString().toLowerCase()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokémon species: ${nameOrId}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching Pokémon species ${nameOrId}:`, error);
    return null;
  }
};

// Search for Pokemon
export const searchPokemon = async (query: string): Promise<Pokemon[]> => {
  try {
    // First get a large list of pokemon to search through
    const list = await getPokemonList(0, 150);
    
    // Filter the results based on the query
    const filtered = list.results.filter(pokemon => 
      pokemon.name.toLowerCase().includes(query.toLowerCase())
    );
    
    // Fetch details for each matching pokemon
    const promises = filtered.map(pokemon => getPokemon(pokemon.name));
    const results = await Promise.all(promises);
    
    // Filter out null results
    return results.filter((pokemon): pokemon is Pokemon => pokemon !== null);
  } catch (error) {
    console.error("Error searching Pokemon:", error);
    toast.error("Search failed. Please try again.");
    return [];
  }
};

// Local storage functions for favorites
export const getFavorites = (): number[] => {
  const stored = localStorage.getItem('pokemon-favorites');
  return stored ? JSON.parse(stored) : [];
};

export const addFavorite = (id: number): void => {
  const favorites = getFavorites();
  if (!favorites.includes(id)) {
    localStorage.setItem('pokemon-favorites', JSON.stringify([...favorites, id]));
    toast.success("Added to favorites!");
  }
};

export const removeFavorite = (id: number): void => {
  const favorites = getFavorites();
  localStorage.setItem('pokemon-favorites', JSON.stringify(favorites.filter(favId => favId !== id)));
  toast.success("Removed from favorites");
};

export const isFavorite = (id: number): boolean => {
  return getFavorites().includes(id);
};
