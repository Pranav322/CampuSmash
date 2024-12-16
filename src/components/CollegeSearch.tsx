import React, { useState } from 'react';
import { Search } from 'lucide-react';
import type { College } from '../types';

interface CollegeSearchProps {
  colleges: College[];
  onSelect: (college: College) => void;
}

export const CollegeSearch: React.FC<CollegeSearchProps> = ({ colleges, onSelect }) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<College[]>([]);

  const handleSearch = (query: string) => {
    setSearch(query);
    const filtered = colleges.filter(college =>
      college.name.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  };

  const handleSelect = (college: College) => {
    onSelect(college);
    setSearch('');
    setResults([]);
  };

  return (
    <div className="w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search for a college..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {search && results.length > 0 && (
        <div className="mt-2 bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
          {results.map(college => (
            <button
              key={college.id}
              onClick={() => handleSelect(college)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100"
            >
              {college.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};