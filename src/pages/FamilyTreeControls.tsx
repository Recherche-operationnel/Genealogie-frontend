import React from 'react';
import { FaUserPlus, FaUserFriends, FaChild, FaSearch, FaSitemap, FaInfoCircle, FaTrash } from 'react-icons/fa';
import { PersonNode, FamilyRelation } from '../types/FamilyTypes';
import { AddChildForm } from '../components/FamilyTree/AddChildForm';
import { AddPersonForm } from '../components/FamilyTree/AddPersonForm';
import { AddSpouseForm } from '../components/FamilyTree/AddSpouseForm';

interface FamilyTreeControlsProps {
    selectedNode: PersonNode | null;
    nodes: PersonNode[];
    links: FamilyRelation[];
    onAddPerson: (person: PersonNode) => void;
    onAddSpouse: (spouseData: Omit<PersonNode, 'id'>, existingPersonId: number) => void;
    onAddChild: (childData: Omit<PersonNode, 'id'>, parentIds: number[]) => void;
    onDeletePerson: () => void;
    onLayoutChange: (layout: 'vertical' | 'horizontal' | 'radial') => void;
    currentLayout: 'vertical' | 'horizontal' | 'radial';
  }
  
  const FamilyTreeControls: React.FC<FamilyTreeControlsProps> = ({
    selectedNode,
    nodes,
    links,
    onAddPerson,
    onAddSpouse,
    onAddChild,
    onDeletePerson,
    onLayoutChange,
    currentLayout
  }) => {
  const [showAddPersonForm, setShowAddPersonForm] = React.useState(false);
  const [showAddSpouseForm, setShowAddSpouseForm] = React.useState(false);
  const [showAddChildForm, setShowAddChildForm] = React.useState(false);

  const handleAddPersonClick = () => {
    setShowAddPersonForm(true);
    setShowAddSpouseForm(false);
    setShowAddChildForm(false);
  };

  const handleAddSpouseClick = () => {
    if (!selectedNode) {
      alert("Veuillez sélectionner une personne à laquelle ajouter un conjoint");
      return;
    }
    setShowAddSpouseForm(true);
    setShowAddPersonForm(false);
    setShowAddChildForm(false);
  };

  const handleAddChildClick = () => {
    if (!selectedNode) {
      alert("Veuillez sélectionner au moins un parent");
      return;
    }
    setShowAddChildForm(true);
    setShowAddPersonForm(false);
    setShowAddSpouseForm(false);
  };

  return (
    <div className="lg:w-1/4 w-full space-y-6">
    <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
        <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
          <FaSitemap className="mr-2 text-blue-600" />
          Tableau de bord
        </h2>
        
        <div className="space-y-4">
          <button 
            onClick={handleAddPersonClick}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-300 flex items-center justify-center space-x-2 shadow-md"
          >
            <FaUserPlus className="text-lg" />
            <span>Ajouter une personne</span>
          </button>
          
          <button 
            onClick={handleAddSpouseClick}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition duration-300 flex items-center justify-center space-x-2 shadow-md"
          >
            <FaUserFriends className="text-lg" />
            <span>Ajouter un conjoint</span>
          </button>
          
          <button 
            onClick={handleAddChildClick}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition duration-300 flex items-center justify-center space-x-2 shadow-md"
          >
            <FaChild className="text-lg" />
            <span>Ajouter un enfant</span>
          </button>

          {selectedNode && (
            <button 
              onClick={onDeletePerson}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition duration-300 flex items-center justify-center space-x-2 shadow-md"
            >
              <FaTrash className="text-lg" />
              <span>Supprimer cette personne</span>
            </button>
          )}
        </div>
      </div>
      
      {showAddPersonForm && (
        <AddPersonForm 
          onAddPerson={onAddPerson} 
          onCancel={() => setShowAddPersonForm(false)}
        />
      )}
      
      {showAddSpouseForm && selectedNode && (
        <AddSpouseForm 
          existingPerson={selectedNode}
          onAddSpouse={(spouseData) => onAddSpouse(spouseData, selectedNode.id)}
          onCancel={() => setShowAddSpouseForm(false)}
        />
      )}
      
      {showAddChildForm && selectedNode && (
        <AddChildForm 
          selectedParent={selectedNode}
          allNodes={nodes}
          allLinks={links}
          onAddChild={onAddChild}
          onCancel={() => setShowAddChildForm(false)}
        />
      )}
      
      {selectedNode && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <FaInfoCircle className="mr-2 text-blue-600" />
            Détails
          </h3>
          
          <div className="flex flex-col items-center mb-4">
            <img 
              src={selectedNode.photo} 
              alt={selectedNode.nom} 
              className="w-20 h-20 rounded-full object-cover border-2 border-blue-200 mb-3"
            />
            <h4 className="text-xl font-bold text-gray-800">{selectedNode.nom}</h4>
            <p className="text-gray-600">{selectedNode.dateNaissance}</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-700">{selectedNode.details || "Aucun détail supplémentaire"}</p>
          </div>
        </div>
      )}
      
      <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <FaSearch className="mr-2 text-blue-600" />
          Recherche
        </h3>
        
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Rechercher une personne..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
          <FaSearch className="absolute right-3 top-3 text-gray-400" />
        </div>
        
        <div>
          <h4 className="font-medium mb-2 text-gray-700">Algorithmes</h4>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white">
          <option value="">Sélectionner un algorithme</option>

  <option value="dfs">Parcours en profondeur (DFS)</option>
  <option value="bfs">Parcours en largeur (BFS)</option>

  <option value="dijkstra">Dijkstra</option>
  <option value="bellman-ford">Bellman-Ford</option>
  <option value="prim">Prim (Arbre couvrant minimum)</option>
  <option value="kruskal">Kruskal (Arbre couvrant minimum)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FamilyTreeControls;