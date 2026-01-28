import {
  Choice,
  Participant,
  Position,
  ContentCategory,
  CategoryPositions,
  ClusterInfo,
  ContentItem,
} from '@/types';
import { contentPool, getCategoryGroup } from './content';

// Category positions on the 2D visualization plane
export const categoryPositions: CategoryPositions = {
  politics_left: { x: 10, y: 30 },
  politics_right: { x: 10, y: 70 },
  politics_center: { x: 15, y: 50 },
  tech_optimist: { x: 30, y: 20 },
  tech_pessimist: { x: 30, y: 80 },
  entertainment_celebrity: { x: 50, y: 90 },
  entertainment_movies: { x: 55, y: 75 },
  entertainment_gaming: { x: 60, y: 85 },
  sports_mainstream: { x: 75, y: 70 },
  sports_niche: { x: 80, y: 60 },
  science_climate: { x: 40, y: 15 },
  science_space: { x: 50, y: 10 },
  science_health: { x: 45, y: 25 },
  lifestyle_fitness: { x: 70, y: 30 },
  lifestyle_food: { x: 65, y: 40 },
  lifestyle_travel: { x: 75, y: 45 },
  finance_crypto: { x: 90, y: 20 },
  finance_traditional: { x: 85, y: 35 },
  animals_cute: { x: 50, y: 50 },
  animals_wild: { x: 55, y: 45 },
};

// Build choice vector for a participant
// Vector where: 1 = liked, -0.5 = skipped, 0 = not seen
export function buildChoiceVector(
  choices: Choice[] | Record<string, Choice> | undefined,
  allContentIds: string[]
): number[] {
  const vector = new Array(allContentIds.length).fill(0);

  if (!choices) return vector;

  // Handle both array and Firebase object format
  const choiceArray: Choice[] = Array.isArray(choices)
    ? choices
    : Object.values(choices);

  for (const choice of choiceArray) {
    const index = allContentIds.indexOf(choice.contentId);
    if (index !== -1) {
      vector[index] = choice.action === 'like' ? 1 : -0.5;
    }
  }

  return vector;
}

// Calculate Jaccard similarity between two participants based on likes
export function calculateSimilarity(vectorA: number[], vectorB: number[]): number {
  // Get indices of liked items
  const likesA = new Set(
    vectorA.map((v, i) => (v > 0 ? i : -1)).filter((i) => i >= 0)
  );
  const likesB = new Set(
    vectorB.map((v, i) => (v > 0 ? i : -1)).filter((i) => i >= 0)
  );

  // Calculate intersection and union
  const intersection = new Set([...likesA].filter((x) => likesB.has(x)));
  const union = new Set([...likesA, ...likesB]);

  // If no likes yet, they're identical
  if (union.size === 0) return 1;

  return intersection.size / union.size;
}

// Calculate shared reality percentage across all participants
export function calculateSharedReality(participants: Participant[]): number {
  const activeParticipants = participants.filter((p) => p.isActive !== false);

  if (activeParticipants.length < 2) return 100;

  const allContentIds = contentPool.map((c) => c.id);
  let totalSimilarity = 0;
  let pairCount = 0;

  for (let i = 0; i < activeParticipants.length; i++) {
    for (let j = i + 1; j < activeParticipants.length; j++) {
      const vectorA = buildChoiceVector(activeParticipants[i].choices, allContentIds);
      const vectorB = buildChoiceVector(activeParticipants[j].choices, allContentIds);
      const sim = calculateSimilarity(vectorA, vectorB);
      totalSimilarity += sim;
      pairCount++;
    }
  }

  if (pairCount === 0) return 100;

  return Math.round((totalSimilarity / pairCount) * 100);
}

// Get choices as array (handles Firebase object format)
function getChoicesArray(choices: Choice[] | Record<string, Choice> | undefined): Choice[] {
  if (!choices) return [];
  if (Array.isArray(choices)) return choices;
  return Object.values(choices);
}

