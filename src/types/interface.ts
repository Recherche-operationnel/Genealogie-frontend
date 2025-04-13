export interface PersonNode {
    key: number;
    nom: string;
    genre: 'M' | 'F';
    dateNaissance: string;
    photo: string;
    details?: string;
  }
  
  export interface FamilyRelation {
    from: number;
    to: number;
    relationType?: 'parent' | 'sibling';
  }
  
  export interface FamilyTreeData {
    persons: PersonNode[];
    relationships: FamilyRelation[];
  }