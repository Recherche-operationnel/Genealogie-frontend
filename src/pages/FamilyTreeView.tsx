import React, { useEffect, useRef } from 'react';
import * as go from 'gojs';
import { PersonNode, FamilyRelation } from '../types/FamilyTypes';

interface FamilyTreeViewProps {
  nodes: PersonNode[];
  links: FamilyRelation[];
  onNodeSelect: (node: PersonNode | null) => void;
  isLoading: boolean;
}

const FamilyTreeView: React.FC<FamilyTreeViewProps> = ({
  nodes,
  links,
  onNodeSelect,
  isLoading
}) => {
  const diagramRef = useRef<HTMLDivElement>(null);
  const diagramInstance = useRef<go.Diagram | null>(null);

  useEffect(() => {
    if (!diagramRef.current || isLoading) return;

    const $ = go.GraphObject.make;

    // Création du diagramme
    const diagram = $(go.Diagram, diagramRef.current, {
      initialContentAlignment: go.Spot.Center,
      'undoManager.isEnabled': true,
      layout: $(go.TreeLayout, {
        angle: 90,
        layerSpacing: 70,
        nodeSpacing: 40,
        alternateAngle: 0,
        alternateAlignment: go.TreeLayout.AlignmentStart,
        alternateNodeSpacing: 20
      }),
    });

    // Définition du template de nœud
    diagram.nodeTemplate = $(go.Node, "Vertical", {
      selectionAdorned: true,
      selectionChanged: node => {
        const data = node.part?.data as PersonNode;
        onNodeSelect(data || null);
      },
      mouseEnter: (e, node) => {
        const shape = node.findObject("SHAPE") as go.Shape;
        if (shape) shape.fill = "#E2E8F0"; // gris clair sur hover
      },
      mouseLeave: (e, node) => {
        const shape = node.findObject("SHAPE") as go.Shape;
        if (shape) shape.fill = "#F7FAFC"; // réinitialisation à la couleur d'origine
      }
    },
      $(go.Panel, "Spot", 
        // Zone transparente pour survol
        $(go.Shape, "Rectangle", {
          name: "HOVER",
          width: 100,
          height: 100,
          fill: null, // Pas de remplissage
          stroke: null, // Pas de bordure
          alignment: go.Spot.Center,
          stretch: go.GraphObject.Fill,
          // Superposition qui change de couleur sur hover
          mouseEnter: (e, shape) => { shape.fill = "#0000"; },
          mouseLeave: (e, shape) => { shape.fill = null; }
        }),
        $(go.Shape, "Rectangle", {
          name: "SHAPE",
          width: 100,
          height: 100,
          fill: "#F7FAFC",
          strokeWidth: 2
        },
          new go.Binding("stroke", "genre", genre => genre === "F" ? "#EC4899" : "#3B82F6") // rose ou bleu
        ),
        
        $(go.Picture, {
          width: 96,
          height: 96,
          imageStretch: go.GraphObject.UniformToFill,
          background: null,
          alignment: go.Spot.Center,
        }, new go.Binding("source", "photo")) // Liens de l'image depuis les données
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

    // Définition du template de lien
    diagram.linkTemplate = $(go.Link, {
      routing: go.Link.Orthogonal,
      corner: 10,
      curve: go.Link.Bezier,
      layerName: 'Background',
      selectable: false
    },
      new go.Binding('curve', 'category', type => type === 'spouse' ? go.Link.Bezier : go.Link.JumpOver),
      $(go.Shape, {
        strokeWidth: 3,
      }, new go.Binding('stroke', 'category', type => type === 'spouse' ? '#A855F7' : '#4A5568')),
      $(go.Shape, {
        toArrow: 'Standard',
        stroke: null
      }, new go.Binding('fill', 'category', type => type === 'spouse' ? '#A855F7' : '#4A5568'))
    );

    // Initialisation du modèle de données
    diagram.model = new go.GraphLinksModel({
      nodeDataArray: nodes.map(node => ({
        key: node.id,
        ...node
      })),
      linkDataArray: links.map(link => ({
        key: `${link.from}-${link.to}-${link.type}`,
        from: link.from,
        to: link.to,
        category: link.type
      }))
    });

    diagramInstance.current = diagram;

    return () => {
      if (diagram) diagram.div = null;
    };
  }, [isLoading, nodes, links]);

  useEffect(() => {
    if (!isLoading && diagramInstance.current) {
      diagramInstance.current.model = new go.GraphLinksModel({
        nodeDataArray: nodes.map(node => ({
          key: node.id,
          ...node
        })),
        linkDataArray: links.map(link => ({
          key: `${link.from}-${link.to}-${link.type}`,
          from: link.from,
          to: link.to,
          category: link.type
        }))
      });
    }
  }, [nodes, links, isLoading]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Chargement en cours...</div>;
  }

  return (
    <div
      ref={diagramRef}
      className="border border-blue-100 rounded-xl shadow-lg bg-white"
      style={{ height: '700px' }}
    />
  );
};

export default FamilyTreeView;