// Calculate position for a participant based on their likes
export function calculatePosition(participant: Participant): Position {
  const choices = getChoicesArray(participant.choices);
  const likes = choices.filter((c) => c.action === 'like');

  if (likes.length === 0) {
    return { x: 50, y: 50 }; // Center if no likes
  }

  let totalX = 0;
  let totalY = 0;

  for (const choice of likes) {
    const content = contentPool.find((c) => c.id === choice.contentId);
    if (content) {
      const pos = categoryPositions[content.category] || { x: 50, y: 50 };
      totalX += pos.x;
      totalY += pos.y;
    }
  }

  return {
    x: totalX / likes.length,
    y: totalY / likes.length,
  };
}

// Calculate positions for all participants
export function calculateAllPositions(
  participants: Record<string, Participant>
): Record<string, Position> {
  const positions: Record<string, Position> = {};

  for (const [odId, participant] of Object.entries(participants)) {
    positions[odId] = calculatePosition(participant);
  }

  return positions;
}

// Find dominant categories for a set of participants
export function findDominantCategories(
  memberIds: string[],
  participants: Record<string, Participant>
): string[] {
  const categoryCount: Record<string, number> = {};

  for (const odId of memberIds) {
    const participant = participants[odId];
    if (!participant) continue;

    const choices = getChoicesArray(participant.choices);
    const likes = choices.filter((c) => c.action === 'like');

    for (const choice of likes) {
      const content = contentPool.find((c) => c.id === choice.contentId);
      if (content) {
        const group = getCategoryGroup(content.category);
        categoryCount[group] = (categoryCount[group] || 0) + 1;
      }
    }
  }

  // Sort by count and return top 3
  return Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat]) => cat);
}

// Calculate cluster centroid
export function calculateClusterCentroid(
  memberIds: string[],
  participants: Record<string, Participant>
): Position {
  let totalX = 0;
  let totalY = 0;
  let count = 0;

  for (const odId of memberIds) {
    const participant = participants[odId];
    if (participant && participant.position) {
      totalX += participant.position.x;
      totalY += participant.position.y;
      count++;
    }
  }

  if (count === 0) return { x: 50, y: 50 };

  return {
    x: totalX / count,
    y: totalY / count,
  };
}

// Cluster label mapping
const clusterLabels: Record<string, string> = {
  politics: 'The News Junkies',
  tech: 'The Tech Prophets',
  entertainment: 'The Entertainers',
  science: 'The Curious Minds',
  sports: 'The Sports Fans',
  lifestyle: 'The Life Optimizers',
  finance: 'The Money Minds',
  animals: 'The Animal Lovers',
};

// Generate cluster label based on dominant categories
export function generateClusterLabel(dominantCategories: string[]): string {
  if (dominantCategories.length === 0) return 'The Eclectics';
  return clusterLabels[dominantCategories[0]] || 'The Eclectics';
}

// Detect clusters among participants
export function detectClusters(
  participants: Record<string, Participant>,
  threshold: number = 0.5
): ClusterInfo[] {
  const participantList = Object.values(participants).filter((p) => p.isActive !== false);
  const allContentIds = contentPool.map((c) => c.id);

  const clusters: ClusterInfo[] = [];
  const assigned = new Set<string>();

  for (const p of participantList) {
    if (assigned.has(p.odId)) continue;

    const cluster: string[] = [p.odId];
    assigned.add(p.odId);

    const vectorP = buildChoiceVector(p.choices, allContentIds);

    for (const other of participantList) {
      if (assigned.has(other.odId)) continue;

      const vectorOther = buildChoiceVector(other.choices, allContentIds);
      const sim = calculateSimilarity(vectorP, vectorOther);

      if (sim >= threshold) {
        cluster.push(other.odId);
        assigned.add(other.odId);
      }
    }

    if (cluster.length >= 2) {
      const dominantCategories = findDominantCategories(cluster, participants);
      clusters.push({
        id: `cluster_${clusters.length}`,
        label: generateClusterLabel(dominantCategories),
        memberIds: cluster,
        centroid: calculateClusterCentroid(cluster, participants),
        dominantCategories,
      });
    }
  }

  return clusters;
}

