import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Papa from 'papaparse';
import type { College, Review } from './types';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { ComparePage } from './pages/ComparePage';
import { ReviewPage } from './pages/ReviewPage';
import { SignedIn, RedirectToSignIn } from '@clerk/clerk-react';
import { SignedOut } from '@clerk/clerk-react';
function App() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch('/src/data/cleaned_file.csv')
      .then((response) => response.text())
      .then((csv) => {
        const results = Papa.parse(csv, { header: true });
        const loadedColleges = results.data.map((college: any, index: number) => ({
          id: (index + 1).toString(),
          name: college['College Name'],
          logoUrl: college['Logo URL'],
          eloRating: parseInt(college['ELO Rating']) || 1500,
        }));
        setColleges(loadedColleges);
      });
  }, []);

  const handleVote = (winner: College, loser: College, newRatings: [number, number]) => {
    setColleges((prev) =>
      prev.map((college) => {
        if (college.id === winner.id) {
          return { ...college, eloRating: newRatings[0] };
        }
        if (college.id === loser.id) {
          return { ...college, eloRating: newRatings[1] };
        }
        return college;
      })
    );
  };

  const handleReview = (collegeId: string, review: { rating: number; content: string }) => {
    const newReview: Review = {
      id: Date.now().toString(),
      collegeId,
      author: 'Anonymous',
      rating: review.rating,
      content: review.content,
      date: new Date().toISOString(),
    };
    setReviews([...reviews, newReview]);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 px-4">
          <Routes>
            <Route path="/" element={<HomePage colleges={colleges} />} />
            <Route
              path="/compare"
              element={
                <>
                  <SignedIn>
                    <ComparePage colleges={colleges} onVote={handleVote} />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/reviews"
              element={
                <>
                  <SignedIn>
                    <ReviewPage colleges={colleges} onSubmitReview={handleReview} />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;