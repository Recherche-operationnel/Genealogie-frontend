import { PersonNode, FamilyRelation } from '../../types/FamilyTypes';

export const getSiblings = (diagram: go.Diagram, nodeId: number): PersonNode[] => {
  const node = diagram.findNodeForKey(nodeId);
  if (!node) return [];

  const siblings = new Set<PersonNode>();
  
  node.findLinksOutOf().each(link => {
    const parent = link.toNode;
    if (parent) {
      parent.findLinksInto().each(childLink => {
        const sibling = childLink.fromNode;
        if (sibling && sibling.key !== nodeId) {
          siblings.add(sibling.data);
        }
      });
    }
  });

  return Array.from(siblings);
};

export const updateSiblingRelations = (diagram: go.Diagram, showSiblings: boolean) => {
  // Implémentation de la fonction vue précédemment
};