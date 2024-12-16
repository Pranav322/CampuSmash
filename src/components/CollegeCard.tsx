import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import type { College } from '../types';

interface CollegeCardProps {
  college: College;
  onClick?: () => void;
  isAnimating?: boolean;
}

export const CollegeCard: React.FC<CollegeCardProps> = ({ 
  college, 
  onClick, 
  isAnimating 
}) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow h-full"
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      animate={isAnimating ? { rotate: 360 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center space-y-4 h-full">
        <div className="aspect-square w-full max-w-[200px] relative bg-white rounded-lg flex items-center justify-center p-4">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          )}
          <img
            src={college.logoUrl}
            alt={`${college.name} logo`}
            className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setImageLoading(false)}
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = '/placeholder-logo.png';
              setImageLoading(false);
            }}
          />
        </div>
        <div className="text-center flex-grow flex flex-col justify-between">
          <h3 className="font-semibold text-lg mb-3 line-clamp-2 min-h-[3.5rem]">
            {college.name}
          </h3>
          <span className="inline-flex items-center bg-yellow-100 px-3 py-1.5 rounded-full text-yellow-800">
            <Trophy className="w-4 h-4 mr-1.5" />
            Rating: {Math.round(college.eloRating)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};