import React, { useState, useEffect } from 'react';
import { getFamilyTree, savePerson, saveRelation, deletePerson as apiDeletePerson, deleteRelation as apiDeleteRelation } from '../../api';
import FamilyTreeView from './FamilyTreeView';
import FamilyTreeControls from './FamilyTreeControls';
import { PersonNode, FamilyRelation } from '../types/FamilyTypes';

const CreateTree: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<PersonNode | null>(null);
  const [diagramData, setDiagramData] = useState<{
    nodes: PersonNode[];
    links: FamilyRelation[];
  }>({ nodes: [], links: [] });
  const [isLoading, setIsLoading] = useState(true);

  // Charger les données depuis l'API Django
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getFamilyTree();
        setDiagramData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load family tree:", error);
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Handler pour ajouter une nouvelle personne
  const handleAddPerson = async (newPerson: PersonNode) => {
    try {
      const savedPerson = await savePerson(newPerson);
      setDiagramData(prev => ({
        ...prev,
        nodes: [...prev.nodes, savedPerson]
      }));
    } catch (error) {
      console.error("Failed to save person:", error);
    }
  };

  // Handler pour ajouter un conjoint
  const handleAddSpouse = async (spouseData: Omit<PersonNode, 'id'>, existingPersonId: number) => {
    try {
      const newSpouse = await savePerson(spouseData);
      await saveRelation({
        from: existingPersonId,
        to: newSpouse.id,
        type: "spouse"
      });

      setDiagramData(prev => ({
        nodes: [...prev.nodes, newSpouse],
        links: [...prev.links, {
          from: existingPersonId,
          to: newSpouse.id,
          type: "spouse"
        }]
      }));
    } catch (error) {
      console.error("Failed to add spouse:", error);
    }
  };

  // Handler pour ajouter un enfant
  const handleAddChild = async (childData: Omit<PersonNode, 'id'>, parentIds: number[]) => {
    try {
      const newChild = await savePerson(childData);
      const newLinks: FamilyRelation[] = [];
      
      for (const parentId of parentIds) {
        await saveRelation({
          from: parentId,
          to: newChild.id,
          type: "child"
        });
        newLinks.push({ 
          from: parentId, 
          to: newChild.id, 
          type: "child" 
        });
      }
      
      setDiagramData(prev => ({
        nodes: [...prev.nodes, newChild],
        links: [...prev.links, ...newLinks]
      }));
    } catch (error) {
      console.error("Failed to add child:", error);
    }
  };

  // Handler pour supprimer une personne
  const handleDeletePerson = async () => {
    if (!selectedNode) return;
    
    try {
      await apiDeletePerson(selectedNode.id);
      
      // Supprimer aussi les relations associées
      const relationsToDelete = diagramData.links.filter(
        link => link.from === selectedNode.id || link.to === selectedNode.id
      );
      
      for (const relation of relationsToDelete) {
        await apiDeleteRelation(relation);
      }
      
      // Mettre à jour l'état local
      setDiagramData({
        nodes: diagramData.nodes.filter(node => node.id !== selectedNode.id),
        links: diagramData.links.filter(
          link => link.from !== selectedNode.id && link.to !== selectedNode.id
        )
      });
      
      setSelectedNode(null);
    } catch (error) {
      console.error("Failed to delete person:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="flex gap-6 flex-col lg:flex-row">
        <div className="lg:w-3/4 w-full">
          <FamilyTreeView 
            nodes={diagramData.nodes}
            links={diagramData.links}
            onNodeSelect={setSelectedNode}
            isLoading={isLoading}
          />
        </div>
        
        <FamilyTreeControls
          selectedNode={selectedNode}
          nodes={diagramData.nodes}
          links={diagramData.links}
          onAddPerson={handleAddPerson}
          onAddSpouse={handleAddSpouse}
          onAddChild={handleAddChild}
          onDeletePerson={handleDeletePerson}
        />
      </div>
    </div>
  );
};

export default CreateTree;