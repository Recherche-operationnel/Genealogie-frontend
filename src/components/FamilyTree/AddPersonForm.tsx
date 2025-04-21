import React, { useState } from 'react';
import { PersonNode, AddPersonHandler } from '../../types/FamilyTypes';


interface AddPersonFormProps {
  onAddPerson: (person: PersonNode) => void;
  onCancel: () => void;
}

export const AddPersonForm: React.FC<AddPersonFormProps> = ({ onAddPerson, onCancel }) => {
  const [formData, setFormData] = useState<Omit<PersonNode, 'id'>>({
    nom: '',
    genre: 'M',
    dateNaissance: '',
    photo: 'https://placekitten.com/200/200',
    details: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPerson: PersonNode = {
      ...formData,
      id: Date.now() // Utilisation du timestamp comme ID temporaire
    };
    onAddPerson(newPerson);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-blue-100">
      <h3 className="text-lg font-semibold mb-4">Ajouter une personne</h3>
      <form onSubmit={handleSubmit}>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom complet</label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({...formData, nom: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Genre</label>
            <select
              value={formData.genre}
              onChange={(e) => setFormData({...formData, genre: e.target.value as "M" | "F"})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
            <input
              type="text"
              value={formData.dateNaissance}
              onChange={(e) => setFormData({...formData, dateNaissance: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="AAAA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Détails</label>
            <textarea
              value={formData.details}
              onChange={(e) => setFormData({...formData, details: e.target.value})}
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
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ajouter
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};