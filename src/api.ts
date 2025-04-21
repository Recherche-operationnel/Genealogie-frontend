import axios from 'axios';

const API_URL = 'http://localhost:8000/api/'; // Remplacez par votre URL Django

export interface PersonNode {
    id: number;
    nom: string;
    genre: 'M' | 'F';
    dateNaissance: string;
    photo?: string;
    details?: string;
}

export interface FamilyRelation {
    from: number;
    to: number;
    type: 'spouse' | 'child';
}

export const getFamilyTree = async (): Promise<{nodes: PersonNode[], links: FamilyRelation[]}> => {
    try {
        const [personsResponse, relationsResponse] = await Promise.all([
            axios.get(`${API_URL}persons/`),
            axios.get(`${API_URL}relations/`)
        ]);
        
        return {
            nodes: personsResponse.data.map((person: any) => ({
                id: person.id,
                nom: person.nom,
                genre: person.genre,
                dateNaissance: person.dateNaissance,
                photo: person.photo || undefined,
                details: person.details || undefined
            })),
            links: relationsResponse.data.map((rel: any) => ({
                from: rel.from_person,
                to: rel.to_person,
                type: rel.type
            }))
        };
    } catch (error) {
        console.error("Error fetching family tree:", error);
        throw error;
    }
};

export const savePerson = async (personData: PersonNode): Promise<PersonNode> => {
    try {
        if (personData.id) {
            // Mise à jour
            const response = await axios.put(`${API_URL}persons/${personData.id}/`, personData);
            return response.data;
        } else {
            // Création
            const response = await axios.post(`${API_URL}persons/`, personData);
            return response.data;
        }
    } catch (error) {
        console.error("Error saving person:", error);
        throw error;
    }
};

export const saveRelation = async (relationData: FamilyRelation): Promise<any> => {
    try {
        const response = await axios.post(`${API_URL}relations/`, {
            from_person: relationData.from,
            to_person: relationData.to,
            type: relationData.type
        });
        return response.data;
    } catch (error) {
        console.error("Error saving relation:", error);
        throw error;
    }
};

export const deletePerson = async (personId: number): Promise<void> => {
    try {
        await axios.delete(`${API_URL}persons/${personId}/`);
    } catch (error) {
        console.error("Error deleting person:", error);
        throw error;
    }
};

export const deleteRelation = async (relation: FamilyRelation): Promise<void> => {
    try {
        // Note: Cette implémentation suppose que votre API peut gérer la suppression
        // en utilisant from_person et to_person comme identifiants
        await axios.delete(`${API_URL}relations/`, {
            data: {
                from_person: relation.from,
                to_person: relation.to,
                type: relation.type
            }
        });
    } catch (error) {
        console.error("Error deleting relation:", error);
        throw error;
    }
};