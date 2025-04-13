import React from 'react';
import { Link } from 'react-router-dom';
import { FaTree, FaUserPlus, FaSignInAlt } from 'react-icons/fa';

function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 text-emerald-600">
              <FaTree className="text-2xl" />
              <span className="text-xl font-bold">Arbre Généalogique</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/connexion"
              className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md transition duration-150"
            >
              <FaSignInAlt />
              <span>Connexion</span>
            </Link>
            <Link
              to="/inscription"
              className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition duration-150"
            >
              <FaUserPlus />
              <span>S'inscrire</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;