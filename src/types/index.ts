// src/types/index.ts
export interface CollegeDetails {
  location: string;
  established: number;
  type: string;
  rating: number;
  facilities: string[];
  courses: string[];
  averageFees: number;
  totalFaculty: number;
  totalEnrollments: number;
  campusSize: string;
  gendersAccepted: string;
}

export interface College {
  id: string;
  name: string;
  logoUrl: string;
  eloRating: number;
  details: CollegeDetails;
}

// src/types/index.ts
export interface Review {
  id: string;
  collegeId: string;
  authorId: string;
  authorName: string;
  rating: number;
  content: string;
  date: string;
}

export interface MatchHistory {
  id: string;
  winnerId: string;
  loserId: string;
  winnerName: string;
  loserName: string;
  date: string;
}

export interface CollegeStats {
  totalMatches: number;
  wins: number;
  losses: number;
  averageRating: number;
}