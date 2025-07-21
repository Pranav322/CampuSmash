import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, MapPin, Calendar, Users, DollarSign, GraduationCap, Building } from 'lucide-react';
import type { College } from '../types';

interface CompareCollegeCardProps {
  college: College;
  onClick?: () => void;
  isAnimating?: boolean;
}

export const CompareCollegeCard: React.FC<CompareCollegeCardProps> = ({ 
  college, 
  onClick, 
  isAnimating 
}) => {
  const [imageLoading, setImageLoading] = useState(true);

  const formatFees = (fees: number) => {
    if (fees >= 100000) {
      return `₹${(fees / 100000).toFixed(1)}L`;
    }
    return `₹${(fees / 1000).toFixed(0)}K`;
  };

  const formatEnrollment = (enrollment: number) => {
    if (enrollment >= 1000) {
      return `${(enrollment / 1000).toFixed(1)}K`;
    }
    return enrollment.toString();
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 h-full border border-gray-100"
      whileHover={{ scale: 1.02, y: -5 }}
      onClick={onClick}
      animate={isAnimating ? { rotate: 360 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col h-full">
        {/* College Logo and Name */}
        <div className="flex flex-col items-center mb-4">
          <div className="aspect-square w-20 h-20 relative bg-gray-50 rounded-lg flex items-center justify-center p-2 mb-3">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
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
          <h3 className="font-bold text-lg text-center text-gray-900 line-clamp-2 min-h-[3rem]">
            {college.name}
          </h3>
        </div>

        {/* ELO Rating */}
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-yellow-500 px-3 py-1.5 rounded-full text-yellow-900 font-semibold text-sm">
            <Trophy className="w-4 h-4 mr-1.5" />
            {Math.round(college.eloRating)} ELO
          </span>
        </div>

        {/* College Details */}
        <div className="space-y-3 flex-grow">
          {/* Location */}
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
            <span className="truncate">{college.details.location}</span>
          </div>

          {/* Established Year */}
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
            <span>Est. {college.details.established}</span>
          </div>

          {/* College Type */}
          <div className="flex items-center text-sm text-gray-600">
            <Building className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0" />
            <span className="truncate">{college.details.type}</span>
          </div>

          {/* Average Fees */}
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="w-4 h-4 mr-2 text-red-500 flex-shrink-0" />
            <span>Fees: {formatFees(college.details.averageFees)}</span>
          </div>

          {/* Total Enrollments */}
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2 text-indigo-500 flex-shrink-0" />
            <span>Students: {formatEnrollment(college.details.totalEnrollments)}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center text-sm text-gray-600">
            <GraduationCap className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" />
            <span>Rating: {college.details.rating}/5</span>
          </div>
        </div>

        {/* Top Courses (if available) */}
        {college.details.courses && college.details.courses.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-2">Popular Courses:</p>
            <div className="flex flex-wrap gap-1">
              {college.details.courses.slice(0, 3).map((course, index) => (
                <span 
                  key={index}
                  className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md"
                >
                  {course.length > 12 ? `${course.substring(0, 12)}...` : course}
                </span>
              ))}
              {college.details.courses.length > 3 && (
                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
                  +{college.details.courses.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
