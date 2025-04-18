import React, { useState } from 'react';
import { PersonNode } from '../../types/FamilyTypes';

interface AddSpouseFormProps {
  existingPerson: PersonNode;
  onAddSpouse: (spouse: PersonNode, existingPersonId: number) => void;
  onCancel: () => void;
}

export const AddSpouseForm: React.FC<AddSpouseFormProps> = ({ 
  existingPerson, 
  onAddSpouse, 
  onCancel 
}) => {
  const [spouseData, setSpouseData] = useState<Omit<PersonNode, 'key'>>({
    nom: '',
    genre: existingPerson.genre === 'M' ? 'F' : 'M', // Genre opposé par défaut
    dateNaissance: '',
    photo: 'https://placekitten.com/200/200',
    details: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSpouse: PersonNode = {
      ...spouseData,
      key: Date.now() // ID temporaire
    };
    onAddSpouse(newSpouse, existingPerson.key);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
      <h3 className="text-xl font-semibold mb-4">
        Ajouter un conjoint à {existingPerson.nom}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom complet</label>
            <input
              type="text"
              value={spouseData.nom}
              onChange={(e) => setSpouseData({...spouseData, nom: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Genre</label>
              <select
                value={spouseData.genre}
                onChange={(e) => setSpouseData({...spouseData, genre: e.target.value as "M" | "F"})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
              <input
                type="date"
                value={spouseData.dateNaissance}
                onChange={(e) => setSpouseData({...spouseData, dateNaissance: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Photo (URL)</label>
            <input
              type="text"
              value={spouseData.photo}
              onChange={(e) => setSpouseData({...spouseData, photo: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Détails</label>
            <textarea
              value={spouseData.details}
              onChange={(e) => setSpouseData({...spouseData, details: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Ajouter le conjoint
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};