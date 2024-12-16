// src/pages/HomePage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import type { College } from '../types';
import { CollegeCard } from '../components/CollegeCard';
import { Pagination } from '../components/Pagination';
export const HomePage: React.FC<{ colleges: College[] }> = ({ colleges }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedColleges = [...filteredColleges].sort((a, b) => b.eloRating - a.eloRating);
  
  const currentColleges = sortedColleges.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search colleges..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentColleges.map((college) => (
          <Link key={college.id} to={`/college/${college.id}`}>
            <CollegeCard college={college} />
          </Link>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(sortedColleges.length / itemsPerPage)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};