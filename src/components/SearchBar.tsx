
import { useState, useRef, useEffect } from 'react';
import { Search as SearchIcon, X as ClearIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search Pokémon...", 
  autoFocus = false,
  className 
}: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus on input if autoFocus is true
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className={cn(
        "relative w-full max-w-xl mx-auto",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center overflow-hidden rounded-full border transition-all duration-300",
          isFocused 
            ? "border-primary shadow-sm ring-2 ring-primary/20" 
            : "border-input hover:border-gray-300"
        )}
      >
        <div className="flex-shrink-0 pl-4">
          <SearchIcon
            size={18}
            className={cn(
              "transition-colors duration-300",
              isFocused ? "text-primary" : "text-gray-400"
            )}
          />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-grow bg-transparent px-3 py-3 text-foreground outline-none placeholder:text-gray-400"
        />
        
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              type="button"
              onClick={handleClear}
              className="flex-shrink-0 mr-2 p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors duration-200"
            >
              <ClearIcon size={16} />
            </motion.button>
          )}
        </AnimatePresence>
        
        <button 
          type="submit"
          className={cn(
            "h-full px-5 py-3 font-medium text-white transition-all duration-300",
            query.trim() 
              ? "bg-primary hover:bg-primary/90" 
              : "bg-gray-300 cursor-not-allowed"
          )}
          disabled={!query.trim()}
        >
          Search
        </button>
      </div>
    </motion.form>
  );
};

export default SearchBar;
