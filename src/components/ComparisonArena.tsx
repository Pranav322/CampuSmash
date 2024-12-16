import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swords } from 'lucide-react';
import { College } from '../types';
import { CollegeCard } from './CollegeCard';

interface ComparisonArenaProps {
  colleges: College[];
  onVote: (winner: College, loser: College) => void;
}

export const ComparisonArena: React.FC<ComparisonArenaProps> = ({ colleges, onVote }) => {
  const [pair, setPair] = useState<[College, College] | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const getRandomPair = () => {
    if (colleges.length < 2) return null;
    const shuffled = [...colleges].sort(() => Math.random() - 0.5);
    return [shuffled[0], shuffled[1]] as [College, College];
  };

  const handleVote = (winner: College) => {
    if (!pair) return;
    const loser = pair[0] === winner ? pair[1] : pair[0];
    onVote(winner, loser);
    setIsSpinning(true);
    setTimeout(() => {
      setPair(getRandomPair());
      setIsSpinning(false);
    }, 1000);
  };

  useEffect(() => {
    if (colleges.length >= 2) {
      setPair(getRandomPair());
    }
  }, [colleges]);

  if (!pair) return <div className="text-center">Not enough colleges to compare.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">College Face-off</h2>
        <p className="text-gray-600">Which college would you choose?</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <CollegeCard 
          college={pair[0]} 
          onClick={() => handleVote(pair[0])}
          isAnimating={isSpinning}
        />
        <div className="flex justify-center">
          <motion.div
            animate={{ rotate: isSpinning ? 360 : 0 }}
            transition={{ duration: 0.8 }}
          >
            <Swords className="w-12 h-12 text-gray-400" />
          </motion.div>
        </div>
        <CollegeCard 
          college={pair[1]} 
          onClick={() => handleVote(pair[1])}
          isAnimating={isSpinning}
        />
      </div>
    </div>
  );
};