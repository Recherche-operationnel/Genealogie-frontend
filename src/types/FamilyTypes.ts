export interface PersonNode {
  id: number;
  nom: string;
  genre: 'M' | 'F';
  dateNaissance: string;
  photo?:  File | string;
  details?: string;
}

export interface FamilyRelation {
  type: 'spouse' | 'child';
  from: number;
  to: number;
}

export interface FamilyData {
  nodes: PersonNode[];
  parentChildRelations: FamilyRelation[];
  siblingRelations?: FamilyRelation[];
}
export interface DiagramData {
  nodes: PersonNode[];
  links: FamilyRelation[];
}

export type AddPersonHandler = (person: Omit<PersonNode, 'id'>) => void;
export type AddSpouseHandler = (spouse: Omit<PersonNode, 'id'>, spouseOf: number) => void;
export type AddChildHandler = (child: Omit<PersonNode, 'id'>, parentId: number) => void;