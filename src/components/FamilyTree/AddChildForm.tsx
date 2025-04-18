import React, { useState } from 'react';
import { PersonNode, FamilyRelation } from '../../types/FamilyTypes';

interface AddChildFormProps {
  selectedParent: PersonNode;
  allNodes: PersonNode[];
  allLinks: FamilyRelation[];
  onAddChild: (child: PersonNode, parentIds: number[]) => void;
  onCancel: () => void;
}

export const AddChildForm: React.FC<AddChildFormProps> = ({ 
  selectedParent, 
  allNodes, 
  allLinks,
  onAddChild, 
  onCancel 
}) => {
  const [childData, setChildData] = useState<Omit<PersonNode, 'key'>>({
    nom: '',
    genre: 'M',
    dateNaissance: '',
    photo: 'https://placekitten.com/200/200',
    details: ''
  });

  const [selectedParents, setSelectedParents] = useState<number[]>([selectedParent.key]);

  // Trouver les personnes qui peuvent être parents
  const potentialParents = allNodes.filter(node => {
    return node.key !== selectedParent.key && 
           !allLinks.some(l => l.from === selectedParent.key && l.to === node.key);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newChild: PersonNode = {
      ...childData,
      key: Date.now()
    };
    onAddChild(newChild, selectedParents);
  };

  const handleParentSelect = (parentId: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedParents([...selectedParents, parentId]);
    } else {
      setSelectedParents(selectedParents.filter(id => id !== parentId));
    }
  };

  
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
      <h3 className="text-xl font-semibold mb-4">Ajouter un enfant</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Informations sur l'enfant</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom complet</label>
            <input
              type="text"
              value={childData.nom}
              onChange={(e) => setChildData({...childData, nom: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Genre</label>
              <select
                value={childData.genre}
                onChange={(e) => setChildData({...childData, genre: e.target.value as "M" | "F"})}
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
                value={childData.dateNaissance}
                onChange={(e) => setChildData({...childData, dateNaissance: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Photo (URL)</label>
            <input
              type="text"
              value={childData.photo}
              onChange={(e) => setChildData({...childData, photo: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Détails</label>
            <textarea
              value={childData.details}
              onChange={(e) => setChildData({...childData, details: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          <div className="pt-4">
            <h4 className="font-medium text-gray-700 mb-2">Parents</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto p-2 border rounded-md">
              {potentialParents.map(parent => (
                <div key={parent.key} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`parent-${parent.key}`}
                    checked={selectedParents.includes(parent.key)}
                    onChange={(e) => handleParentSelect(parent.key, e.target.checked)}
                    className="mr-2"
                    disabled={parent.key === selectedParent.key}
                  />
                  <label htmlFor={`parent-${parent.key}`} className="flex items-center">
                    <img 
                      src={parent.photo} 
                      alt={parent.nom} 
                      className="w-8 h-8 rounded-full mr-2 object-cover"
                    />
                    <span>{parent.nom} ({parent.dateNaissance})</span>
                  </label>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">Sélectionnez un ou deux parents</p>
          </div>

          <div className="flex justify-end space-x-2 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={selectedParents.length === 0}
            >
              Ajouter l'enfant
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};