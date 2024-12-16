import React, { useState } from 'react';
import type { College } from '../types';
import { CollegeSearch } from '../components/CollegeSearch';
import { ReviewForm } from '../components/ReviewForm';

interface ReviewPageProps {
  colleges: College[];
  onSubmitReview: (collegeId: string, review: { rating: number; content: string }) => void;
}

export const ReviewPage: React.FC<ReviewPageProps> = ({ colleges, onSubmitReview }) => {
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Write a Review</h1>
      
      <div className="mb-8">
        <CollegeSearch
          colleges={colleges}
          onSelect={setSelectedCollege}
        />
      </div>

      {selectedCollege && (
        <div>
          <div className="mb-6 flex items-center">
            <img
              src={selectedCollege.logoUrl}
              alt={selectedCollege.name}
              className="w-16 h-16 object-cover rounded-full mr-4"
            />
            <h2 className="text-xl font-bold">{selectedCollege.name}</h2>
          </div>
          
          <ReviewForm
            collegeId={selectedCollege.id}
            onSubmit={(review) => onSubmitReview(selectedCollege.id, review)}
          />
        </div>
      )}
    </div>
  );
};