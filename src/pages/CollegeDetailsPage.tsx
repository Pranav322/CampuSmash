// src/pages/CollegeDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Review, MatchHistory, CollegeStats, College } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const CollegeDetailPage: React.FC = () => {
  const { collegeId } = useParams();
  const { user } = useAuth();
  const [college, setCollege] = useState<College | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [matchHistory, setMatchHistory] = useState<MatchHistory[]>([]);
  const [stats, setStats] = useState<CollegeStats | null>(null);

  useEffect(() => {
    const fetchCollegeData = async () => {
      try {
        // Fetch college details
        const collegeDoc = await getDoc(doc(db, 'colleges', collegeId!));
        setCollege(collegeDoc.data() as College);

        // Fetch reviews
        const reviewsQuery = query(
          collection(db, 'reviews'),
          where('collegeId', '==', collegeId)
        );
        const reviewsSnapshot = await getDocs(reviewsQuery);
        const reviewsData = reviewsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Review[];
        setReviews(reviewsData);

        // Fetch match history
        const matchesQuery = query(
          collection(db, 'matches'),
          where('winnerId', '==', collegeId)
        );
        const losesQuery = query(
          collection(db, 'matches'),
          where('loserId', '==', collegeId)
        );
        
        const [winsSnapshot, losesSnapshot] = await Promise.all([
          getDocs(matchesQuery),
          getDocs(losesQuery)
        ]);

        const wins = winsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        const losses = losesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setMatchHistory([...wins, ...losses]);

        // Calculate stats
        const totalMatches = wins.length + losses.length;
        const averageRating = reviewsData.reduce((acc, review) => acc + review.rating, 0) / reviewsData.length;

        setStats({
          totalMatches,
          wins: wins.length,
          losses: losses.length,
          averageRating: averageRating || 0
        });

      } catch (error) {
        console.error('Error fetching college data:', error);
      }
    };

    if (collegeId) {
      fetchCollegeData();
    }
  }, [collegeId]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {college && (
        <>
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center gap-6">
              <img 
                src={college.logoUrl || college['Logo URL']}
                alt={college.name}
                className="w-32 h-32 object-contain"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = '/placeholder-logo.png';
                }}
              />
              <div>
                <h1 className="text-3xl font-bold mb-2">{college.name}</h1>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">ELO Rating</p>
                    <p className="font-semibold">{Math.round(college.eloRating)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">User Rating</p>
                    <p className="font-semibold">{stats?.averageRating.toFixed(1)} / 5</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Stats Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Battle Statistics</h2>
              {stats && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Total Matches</p>
                    <p className="font-semibold">{stats.totalMatches}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Win Rate</p>
                    <p className="font-semibold">
                      {((stats.wins / stats.totalMatches) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Wins</p>
                    <p className="font-semibold text-green-600">{stats.wins}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Losses</p>
                    <p className="font-semibold text-red-600">{stats.losses}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Reviews</h2>
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.id} className="border-b pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{review.authorName}</p>
                        <p className="text-gray-600">
                          {new Date(review.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-500">{review.rating}/5</span>
                      </div>
                    </div>
                    <p className="mt-2">{review.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Match History */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Recent Matches</h2>
            <div className="space-y-4">
              {matchHistory.map(match => (
                <div key={match.id} className="flex justify-between items-center border-b pb-4">
                  <div className="flex items-center gap-4">
                    <span className={match.winnerId === collegeId ? 'text-green-600' : 'text-red-600'}>
                      {match.winnerId === collegeId ? 'Won against' : 'Lost to'}
                    </span>
                    <span className="font-semibold">
                      {match.winnerId === collegeId ? match.loserName : match.winnerName}
                    </span>
                  </div>
                  <span className="text-gray-600">
                    {new Date(match.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};