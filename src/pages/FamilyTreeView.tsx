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

  // Initialisation du diagramme
  useEffect(() => {
    if (!diagramRef.current || isLoading) return;

    const $ = go.GraphObject.make;

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

    diagram.nodeTemplate = $(
      go.Node,
      "Vertical",
      {
        selectionAdorned: true,
        selectionChanged: node => {
          const data = node.part?.data as PersonNode;
          onNodeSelect(data || null);
        }
      },
      $(
        go.Panel, "Auto",
        $(
          go.Shape, "Circle",
          {
            width: 100,
            height: 100,
            fill: "#000",
            stroke: "#2C5282",
            strokeWidth: 2
          }
        ),
        $(
          go.Picture,
          {
            width: 96,
            height: 96,
            margin: 2,
            imageStretch: go.GraphObject.UniformToFill,
            background: "white"
          },
          new go.Binding("source", "photo")
        )
      ),
      $(go.TextBlock, {
        margin: 5,
        font: "bold 14px Arial",
        stroke: "#2D3748",
        maxSize: new go.Size(100, NaN),
        wrap: go.TextBlock.WrapFit,
        textAlign: "center"
      },
      new go.Binding("text", "nom")),
      $(go.TextBlock, {
        font: "11px Arial",
        stroke: "#4A5568",
        textAlign: "center"
      },
      new go.Binding("text", "dateNaissance"))
    );

    diagram.linkTemplate = $(
      go.Link,
      {
        routing: go.Link.Orthogonal,
        corner: 10,
        curve: go.Link.Bezier,
        layerName: "Background",
        selectable: false
      },
      new go.Binding("curve", "category", type => 
        type === 'spouse' ? go.Link.Bezier : go.Link.JumpOver
      ),
      $(go.Shape,
        {
          strokeWidth: 3,
          stroke: "#4A5568"
        },
        new go.Binding("stroke", "category", type => 
          type === 'spouse' ? "#A855F7" : "#4A5568"
        )
      ),
      $(go.Shape, {
        toArrow: "Standard",
        stroke: null,
        fill: "#4A5568"
      },
      new go.Binding("fill", "category", type => 
        type === 'spouse' ? "#A855F7" : "#4A5568"
      ))
    );

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
  }, [isLoading]);

  // Mise à jour du diagramme quand les données changent
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
      style={{ height: "700px" }} 
    />
  );
};

export default FamilyTreeView;