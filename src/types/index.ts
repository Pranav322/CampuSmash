export interface College {
  id: string;
  name: string;
  logoUrl: string;
  eloRating: number;
}

export interface Review {
  id: string;
  collegeId: string;
  author: string;
  rating: number;
  content: string;
  date: string;
}