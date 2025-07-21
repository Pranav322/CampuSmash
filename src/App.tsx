import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { College, Review } from './types';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { ComparePage } from './pages/ComparePage';
import { ReviewPage } from './pages/ReviewPage';
import { CollegeDetailPage } from './pages/CollegeDetailsPage';
import { useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
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
      // Update ratings
      const winnerRef = doc(db, 'colleges', winner.id);
      const loserRef = doc(db, 'colleges', loser.id);

      // Create match history
      const matchRef = collection(db, 'matches');
      
      await Promise.all([
        updateDoc(winnerRef, { eloRating: newRatings[0] }),
        updateDoc(loserRef, { eloRating: newRatings[1] }),
        addDoc(matchRef, {
          winnerId: winner.id,
          loserId: loser.id,
          winnerName: winner.name,
          loserName: loser.name,
          date: new Date().toISOString()
        })
      ]);

      // Update local state
      setColleges(prev =>
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
    } catch (error) {
      console.error('Error updating match data:', error);
    }
  };

  const handleReview = async (collegeId: string, review: { rating: number; content: string }) => {
    const { user } = useAuth();
    const newReview: Review = {
      id: Date.now().toString(),
      collegeId,
      authorId: user?.uid || 'anonymous',
      authorName: 'Anonymous User',
      rating: review.rating,
      content: review.content,
      date: new Date().toISOString(),
    };

    try {
      // Add review to Firebase
      await addDoc(collection(db, 'reviews'), newReview);

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
                <ProtectedRoute>
                  <ComparePage colleges={colleges} onVote={handleVote} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reviews"
              element={
                <ProtectedRoute>
                  <ReviewPage colleges={colleges} onSubmitReview={handleReview} />
                </ProtectedRoute>
              }
            />
            <Route path="/college/:collegeId" element={<CollegeDetailPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;