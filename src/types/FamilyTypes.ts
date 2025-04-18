export interface PersonNode {
  key: number;
  nom: string;
  genre: 'M' | 'F';
  dateNaissance: string;
  photo: string;
  details?: string;
}

export interface FamilyRelation {
  type?: string
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

export type AddPersonHandler = (person: Omit<PersonNode, 'key'>) => void;
export type AddSpouseHandler = (spouse: Omit<PersonNode, 'key'>, spouseOf: number) => void;
export type AddChildHandler = (child: Omit<PersonNode, 'key'>, parentId: number) => void;