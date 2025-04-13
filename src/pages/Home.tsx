import React from 'react';
import { Link } from 'react-router-dom';
import { FaTree, FaHistory, FaShare, FaProjectDiagram } from 'react-icons/fa';

function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <FaTree className="text-6xl text-emerald-600" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Créez votre arbre généalogique familial
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Construisez, visualisez et partagez votre histoire familiale avec une interface moderne et intuitive
        </p>
        <Link
          to="/creer-arbre"
          className="inline-flex items-center space-x-3 bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-emerald-700 transition duration-150 shadow-lg"
        >
          <FaTree className="text-xl" />
          <span>Créer un arbre</span>
        </Link>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-4">
            <FaHistory className="text-2xl text-emerald-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Préservez l'histoire</h3>
          <p className="text-gray-600">
            Documentez et conservez précieusement l'histoire de votre famille pour les générations futures.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-4">
            <FaProjectDiagram className="text-2xl text-emerald-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Visualisation interactive</h3>
          <p className="text-gray-600">
            Explorez votre arbre généalogique de manière interactive avec notre interface intuitive.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-4">
            <FaShare className="text-2xl text-emerald-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Partagez facilement</h3>
          <p className="text-gray-600">
            Partagez votre arbre avec votre famille et collaborez pour enrichir votre histoire.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;