// Calculate total choices made
export function calculateTotalChoices(participants: Record<string, Participant>): number {
  let total = 0;
  for (const participant of Object.values(participants)) {
    const choices = getChoicesArray(participant.choices);
    total += choices.length;
  }
  return total;
}

// Calculate average progress
export function calculateAverageProgress(
  participants: Record<string, Participant>,
  totalCards: number
): number {
  const activeParticipants = Object.values(participants).filter((p) => p.isActive !== false);
  if (activeParticipants.length === 0) return 0;

  let totalProgress = 0;
  for (const participant of activeParticipants) {
    const choices = getChoicesArray(participant.choices);
    totalProgress += (choices.length / totalCards) * 100;
  }

  return Math.round(totalProgress / activeParticipants.length);
}

// Find most unique participant (lowest average similarity to others)
export function findMostUnique(participants: Record<string, Participant>): string {
  const participantList = Object.values(participants).filter((p) => p.isActive !== false);
  if (participantList.length < 2) return '';

  const allContentIds = contentPool.map((c) => c.id);
  let mostUnique = '';
  let lowestAvgSimilarity = 1;

  for (const p of participantList) {
    const vectorP = buildChoiceVector(p.choices, allContentIds);
    let totalSim = 0;
    let count = 0;

    for (const other of participantList) {
      if (other.odId === p.odId) continue;
      const vectorOther = buildChoiceVector(other.choices, allContentIds);
      totalSim += calculateSimilarity(vectorP, vectorOther);
      count++;
    }

    const avgSim = count > 0 ? totalSim / count : 1;
    if (avgSim < lowestAvgSimilarity) {
      lowestAvgSimilarity = avgSim;
      mostUnique = p.odId;
    }
  }

  return mostUnique;
}

// Find most mainstream participant (highest average similarity to others)
export function findMostMainstream(participants: Record<string, Participant>): string {
  const participantList = Object.values(participants).filter((p) => p.isActive !== false);
  if (participantList.length < 2) return '';

  const allContentIds = contentPool.map((c) => c.id);
  let mostMainstream = '';
  let highestAvgSimilarity = 0;

  for (const p of participantList) {
    const vectorP = buildChoiceVector(p.choices, allContentIds);
    let totalSim = 0;
    let count = 0;

    for (const other of participantList) {
      if (other.odId === p.odId) continue;
      const vectorOther = buildChoiceVector(other.choices, allContentIds);
      totalSim += calculateSimilarity(vectorP, vectorOther);
      count++;
    }

    const avgSim = count > 0 ? totalSim / count : 0;
    if (avgSim > highestAvgSimilarity) {
      highestAvgSimilarity = avgSim;
      mostMainstream = p.odId;
    }
  }

  return mostMainstream;
}

// Get top categories for a participant
export function getTopCategories(participant: Participant, topN: number = 3): string[] {
  const choices = getChoicesArray(participant.choices);
  const likes = choices.filter((c) => c.action === 'like');
  const categoryCount: Record<string, number> = {};

  for (const choice of likes) {
    const content = contentPool.find((c) => c.id === choice.contentId);
    if (content) {
      const group = getCategoryGroup(content.category);
      categoryCount[group] = (categoryCount[group] || 0) + 1;
    }
  }

  return Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([cat]) => cat);
}

// Get category display name
export function getCategoryDisplayName(category: string): string {
  const displayNames: Record<string, string> = {
    politics: 'Politics',
    tech: 'Technology',
    entertainment: 'Entertainment',
    science: 'Science',
    sports: 'Sports',
    lifestyle: 'Lifestyle',
    finance: 'Finance',
    animals: 'Animals',
  };
  return displayNames[category] || category;
}

// Get category emoji
export function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    politics: '📰',
    tech: '💻',
    entertainment: '🎬',
    science: '🔬',
    sports: '⚽',
    lifestyle: '✨',
    finance: '💰',
    animals: '🐾',
  };
  return emojis[category] || '📌';
}
