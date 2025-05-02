// src/utils/algorithms.ts

import { PersonNode, FamilyRelation } from '../types/FamilyTypes';

// Type pour la représentation du graphe
type FamilyGraph = Record<string, {
  node: PersonNode;
  neighbors: { id: string; type: string }[];
}>;

/**
 * Crée une représentation graphique (adjacency list) à partir des nœuds et liens
 */
export const buildFamilyGraph = (
  nodes: PersonNode[],
  links: FamilyRelation[]
): FamilyGraph => {
  const graph: FamilyGraph = {};

  // Initialiser tous les nœuds d'abord
  nodes.forEach(node => {
    graph[node.id] = {
      node,
      neighbors: [] // Initialiser avec un tableau vide
    };
  });

  // Puis ajouter les relations
  links.forEach(link => {
    // Vérifier que les nœuds existent avant d'ajouter des relations
    if (graph[link.from] && graph[link.to]) {
      graph[link.from].neighbors.push({ id: link.to, type: link.type });
      
      // Pour les relations non orientées (parent/enfant)
      if (link.type !== 'spouse') {
        graph[link.to].neighbors.push({ id: link.from, type: link.type });
      }
    } else {
      console.warn(`Relation invalide entre ${link.from} et ${link.to}`);
    }
  });

  return graph;
};

export const depthFirstSearch = (
  graph: FamilyGraph,
  startId: string,  // Accepte string en entrée
  endId: string     // mais les convertit en nombres pour comparaison
): string[] => {
  // Conversion en nombres pour comparaison stricte
  const targetId = Number(endId);
  
  const visited = new Set<number>(); // Stocke des nombres
  const path: string[] = [];

  const dfs = (currentId: number): boolean => {
    if (visited.has(currentId)) return false;
    
    visited.add(currentId);
    path.push(String(currentId)); // Stocke comme string

    if (currentId === targetId) return true;

    // Convertit les voisins en nombres pour la recherche
    const neighbors = graph[String(currentId)]?.neighbors || [];
    for (const neighbor of neighbors) {
      if (dfs(Number(neighbor.id))) {
        return true;
      }
    }

    path.pop();
    return false;
  };

  return dfs(Number(startId)) ? path : [];
};
/**
 * Algorithme BFS (Breadth-First Search) avec logs
 */
export const breadthFirstSearch = (
  graph: FamilyGraph,
  startId: string,  // Tous les IDs traités comme strings
  endId: string     // pour éviter les problèmes de type
): string[] => {
  console.log('[BFS] Début de recherche', { startId, endId });
  
  // Conversion en string pour être cohérent
  startId = String(startId);
  endId = String(endId);

  if (!graph[startId]) {
    console.error('[BFS] Erreur: nœud de départ non trouvé');
    return [];
  }
  if (!graph[endId]) {
    console.error('[BFS] Erreur: nœud cible non trouvé');
    return [];
  }

  const queue: { id: string; path: string[] }[] = [{ 
    id: startId, 
    path: [startId] 
  }];
  const visited = new Set<string>([startId]);

  while (queue.length > 0) {
    const current = queue.shift()!;
    console.log(`[BFS] Traitement de ${current.id}, chemin: ${current.path.join(' -> ')}`);

    // Comparaison stricte entre strings
    if (current.id === endId) {
      console.log('[BFS] Cible trouvée ! Chemin:', current.path);
      return current.path;
    }

    const neighbors = graph[current.id]?.neighbors || [];
    for (const neighbor of neighbors) {
      const neighborId = String(neighbor.id); // Conversion pour cohérence
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        queue.push({
          id: neighborId,
          path: [...current.path, neighborId]
        });
      }
    }
  }

  console.log('[BFS] Aucun chemin trouvé');
  return [];
};

export const dijkstraSearch = (
  graph: FamilyGraph,
  startId: string,
  endId: string
): string[] => {
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  // Initialisation
  Object.keys(graph).forEach(id => {
    distances[id] = id === startId ? 0 : Infinity;
    previous[id] = null;
    unvisited.add(id);
  });

  while (unvisited.size > 0) {
    // Trouver le nœud non visité avec la plus petite distance
    let currentId = '';
    let smallestDistance = Infinity;

    unvisited.forEach(id => {
      if (distances[id] < smallestDistance) {
        smallestDistance = distances[id];
        currentId = id;
      }
    });

    if (currentId === '') break;

    if (currentId === endId) {
      // Reconstruire le chemin
      const path: string[] = [];
      let step = endId;

      while (step !== startId) {
        path.unshift(step);
        step = previous[step]!;
      }
      path.unshift(startId);
      return path;
    }

    unvisited.delete(currentId);

    // Mettre à jour les distances des voisins
    graph[currentId].neighbors.forEach(neighbor => {
      const alt = distances[currentId] + 1; // Poids uniforme de 1
      if (alt < distances[neighbor.id]) {
        distances[neighbor.id] = alt;
        previous[neighbor.id] = currentId;
      }
    });
  }

  return [];
};