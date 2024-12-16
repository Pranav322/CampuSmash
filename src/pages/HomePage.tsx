import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import type { College } from '../types';
import { Pagination } from '../components/Pagination';

interface HomePageProps {
  colleges: College[];
}

export const HomePage: React.FC<HomePageProps> = ({ colleges }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(colleges.length / itemsPerPage);

  const sortedColleges = [...colleges].sort((a, b) => b.eloRating - a.eloRating);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedColleges = sortedColleges.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">College Rankings</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        {displayedColleges.map((college, index) => (
          <div
            key={college.id}
            className="flex items-center justify-between py-4 border-b last:border-0"
          >
            <div className="flex items-center">
              <span className="text-2xl font-bold mr-4 w-8">
                {startIndex + index + 1}
              </span>
              <img
                src={college.logoUrl}
                alt={college.name}
                className="w-12 h-12 object-cover rounded-full mr-4"
              />
              <span className="font-medium">{college.name}</span>
            </div>
            <div className="flex items-center">
              <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
              <span>{Math.round(college.eloRating)}</span>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};