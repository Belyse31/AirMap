import { Search, X } from 'lucide-react';
import { useState } from 'react';

export function SearchBar({ 
  placeholder = 'Search...', 
  value, 
  onChange, 
  onClear,
  className = '' 
}) {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChange('');
    if (onClear) onClear();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className={`w-5 h-5 ${isFocused ? 'text-primary-500' : 'text-gray-400'}`} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        aria-label={placeholder}
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
