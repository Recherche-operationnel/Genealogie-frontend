import React, { useState } from 'react';
import { PersonNode } from '../../types/FamilyTypes';

interface AddSpouseFormPropS {
  existingPerson: PersonNode;
  allNodes: PersonNode[];
  onAddSpouse: (spouse: PersonNode, existingPersonId: number, isExisting: boolean) => void;
  onCancel: () => void;
}

export const AddSpouseForm: React.FC<AddSpouseFormPropS> = ({
  existingPerson,
  allNodes,
  onAddSpouse,
  onCancel
}) => {
  const [mode, setMode] = useState<'new' | 'existing'>('new');
  const [spouseData, setSpouseData] = useState<Omit<PersonNode, 'id'>>({
    nom: '',
    genre: existingPerson.genre === 'M' ? 'F' : 'M',
    dateNaissance: '',
    photo: 'https://placekitten.com/200/200',
    details: ''
  });
  const [selectedSpouseId, setSelectedSpouseId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'new') {
      const newSpouse: PersonNode = {
        ...spouseData,
        id: Date.now() // Temp ID
      };
      onAddSpouse(newSpouse, existingPerson.id, false);
    } else if (selectedSpouseId !== null) {
      const existingSpouse = allNodes.find(n => n.id === selectedSpouseId);
      if (existingSpouse) {
        onAddSpouse(existingSpouse, existingPerson.id, true);
      }
    }
  };

  // Liste des personnes compatibles pour être conjoint (genre opposé et non déjà lié)
  const potentialSpouses = allNodes.filter(p => 
    p.id !== existingPerson.id &&
    p.genre !== existingPerson.genre
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
      <h3 className="text-xl font-semibold mb-4">
        Ajouter un conjoint à {existingPerson.nom}
      </h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Méthode</label>
        <div className="flex gap-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="mode"
              value="new"
              checked={mode === 'new'}
              onChange={() => setMode('new')}
              className="mr-2"
            />
            Nouveau conjoint
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="mode"
              value="existing"
              checked={mode === 'existing'}
              onChange={() => setMode('existing')}
              className="mr-2"
            />
            Personne existante
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {mode === 'new' ? (
          <div className="space-y-4">
            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom complet</label>
              <input
                type="text"
                value={spouseData.nom}
                onChange={(e) => setSpouseData({...spouseData, nom: e.target.value})}
                className="mt-1 block w-full border rounded-md px-3 py-2"
                required
              />
            </div>

            {/* Genre + Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Genre</label>
                <select
                  value={spouseData.genre}
                  onChange={(e) => setSpouseData({...spouseData, genre: e.target.value as "M" | "F"})}
                  className="mt-1 block w-full border rounded-md px-3 py-2"
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
                  className="mt-1 block w-full border rounded-md px-3 py-2"
                />
              </div>
            </div>

            {/* Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Photo</label>
              <div className="flex items-center gap-4">
                {spouseData.photo && (
                  <img src={spouseData.photo} alt="Preview" className="w-20 h-20 rounded-full object-cover" />
                )}
                <label className="cursor-pointer text-blue-600">
                  📁 Choisir une image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setSpouseData({...spouseData, photo: url});
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Détails */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Détails</label>
              <textarea
                value={spouseData.details}
                onChange={(e) => setSpouseData({...spouseData, details: e.target.value})}
                rows={3}
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Sélectionner une personne</label>
            <select
              value={selectedSpouseId ?? ''}
              onChange={(e) => setSelectedSpouseId(Number(e.target.value))}
              className="mt-1 block w-full border rounded-md px-3 py-2"
              required
            >
              <option value="">-- Choisir --</option>
              {potentialSpouses.map(p => (
                <option key={p.id} value={p.id}>{p.nom} ({p.genre})</option>
              ))}
            </select>
          </div>
        )}

        {/* Boutons */}
        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md text-sm text-white bg-purple-600 hover:bg-purple-700"
          >
            Ajouter le conjoint
          </button>
        </div>
      </form>
    </div>
  );
};
