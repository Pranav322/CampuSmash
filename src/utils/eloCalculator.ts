const K_FACTOR = 32; // Standard K-factor used in Elo calculations

export const calculateNewRatings = (
  winnerRating: number,
  loserRating: number
): [number, number] => {
  const expectedScoreWinner =
    1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
  const expectedScoreLoser = 1 - expectedScoreWinner;

  const newWinnerRating = Math.round(winnerRating + K_FACTOR * (1 - expectedScoreWinner));
  const newLoserRating = Math.round(loserRating + K_FACTOR * (0 - expectedScoreLoser));

  return [newWinnerRating, newLoserRating];
};