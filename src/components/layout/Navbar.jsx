import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

const Navbar = () => {
  const { currentUser } = useUser();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-primary-700' : '';
  };

  return (
    <nav className="bg-primary-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold">
            Python Education
          </Link>

          {currentUser && (
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-md hover:bg-primary-700 transition-colors ${isActive('/dashboard')}`}
              >
                Dashboard
              </Link>
              <Link
                to="/exercises"
                className={`px-3 py-2 rounded-md hover:bg-primary-700 transition-colors ${isActive('/exercises')}`}
              >
                Exercices
              </Link>
              <Link
                to="/progression"
                className={`px-3 py-2 rounded-md hover:bg-primary-700 transition-colors ${isActive('/progression')}`}
              >
                Progression
              </Link>
              <Link
                to="/badges"
                className={`px-3 py-2 rounded-md hover:bg-primary-700 transition-colors ${isActive('/badges')}`}
              >
                Badges
              </Link>
              <Link
                to="/leaderboard"
                className={`px-3 py-2 rounded-md hover:bg-primary-700 transition-colors ${isActive('/leaderboard')}`}
              >
                Classement
              </Link>
              
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-primary-500">
                <div className="text-sm">
                  <div className="font-medium">{currentUser.nom}</div>
                  <div className="text-primary-200">Niveau {currentUser.niveau || 1}</div>
                </div>
                <Link
                  to="/profile"
                  className="w-10 h-10 bg-primary-700 rounded-full flex items-center justify-center hover:bg-primary-800 transition-colors"
                >
                  {currentUser.nom.charAt(0).toUpperCase()}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
