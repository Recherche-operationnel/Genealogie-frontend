import axios from 'axios';

const API_URL = 'http://localhost:8000/api/'; // Remplacez par votre URL Django

export interface PersonNode {
    id: number;
    nom: string;
    genre: 'M' | 'F';
    dateNaissance: string;
    photo?: File | string;
    details?: string;
}

export interface FamilyRelation {
    from: number;
    to: number;
    type: 'spouse' | 'child';
}

// Récupérer l'arbre généalogique (nœuds et relations)
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

const convertBlobToFile = async (blobUrl: string, fileName: string): Promise<File> => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
};

// Sauvegarder une personne (sans l'upload de photo)
export const savePerson = async (personData: Omit<PersonNode, 'id'>) => {
    try {
        const { photo, ...jsonData } = personData; // Exclure la photo ici
        
        // Créez la personne (sans la photo)
        const response = await axios.post(`${API_URL}persons/`, jsonData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        // Upload séparé de la photo si nécessaire
        if (photo instanceof Blob || photo?.startsWith('blob:')) {
            const fileName = 'photo.jpg'; // Donnez un nom au fichier si nécessaire
            const file = await convertBlobToFile(photo, fileName);
            await uploadPersonPhoto(response.data.id, file); 
        }
        
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la sauvegarde:", error.response?.data);
        throw error;
    }
};

// Fonction pour uploader la photo de la personne après la création
export const uploadPersonPhoto = async (personId: number, photoFile: File) => {
    try {
        const formData = new FormData();
        formData.append('photo', photoFile, photoFile.name);

        const response = await axios.post(`${API_URL}persons/${personId}/upload_photo/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'upload de la photo:", error.response?.data || error.message);
        throw error;
    }
};

// Sauvegarder une relation (ex : parent-enfant)
export const saveRelation = async (relationData: { from: number, to: number, type: 'spouse' | 'child' }) => {
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

// Supprimer une personne
export const deletePerson = async (personId: number) => {
    try {
        await axios.delete(`${API_URL}persons/${personId}/`);
    } catch (error) {
        console.error("Error deleting person:", error);
        throw error;
    }
};

// Supprimer une relation
export const deleteRelation = async (relationId: number) => {
    try {
        await axios.delete(`${API_URL}relations/${relationId}/`);
    } catch (error) {
        console.error("Error deleting relation:", error);
        throw error;
    }
};

// Mettre à jour une personne (avec possibilité d'upload photo)
export const updatePerson = async (personId: number, personData: Partial<PersonNode>) => {
    try {
        const { photo, ...jsonData } = personData;
        const response = await axios.put(`${API_URL}persons/${personId}/`, jsonData, {
            headers: { 'Content-Type': 'application/json' }
        });

        // Si photo fournie, upload séparé
        if (photo instanceof File) {
            await uploadPersonPhoto(personId, photo);
        }

        return response.data;
    } catch (error) {
        console.error("Erreur lors de la mise à jour :", error.response?.data);
        throw error;
    }
};
// Exécuter un algorithme de recherche (DFS, BFS, Dijkstra...)
export const runAlgorithm = async (
    algorithm: 'dfs' | 'bfs' | 'dijkstra',
    startId: number,
    goalId: number
  ): Promise<number[]> => {
    try {
      const response = await axios.post(`${API_URL}run-algorithm/`, {
        algorithm,
        start_id: startId,
        goal_id: goalId
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      return response.data.path; // tableau d’IDs représentant le chemin
    } catch (error) {
      console.error("Erreur lors de l'exécution de l'algorithme:", error.response?.data || error.message);
      throw error;
    }
  };
  