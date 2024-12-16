import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import type { College } from '../types';

interface CollegeCardProps {
  college: College;
  onClick?: () => void;
}

export const CollegeCard: React.FC<CollegeCardProps> = ({ college, onClick }) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all h-full"
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
    >
      <div className="relative h-48">
        <img
          src={college.logoUrl}
          alt={`${college.name} logo`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800">{college.name}</h3>
        <div className="flex items-center mt-2">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className="ml-1 text-sm text-gray-600">
            Rating: {Math.round(college.eloRating)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};