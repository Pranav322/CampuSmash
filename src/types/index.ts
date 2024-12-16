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

export interface Review {
  id: string;
  collegeId: string;
  author: string;
  rating: number;
  content: string;
  date: string;
}