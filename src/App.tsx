import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { College, Review } from './types';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { ComparePage } from './pages/ComparePage';
import { ReviewPage } from './pages/ReviewPage';
import { SignedIn, RedirectToSignIn, SignedOut } from '@clerk/clerk-react';

function App() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        setLoading(true);
        const collegesCollection = collection(db, 'colleges');
        const collegesSnapshot = await getDocs(collegesCollection);
        const loadedColleges = collegesSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data['College Name'],
            logoUrl: data['Logo URL'],
            eloRating: data['eloRating'] || 1500, // Use existing rating if available
            details: {
              location: data['City'] + ', ' + data['State'],
              established: data['Established Year'],
              type: data['College Type'],
              rating: data['Rating'],
              facilities: data['Facilities']?.split(', ') || [],
              courses: data['Courses']?.split(', ') || [],
              averageFees: data['Average Fees'],
              totalFaculty: data['Total Faculty'],
              totalEnrollments: data['Total Student Enrollments'],
              campusSize: data['Campus Size'],
              gendersAccepted: data['Genders Accepted']
            }
          };
        });
        setColleges(loadedColleges);
        setError(null);
      } catch (err) {
        console.error('Error fetching colleges:', err);
        setError('Failed to load colleges. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  const handleVote = async (winner: College, loser: College, newRatings: [number, number]) => {
    try {
      // Update local state
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

      // Update Firebase
      const winnerRef = doc(db, 'colleges', winner.id);
      const loserRef = doc(db, 'colleges', loser.id);

      // Update both documents in parallel
      await Promise.all([
        updateDoc(winnerRef, {
          eloRating: newRatings[0]
        }),
        updateDoc(loserRef, {
          eloRating: newRatings[1]
        })
      ]);

    } catch (err) {
      console.error('Error updating ratings:', err);
      // Optionally show an error message to the user
      setError('Failed to update ratings. Please try again.');
      
      // Revert the local state if the Firebase update fails
      setColleges((prev) =>
        prev.map((college) => {
          if (college.id === winner.id) {
            return { ...college, eloRating: winner.eloRating };
          }
          if (college.id === loser.id) {
            return { ...college, eloRating: loser.eloRating };
          }
          return college;
        })
      );
    }
  };

  const handleReview = async (collegeId: string, review: { rating: number; content: string }) => {
    const newReview: Review = {
      id: Date.now().toString(),
      collegeId,
      author: 'Anonymous', // You might want to get this from Clerk user
      rating: review.rating,
      content: review.content,
      date: new Date().toISOString(),
    };

    try {
      // Add review to Firebase
      // You might want to create a separate collection for reviews
      const reviewsCollection = collection(db, 'reviews');
      // Add code here to save review to Firebase
      
      // Update local state only after successful Firebase update
      setReviews((prev) => [...prev, newReview]);
    } catch (err) {
      console.error('Error saving review:', err);
      setError('Failed to save review. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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