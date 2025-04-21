import React, { useState } from 'react';
import { PersonNode, FamilyRelation } from '../../types/FamilyTypes';

interface AddChildFormProps {
  selectedParent: PersonNode;
  allNodes: PersonNode[];
  allLinks: FamilyRelation[];
  onAddChild: (child: Omit<PersonNode, 'id'>, parentIds: number[]) => void;
  onCancel: () => void;
}

export const AddChildForm: React.FC<AddChildFormProps> = ({ 
  selectedParent, 
  allNodes, 
  allLinks,
  onAddChild, 
  onCancel 
}) => {
  const [childData, setChildData] = useState<Omit<PersonNode, 'id'>>({
    nom: '',
    genre: 'M',
    dateNaissance: '',
    photo: 'https://placekitten.com/200/200',
    details: ''
  });

  const [selectedParents, setSelectedParents] = useState<number[]>([selectedParent.id]);

  // Trouver les personnes qui peuvent être parents (exclut les enfants existants)
  const potentialParents = allNodes.filter(node => {
    // Exclure la personne sélectionnée si déjà dans les parents
    if (node.id === selectedParent.id) return false;
    
    // Vérifier qu'il n'y a pas déjà une relation parent-enfant inverse
    return !allLinks.some(link => 
      link.from === node.id && link.to === selectedParent.id && link.type === 'child'
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedParents.length === 0) return;
    
    onAddChild(childData, selectedParents);
  };

  const handleParentSelect = (parentId: number, isChecked: boolean) => {
    setSelectedParents(prev => {
      if (isChecked) {
        // Autoriser les conjoints comme parents supplémentaires
        return [...prev, parentId];
      } else {
        // On ne peut pas désélectionner le parent initial
        if (parentId === selectedParent.id) return prev;
        return prev.filter(id => id !== parentId);
      }
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setChildData({...childData, photo: event.target.result as string});
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
      <h3 className="text-xl font-semibold mb-4">Ajouter un enfant</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
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
                required
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
            <div className="flex items-center space-x-4">
              <img 
                src={childData.photo} 
                alt="Aperçu" 
                className="w-20 h-20 rounded-full object-cover border shadow"
              />
              <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-md shadow-sm hover:bg-blue-200 transition">
                📁 Choisir une image
                <input
                   type="file"
                   accept="image/*"
                   onChange={(e) => {
                     const file = e.target.files?.[0];
                     if (file) {
                       const imageUrl = URL.createObjectURL(file);
                       setChildData({...childData, photo: imageUrl});
                     }
                   }}
                   className="hidden"
                />
              </label>
            </div>
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
              <div key={selectedParent.id} className="flex items-center bg-gray-50 p-2 rounded">
                <input
                  type="checkbox"
                  id={`parent-${selectedParent.id}`}
                  checked={true}
                  disabled
                  className="mr-2"
                />
                <label htmlFor={`parent-${selectedParent.id}`} className="flex items-center">
                  <img 
                    src={selectedParent.photo} 
                    alt={selectedParent.nom} 
                    className="w-8 h-8 rounded-full mr-2 object-cover"
                  />
                  <span>{selectedParent.nom} ({selectedParent.dateNaissance})</span>
                </label>
              </div>

              {potentialParents.map(parent => (
                <div key={parent.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    id={`parent-${parent.id}`}
                    checked={selectedParents.includes(parent.id)}
                    onChange={(e) => handleParentSelect(parent.id, e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor={`parent-${parent.id}`} className="flex items-center">
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
            <p className="text-sm text-gray-500 mt-1">
              {selectedParents.length > 2 ? "Maximum 2 parents autorisés" : "Sélectionnez un ou deux parents"}
            </p>
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
              disabled={selectedParents.length === 0 || selectedParents.length > 2}
            >
              Ajouter l'enfant
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};