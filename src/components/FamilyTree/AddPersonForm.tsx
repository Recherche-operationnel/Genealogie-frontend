import React, { useState } from 'react';
import { PersonNode } from '../../types/FamilyTypes';

interface AddPersonFormProps {
  onAddPerson: (person: PersonNode) => void;
  onCancel: () => void;
  initialData?: PersonNode;
  isEditMode?: boolean;
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
      id: Date.now() // ID temporaire basé sur timestamp
    };
    onAddPerson(newPerson);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, photo: file });
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-blue-100">
      <h3 className="text-lg font-semibold mb-4">Ajouter une personne</h3>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom complet</label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Genre</label>
            <select
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value as "M" | "F" })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            >
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
            <input
              type="date"
              value={formData.dateNaissance}
              onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
            <div className="flex items-center space-x-4">
              <img 
                src={formData.photo} 
                alt="Aperçu" 
                className="w-20 h-20 rounded-full object-cover border shadow"
              />
              <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-md shadow-sm hover:bg-blue-200 transition">
                📁 Choisir une image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Détails</label>
            <textarea
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md shadow hover:bg-green-700"
            >
              Ajouter la personne
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
