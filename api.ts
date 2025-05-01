import axios from 'axios';

const API_URL = 'http://localhost:8000/api/'; // Remplacez par votre URL Django

export interface PersonNode {
    id: number;
    nom: string;
    genre: 'M' | 'F';
    dateNaissance: string;
    photo?:  File | string;
    details?: string;
}

export interface FamilyRelation {
    from: number;
    to: number;
    type: 'spouse' | 'child';
}

export const getFamilyTree = async () => {
    try {
        const [personsResponse, relationsResponse] = await Promise.all([
            axios.get(`${API_URL}persons/`),
            axios.get(`${API_URL}relations/`)
        ]);
        
        return {
            nodes: personsResponse.data,
            links: relationsResponse.data.map(rel => ({
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

export const savePerson = async (personData: Omit<PersonNode, 'id'> | PersonNode) => {
    try {
        // Créez une copie sans la photo (sera uploadée séparément)
        const { photo, ...jsonData } = personData;
        
        const response = await axios.post(`${API_URL}persons/`, jsonData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        // Upload séparé de la photo si nécessaire
        if (photo instanceof File) {
            await uploadPersonPhoto(response.data.id, photo); // envoie directement le fichier
          }
          
        
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la sauvegarde:", error.response?.data);
        throw error;
    }
};

export const uploadPersonPhoto = async (personId: number, photoFile: File) => {
    try {
      const formData = new FormData();
      formData.append('photo', photoFile, photoFile.name);
  
      const response = await axios.post(`${API_URL}persons/${personId}/upload_photo/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'upload de la photo:", error.response?.data || error.message);
      throw error;
    }
  };
  
  

export const saveRelation = async (relationData) => {
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

export const deletePerson = async (personId) => {
    try {
        await axios.delete(`${API_URL}persons/${personId}/`);
    } catch (error) {
        console.error("Error deleting person:", error);
        throw error;
    }
};

export const deleteRelation = async (relationId) => {
    try {
        await axios.delete(`${API_URL}relations/${relationId}/`);
    } catch (error) {
        console.error("Error deleting relation:", error);
        throw error;
    }
};