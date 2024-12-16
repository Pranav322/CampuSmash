import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, ChevronDown, Trophy } from 'lucide-react';
import type { College } from '../types';
import { calculateNewRatings } from '../utils/eloCalculator';
import { CollegeCard } from '../components/CollegeCard';

interface ComparePageProps {
  colleges: College[];
  onVote: (winner: College, loser: College, newRatings: [number, number]) => void;
}

export const ComparePage: React.FC<ComparePageProps> = ({ colleges, onVote }) => {
  const [pair, setPair] = useState<[College, College] | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<College | null>(null);
  const [spinningColleges, setSpinningColleges] = useState<College[]>([]);

  const getRandomPair = () => {
    const shuffled = [...colleges].sort(() => Math.random() - 0.5);
    return [shuffled[0], shuffled[1]] as [College, College];
  };

  const generateSpinningColleges = () => {
    const spinSequence = Array(15).fill(null).map(() => 
      colleges[Math.floor(Math.random() * colleges.length)]
    );
    const nextPair = getRandomPair();
    spinSequence.push(nextPair[0], nextPair[1]);
    return { spinSequence, nextPair };
  };

  const handleVote = (selectedCollege: College) => {
    if (!pair) return;
    
    const otherCollege = pair[0] === selectedCollege ? pair[1] : pair[0];
    const newRatings = calculateNewRatings(selectedCollege.eloRating, otherCollege.eloRating);
    
    setWinner(selectedCollege);
    setIsSpinning(true);
    
    const { spinSequence, nextPair } = generateSpinningColleges();
    setSpinningColleges(spinSequence);
    
    onVote(selectedCollege, otherCollege, newRatings);
    
    setTimeout(() => {
      setWinner(null);
      setPair(nextPair);
      setIsSpinning(false);
    }, 2000);
  };

  useEffect(() => {
    setPair(getRandomPair());
  }, []);

  if (!pair) return null;

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-blue-900 mb-4">College Face-off</h2>
        <div className="flex items-center justify-center gap-2 text-blue-600">
          <ChevronDown className="animate-bounce w-5 h-5" />
          <p className="text-lg">Choose your preferred college below</p>
          <ChevronDown className="animate-bounce w-5 h-5" />
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Left College */}
        <div className="w-full md:w-5/12 relative">
          <div className="h-[450px] perspective-1000">
            <AnimatePresence>
              {isSpinning ? (
                <div className="absolute w-full overflow-hidden rounded-xl shadow-2xl">
                  {spinningColleges.map((college, index) => (
                    <motion.div
                      key={`left-${index}`}
                      className="absolute w-full"
                      initial={{ y: '100%', rotateX: -15 }}
                      animate={{ y: '-100%', rotateX: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: index * 0.1,
                        ease: "easeInOut"
                      }}
                    >
                      <CollegeCard college={college} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer transform transition-transform duration-200 hover:shadow-xl rounded-xl"
                  onClick={() => handleVote(pair[0])}
                >
                  <CollegeCard college={pair[0]} />
                  {winner === pair[0] && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full"
                    >
                      <Trophy className="w-6 h-6" />
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* VS Symbol */}
        <div className="w-full md:w-2/12 flex justify-center items-center">
          <motion.div
            animate={isSpinning ? {
              rotate: 360,
              scale: [1, 1.2, 1],
            } : {}}
            transition={{
              duration: 0.5,
              repeat: isSpinning ? 3 : 0,
              ease: "easeInOut"
            }}
            className="bg-blue-100 p-6 rounded-full shadow-lg"
          >
            <Swords className="w-16 h-16 text-blue-600" />
          </motion.div>
        </div>

        {/* Right College */}
        <div className="w-full md:w-5/12 relative">
          <div className="h-[450px] perspective-1000">
            <AnimatePresence>
              {isSpinning ? (
                <div className="absolute w-full overflow-hidden rounded-xl shadow-2xl">
                  {spinningColleges.map((college, index) => (
                    <motion.div
                      key={`right-${index}`}
                      className="absolute w-full"
                      initial={{ y: '100%', rotateX: -15 }}
                      animate={{ y: '-100%', rotateX: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: index * 0.1,
                        ease: "easeInOut"
                      }}
                    >
                      <CollegeCard college={college} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer transform transition-transform duration-200 hover:shadow-xl rounded-xl"
                  onClick={() => handleVote(pair[1])}
                >
                  <CollegeCard college={pair[1]} />
                  {winner === pair[1] && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full"
                    >
                      <Trophy className="w-6 h-6" />
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <motion.div 
        className="mt-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-lg text-blue-700 font-medium">
          Click on a college card to cast your vote!
        </p>
      </motion.div>
    </div>
  );
};

export default ComparePage;