import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import type { College } from '../types';
import { Pagination } from '../components/Pagination';
import { CollegeCard } from '../components/CollegeCard';

interface HomePageProps {
  colleges: College[];
}

export const HomePage: React.FC<HomePageProps> = ({ colleges }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(colleges.length / itemsPerPage);

  const sortedColleges = [...colleges].sort((a, b) => b.eloRating - a.eloRating);
  const currentColleges = sortedColleges.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        College Rankings
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr">
  {currentColleges.map((college) => (
    <CollegeCard key={college.id} college={college} />
  ))}
</div>
      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};