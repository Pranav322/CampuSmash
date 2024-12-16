import React from 'react';
import { Link } from 'react-router-dom';
import { Home, GraduationCap, PenLine } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link
              to="/"
              className="flex items-center text-gray-700 hover:text-blue-500"
            >
              <Home className="w-5 h-5 mr-2" />
              Home
            </Link>
            <SignedIn>
              <Link
                to="/compare"
                className="flex items-center text-gray-700 hover:text-blue-500"
              >
                <GraduationCap className="w-5 h-5 mr-2" />
                Compare
              </Link>
              <Link
                to="/reviews"
                className="flex items-center text-gray-700 hover:text-blue-500"
              >
                <PenLine className="w-5 h-5 mr-2" />
                Write Review
              </Link>
            </SignedIn>
          </div>
          
          <div className="flex items-center">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-10 h-10"
                  }
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
};