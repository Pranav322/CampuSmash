import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, GraduationCap, PenLine, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, signInAnonymous, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="flex items-center text-gray-700 hover:text-blue-500"
            >
              <Home className="w-5 h-5 mr-2" />
              Home
            </Link>
            {isAuthenticated && (
              <>
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
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-500"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          
          {/* Auth Buttons */}
          <div className="flex items-center">
            {!isAuthenticated ? (
              <button
                onClick={signInAnonymous}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Sign In Anonymously
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-500"
                >
                  <User className="w-8 h-8 p-1 bg-gray-200 rounded-full" />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      Anonymous User
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <Link
              to="/"
              className="block py-2 text-gray-700 hover:text-blue-500"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <Home className="w-5 h-5 mr-2" />
                Home
              </div>
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/compare"
                  className="block py-2 text-gray-700 hover:text-blue-500"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Compare
                  </div>
                </Link>
                <Link
                  to="/reviews"
                  className="block py-2 text-gray-700 hover:text-blue-500"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center">
                    <PenLine className="w-5 h-5 mr-2" />
                    Write Review
                  </div>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};