import React, { useEffect, useRef, useState } from 'react';
import * as go from 'gojs';
import { PersonNode, FamilyRelation } from '../types/FamilyTypes';
import {
  buildFamilyGraph,
  depthFirstSearch,
  breadthFirstSearch,
  dijkstraSearch
} from '../algorithms/graphAlgorithms';

interface FamilyTreeViewProps {
  nodes: PersonNode[];
  links: FamilyRelation[];
  onNodeSelect: (node: PersonNode | null) => void;
  isLoading: boolean;
  onAlgorithmSearch: (startId: string, endId: string, algo: string) => string[];
}

const FamilyTreeView: React.FC<FamilyTreeViewProps> = ({
  nodes,
  links,
  onNodeSelect,
  isLoading,
  onAlgorithmSearch
}) => {
  const diagramRef = useRef<HTMLDivElement>(null);
  const diagramInstance = useRef<go.Diagram | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedStartNode, setSelectedStartNode] = useState<string>('');
  const [selectedEndNode, setSelectedEndNode] = useState<string>('');
  const [algoType, setAlgoType] = useState('dfs');
  const [algoResult, setAlgoResult] = useState<string[]>([]);
  
  function highlightPath(diagram: go.Diagram, path: string[]) {
    diagram.startTransaction("highlight");
    
    // Réinitialiser
    diagram.nodes.each(node => {
      const shape = node.findObject("HOVER");
      if (shape) {
        shape.fill = "white";
        shape.stroke = "#4CAF50";
      }
    });
  
    // Colorier le chemin
    path.forEach(nodeId => {
      const node = diagram.findNodeForKey(nodeId);
      const shape = node?.findObject("HOVER");
      if (shape) {
        shape.fill = "#FFD700";
        shape.stroke = "#FFA500";
      }
    });
  
    diagram.commitTransaction("highlight");
  }

  useEffect(() => {
    if (!diagramRef.current || isLoading) return;

    const $ = go.GraphObject.make;

    const diagram = $(go.Diagram, diagramRef.current, {
      initialContentAlignment: go.Spot.Center,
      'undoManager.isEnabled': true,
      'draggingTool.isEnabled': true,
      'allowMove': true,
      layout: $(go.TreeLayout, {
        angle: 90, // ou 0 pour vertical vers le bas
        layerSpacing: 50,
        nodeSpacing: 40,
        alignment: go.TreeLayout.AlignmentCenterChildren
      }),
      
      'InitialLayoutCompleted': e => {
        e.diagram.nodes.each(n => {
          if (!n.location.isReal()) {
            n.location = new go.Point(Math.random() * 1000, Math.random() * 600);
          }
        });
      }
    });

    diagram.nodeTemplate = $(go.Node, "Vertical", {
      selectionAdorned: true,
      selectionChanged: node => {
        const data = node.part?.data as PersonNode;
        onNodeSelect(data || null);
      },
      mouseEnter: (e, node) => {
        if (!node.data.isHighlighted) {
          const shape = node.findObject("HOVER");
          if (shape) shape.fill = "#E2E8F0";
        }
      },
      mouseLeave: (e, node) => {
        const shape = node.findObject("HOVER");
        if (shape) shape.fill = node.data.isHighlighted ? "#FFD700" : "white";
      }
    },
      $(go.Panel, "Spot", { isClipping: true },
        $(go.Shape, "Circle", 
          {
            name: "HOVER",
            width: 85,
            height: 85,
            strokeWidth: 6,
            // Valeurs par défaut
            fill: "white",
            stroke: "#4CAF50"
          },
          // Bindings
          new go.Binding("fill", "isHighlighted", h => h ? "#FFD700" : "white"),
          new go.Binding("stroke", "isHighlighted", h => h ? "#FFA500" : "#4CAF50")
        ),
        $(go.Picture, {
          width: 85,
          height: 85,
          imageStretch: go.GraphObject.UniformToFill,
          alignment: go.Spot.Center,
        }, new go.Binding("source", "photo"))
      ),
     
    
      $(go.TextBlock, {
        margin: 5,
        font: "bold 14px Arial",
        stroke: "#2D3748",
        maxSize: new go.Size(100, NaN),
        wrap: go.TextBlock.WrapFit,
        textAlign: "center",
      }, new go.Binding("text", "nom")),
      $(go.TextBlock, {
        font: "11px Arial",
        stroke: "#4A5568",
        textAlign: "center",
      }, new go.Binding("text", "dateNaissance"))
    );

    diagram.linkTemplate = $(go.Link,
      {
        routing: go.Link.Normal,
        corner: 10,
        curve: go.Link.Bezier,
        layerName: 'Background',
        selectable: false
      },
      new go.Binding('curve', 'category', type => type === 'spouse' ? go.Link.Bezier : go.Link.JumpOver),
    
      // Shape (ligne du lien)
      $(go.Shape,
        { strokeWidth: 3 },
        new go.Binding('stroke', '', data => {
          // Si le lien est surligné, on applique la couleur dorée (pour highlight)
          return data.isHighlighted ? '#FFD700' : (data.category === 'spouse' ? '#A855F7' : '#4A5568');
        }).ofObject()
      ),
    
      // Arrow (flèche du lien)
      $(go.Shape,
        { toArrow: 'Standard', stroke: null },
        new go.Binding('fill', '', data => {
          // Si le lien est surligné, on applique la couleur dorée (pour highlight)
          return data.isHighlighted ? '#FFD700' : (data.category === 'spouse' ? '#A855F7' : '#4A5568');
        }).ofObject()
      )
    );
    
    // Exemple de fonction pour mettre à jour les liens en surlignant le chemin

    

    diagram.model = new go.GraphLinksModel({
      nodeDataArray: nodes.map(node => ({
        key: node.id,
        ...node,
        isHighlighted: false, // Ajoutez cette ligne
        loc: go.Point.parse(`${Math.random() * 500 + 100} ${Math.random() * 300 + 100}`) // Valeurs plus contrôlées
      })),
      linkDataArray: links.map(link => ({
        key: `${link.from}-${link.to}-${link.type}`,
        from: link.from,
        to: link.to,
        category: link.type,
        isHighlighted: false // Ajoutez cette ligne
      }))
    });

    diagramInstance.current = diagram;

    return () => {
      if (diagram) diagram.div = null;
    };
  }, [isLoading, nodes, links]);

  const handleSearch = () => {
    const foundNode = nodes.find((node) =>
      node.nom.toLowerCase().includes(searchText.toLowerCase())
    );

    if (foundNode && diagramInstance.current) {
      const node = diagramInstance.current.findNodeForKey(foundNode.id);
      if (node) {
        diagramInstance.current.select(node);
        const bounds = node.actualBounds;
        if (bounds.isReal()) {
          diagramInstance.current.zoomToRect(bounds);
        }
      } else {
        alert("Nœud non trouvé dans le diagramme");
      }
    } else {
      alert("Personne non trouvée");
    }
  };

  const handleAlgorithmTrigger = () => {
    if (!selectedStartNode || !selectedEndNode) {
      alert("Veuillez sélectionner les deux personnes");
      return;
    }
  
    const result = onAlgorithmSearch(selectedStartNode, selectedEndNode, algoType);
    setAlgoResult(result);
    
    if (diagramInstance.current) {
      highlightPath(diagramInstance.current, result);
      
      // Sélectionner le premier nœud (sans animation)
      const firstNode = diagramInstance.current.findNodeForKey(result[0]);
      if (firstNode) {
        diagramInstance.current.select(firstNode);
      }
    }
  };
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Chargement en cours...</div>;
  }

  return (
    <div>
      <div className="flex gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="Rechercher une personne"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border p-2 rounded"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded">
          Rechercher
        </button>
      </div>

      <div
        ref={diagramRef}
        className="border border-blue-100 rounded-xl shadow-lg bg-white mb-6"
        style={{ height: '700px' }}
      />

      <div className="p-4 bg-gray-100 rounded shadow-md mb-4">
        <h3 className="font-bold text-lg mb-2">Recherche par algorithme</h3>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <select
            value={selectedStartNode}
            onChange={(e) => setSelectedStartNode(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Sélectionner une personne (départ)</option>
            {nodes.map(node => (
              <option key={`start-${node.id}`} value={node.id}>
                {node.nom} {node.dateNaissance && `(${node.dateNaissance})`}
              </option>
            ))}
          </select>

          <select
            value={selectedEndNode}
            onChange={(e) => setSelectedEndNode(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Sélectionner une personne (arrivée)</option>
            {nodes.map(node => (
              <option key={`end-${node.id}`} value={node.id}>
                {node.nom} {node.dateNaissance && `(${node.dateNaissance})`}
              </option>
            ))}
          </select>

          <select
            value={algoType}
            onChange={(e) => setAlgoType(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="dfs">DFS</option>
            <option value="bfs">BFS</option>
            <option value="dijkstra">Dijkstra</option>
          </select>

          <button
            onClick={handleAlgorithmTrigger}
            className="bg-green-600 text-white p-2 rounded"
          >
            Lancer l'algorithme
          </button>
        </div>

        {algoResult.length > 0 && (
  <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
    <h4 className="font-bold text-lg mb-3 text-blue-800">Résultat de la recherche</h4>
    
    <div className="flex items-center flex-wrap gap-3 mb-4">
      {algoResult.map((id, index) => {
        const node = nodes.find(n => String(n.id) === String(id));
        if (!node) return null;
        
        return (
          <div key={id} className="flex items-center">
            {index > 0 && (
              <div className="mx-2 text-xl text-purple-600 font-bold">
                →
              </div>
            )}
            
            <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
              {node.photo && (
                <img 
                  src={node.photo} 
                  alt={node.nom}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                />
              )}
              <span className="font-medium mt-1 text-sm text-center">
                {node.nom}
              </span>
            </div>
          </div>
        );
      })}
    </div>
{/* Nouvelle section Description de l'algorithme */}
<div className="mb-4 p-3 bg-yellow-50 rounded border border-yellow-200">
      <h5 className="font-semibold text-yellow-700 mb-1">Algorithme utilisé :</h5>
      <p className="text-sm text-gray-700">
        {algoType === 'dfs' && 
          "DFS (Depth-First Search) - Exploration en profondeur d'abord : Cet algorithme explore le graphe en suivant chaque chemin jusqu'à son terme avant de revenir en arrière."}
        {algoType === 'bfs' && 
          "BFS (Breadth-First Search) - Exploration en largeur d'abord : Cet algorithme explore tous les voisins immédiats avant de passer aux nœuds suivants."}
        {algoType === 'dijkstra' && 
          "Algorithme de Dijkstra : Trouve le chemin le plus court en considérant des poids égaux sur toutes les arêtes."}
      </p>
    </div>
    <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-100">
      <h5 className="font-semibold text-blue-700 mb-1">Conclusion :</h5>
      
      {/* Affichage de la conclusion sur la relation entre les personnes */}  
      <p className="text-sm text-gray-700">
        {(() => {
          if (algoResult.length < 3) return "Relation directe entre ces personnes :Parent - Enfant";
          
          const first = nodes.find(n => String(n.id) === String(algoResult[0]))?.nom || "Début";
          const last = nodes.find(n => String(n.id) === String(algoResult[algoResult.length-1]))?.nom || "Fin";
          
          return `Chaîne de ${algoResult.length} relations entre ${first} et ${last}. 
          ${algoResult.length > 5 ? 'Relation familiale éloignée' : 'Relation familiale proche : SOEUR ET FRERE'}`;
        })()}
      </p>
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default FamilyTreeView;