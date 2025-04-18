import React, { useEffect, useRef, useState } from 'react';
import * as go from 'gojs';
import { FaUserPlus, FaUserFriends, FaChild, FaSearch, FaSitemap, FaInfoCircle } from 'react-icons/fa';
import { PersonNode, FamilyRelation } from '../types/FamilyTypes';
import { AddChildForm } from '../components/FamilyTree/AddChildForm';
import { AddPersonForm } from '../components/FamilyTree/AddPersonForm';
import { AddSpouseForm } from '../components/FamilyTree/AddSpouseForm';

function CreateTree() {
  const diagramRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<PersonNode | null>(null);
  const [showAddPersonForm, setShowAddPersonForm] = useState(false);
  const [showAddSpouseForm, setShowAddSpouseForm] = useState(false);
  const [showAddChildForm, setShowAddChildForm] = useState(false);
  const [diagramData, setDiagramData] = useState<{
    nodes: PersonNode[];
    links: FamilyRelation[];
  }>({
    nodes: [
      { 
        key: 1, 
        nom: "Jean Dupont", 
        genre: "M", 
        dateNaissance: "1960", 
        photo: "https://placekitten.com/100/100",
        details: "Né à Paris, médecin"
      },
      { 
        key: 2, 
        nom: "Marie Martin", 
        genre: "F", 
        dateNaissance: "1962", 
        photo: "https://placekitten.com/101/101",
        details: "Née à Lyon, architecte"
      },
      { 
        key: 3, 
        nom: "Pierre Dupont", 
        genre: "M", 
        dateNaissance: "1985", 
        photo: "https://placekitten.com/102/102",
        details: "Né à Marseille, ingénieur"
      },
      { 
        key: 4, 
        nom: "Sophie Dupont", 
        genre: "F", 
        dateNaissance: "1988", 
        photo: "https://placekitten.com/103/103",
        details: "Née à Bordeaux, avocate"
      }
    ],
    links: [
      { from: 1, to: 2, type: "spouse" },
      { from: 1, to: 3 },
      { from: 1, to: 4 },
      { from: 2, to: 3 },
      { from: 2, to: 4 }
    ]
  });

  const diagramInstance = useRef<go.Diagram | null>(null);

  // Fonction pour mettre à jour le diagramme
  const updateDiagram = (nodes: PersonNode[], links: FamilyRelation[]) => {
    if (diagramInstance.current) {
      diagramInstance.current.model = new go.GraphLinksModel({
        nodeDataArray: nodes,
        linkDataArray: links
      });
    }
  };

  // Handler pour ajouter une nouvelle personne
  const handleAddPerson = (newPerson: PersonNode) => {
    const updatedNodes = [...diagramData.nodes, newPerson];
    setDiagramData(prev => ({
      ...prev,
      nodes: updatedNodes
    }));
    updateDiagram(updatedNodes, diagramData.links);
    setShowAddPersonForm(false);
  };

  // Handler pour ajouter un conjoint
  const handleAddSpouse = (spouseData: PersonNode, existingPersonId: number) => {
    const newSpouseId = Math.max(...diagramData.nodes.map(n => n.key), 0) + 1;
    const newSpouse = { ...spouseData, key: newSpouseId };
    
    const updatedNodes = [...diagramData.nodes, newSpouse];
    const updatedLinks = [...diagramData.links, {
      from: existingPersonId,
      to: newSpouseId,
      type: "spouse"
    }];
    
    setDiagramData({
      nodes: updatedNodes,
      links: updatedLinks
    });
    updateDiagram(updatedNodes, updatedLinks);
    setShowAddSpouseForm(false);
  };

  // Handler pour ajouter un enfant
  const handleAddChild = (childData: PersonNode, parentIds: number[]) => {
    const newChildId = Math.max(...diagramData.nodes.map(n => n.key), 0) + 1;
    const newChild = { ...childData, key: newChildId };
    
    const updatedNodes = [...diagramData.nodes, newChild];
    const updatedLinks = [...diagramData.links];
    
    parentIds.forEach(parentId => {
      updatedLinks.push({ from: parentId, to: newChildId });
    });
    
    setDiagramData({
      nodes: updatedNodes,
      links: updatedLinks
    });
    updateDiagram(updatedNodes, updatedLinks);
    setShowAddChildForm(false);
  };

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

  useEffect(() => {
    if (!diagramRef.current) return;
  
    const $ = go.GraphObject.make;
  
    // Nettoyage du diagramme existant
    const existingDiagram = go.Diagram.fromDiv(diagramRef.current);
    if (existingDiagram) existingDiagram.div = null;
  
    const diagram = $(go.Diagram, diagramRef.current, {
      initialContentAlignment: go.Spot.Center,
      "undoManager.isEnabled": true,
      layout: $(go.TreeLayout, {
        angle: 90,
        layerSpacing: 70,
        nodeSpacing: 40,
        alternateAngle: 0,
        alternateAlignment: go.TreeLayout.AlignmentStart,
        alternateNodeSpacing: 20
      }),
    });
  
    // Template des nœuds
    diagram.nodeTemplate = $(
      go.Node,
      "Spot",
      {
        selectionAdorned: true,
        selectionChanged: node => {
          const data = node.part?.data as PersonNode;
          if (data) setSelectedNode(data);
        }
      },
      $(go.Shape, "Circle", {
          width: 100,
          height: 100,
          fill: "#F7FAFC",
          stroke: "#2C5282",
          strokeWidth: 2,
          portId: ""
        },
        new go.Binding("fill", "genre", genre =>
          genre === "F" ? "#FFF5F7" : "#EBF8FF"
        )
      ),
      $(go.Panel, "Vertical",
        {
          alignment: go.Spot.Center
        },
        $(
          go.Panel, "Spot",
          $(go.Shape, "Circle", {
            width: 60,
            height: 60,
            fill: null,
            strokeWidth: 0
          }),
          $(go.Picture,
            {
              width: 60,
              height: 60,
              imageStretch: go.GraphObject.UniformToFill
            },
            new go.Binding("source", "photo")
          )
        ),
        $(go.TextBlock, {
            margin: new go.Margin(5, 0, 3, 0),
            font: "bold 14px Arial",
            stroke: "#2D3748",
            maxSize: new go.Size(90, NaN),
            wrap: go.TextBlock.WrapFit,
            textAlign: "center"
          },
          new go.Binding("text", "nom")
        ),
        $(go.TextBlock, {
            font: "11px Arial",
            stroke: "#4A5568",
            textAlign: "center"
          },
          new go.Binding("text", "dateNaissance")
        )
      )
    );
    
    // Template des liens
    diagram.linkTemplate = $(
      go.Link,
      {
        routing: go.Link.Orthogonal,
        corner: 10,
        curve: go.Link.JumpOver,
        layerName: "Background",
        selectable: false
      },
      $(go.Shape,
        new go.Binding("stroke", "", d => {
          if (d.type === "spouse") return "#A855F7";
          if (d.type === "sibling") return "#CBD5E0";
          return "#4A5568";
        }),
        new go.Binding("strokeDashArray", "", d => {
          if (d.type === "spouse") return [4, 4];
          if (d.type === "sibling") return [1, 4];
          return [0, 0];
        }),
        { strokeWidth: 2 }
      ),
      $(go.Shape, {
        toArrow: "Standard",
        stroke: null,
        fill: "#4A5568"
      })
    );
    
    diagram.model = new go.GraphLinksModel({
      nodeDataArray: diagramData.nodes,
      linkDataArray: diagramData.links
    });

    diagramInstance.current = diagram;
  
    return () => {
      if (diagram) diagram.div = null;
    };
  }, []);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="flex gap-6 flex-col lg:flex-row">
        <div className="lg:w-3/4 w-full">
          <div
            ref={diagramRef}
            className="border border-blue-100 rounded-xl shadow-lg bg-white"
            style={{ height: "700px" }}
          />
        </div>
        
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
            </div>
          </div>
          
          {showAddPersonForm && (
            <AddPersonForm 
              onAddPerson={handleAddPerson} 
              onCancel={() => setShowAddPersonForm(false)}
            />
          )}
          
          {showAddSpouseForm && selectedNode && (
            <AddSpouseForm 
              existingPerson={selectedNode}
              onAddSpouse={handleAddSpouse}
              onCancel={() => setShowAddSpouseForm(false)}
            />
          )}
          
          {showAddChildForm && selectedNode && (
  <AddChildForm 
    selectedParent={selectedNode}
    allNodes={diagramData.nodes}
    allLinks={diagramData.links} // Passage des liens
    onAddChild={handleAddChild}
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
                <option value="ancestors">Rechercher les ancêtres</option>
                <option value="descendants">Rechercher les descendants</option>
                <option value="siblings">Rechercher les frères et sœurs</option>
                <option value="cousins">Rechercher les cousins</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTree;