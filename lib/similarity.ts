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
// Arranged in a circle around center (50,50) for maximum visual separation
export const categoryPositions: CategoryPositions = {
  // Politics - top left
  politics_left: { x: 8, y: 15 },
  politics_right: { x: 18, y: 25 },
  politics_center: { x: 13, y: 35 },
  // Tech - top center
  tech_optimist: { x: 40, y: 8 },
  tech_pessimist: { x: 50, y: 18 },
  // Science - top right
  science_climate: { x: 72, y: 8 },
  science_space: { x: 82, y: 15 },
  science_health: { x: 67, y: 20 },
  // Finance - right
  finance_crypto: { x: 92, y: 38 },
  finance_traditional: { x: 88, y: 52 },
  // Sports - bottom right
  sports_mainstream: { x: 85, y: 72 },
  sports_niche: { x: 78, y: 85 },
  // Entertainment - bottom center
  entertainment_celebrity: { x: 55, y: 92 },
  entertainment_movies: { x: 45, y: 85 },
  entertainment_gaming: { x: 62, y: 82 },
  // Lifestyle - bottom left
  lifestyle_fitness: { x: 25, y: 82 },
  lifestyle_food: { x: 18, y: 72 },
  lifestyle_travel: { x: 32, y: 90 },
  // Animals - left
  animals_cute: { x: 8, y: 55 },
  animals_wild: { x: 15, y: 65 },
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

// Cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  if (magA === 0 || magB === 0) return 1; // No choices yet = identical
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

// The 8 main category groups for building preference vectors
const categoryGroups = ['politics', 'tech', 'entertainment', 'science', 'sports', 'lifestyle', 'finance', 'animals'];

// Build a category-group preference vector (8 dimensions, normalized)
function buildCategoryVector(participant: Participant): number[] {
  const choices = getChoicesArray(participant.choices);
  const likes = choices.filter((c) => c.action === 'like');
  const vec = new Array(categoryGroups.length).fill(0);

  for (const choice of likes) {
    const content = contentPool.find((c) => c.id === choice.contentId);
    if (content) {
      const group = getCategoryGroup(content.category);
      const idx = categoryGroups.indexOf(group);
      if (idx >= 0) vec[idx]++;
    }
  }

  // Normalize to proportions
  const total = vec.reduce((a: number, b: number) => a + b, 0);
  if (total > 0) {
    for (let i = 0; i < vec.length; i++) vec[i] /= total;
  }

  return vec;
}

// Calculate shared reality percentage across all participants
// Uses category-group cosine similarity (not content-level Jaccard) so that
// people who like the same TYPES of content show as similar even if they
// saw different specific headlines.
export function calculateSharedReality(participants: Participant[]): number {
  const activeParticipants = participants.filter((p) => p.isActive !== false);

  if (activeParticipants.length < 2) return 100;

  // How many choices on average? Used for gradual onset.
  const avgChoices = activeParticipants.reduce((sum, p) => {
    return sum + getChoicesArray(p.choices).length;
  }, 0) / activeParticipants.length;

  const vectors = activeParticipants.map(buildCategoryVector);

  let totalSimilarity = 0;
  let pairCount = 0;

  for (let i = 0; i < vectors.length; i++) {
    for (let j = i + 1; j < vectors.length; j++) {
      const sim = cosineSimilarity(vectors[i], vectors[j]);
      totalSimilarity += sim;
      pairCount++;
    }
  }

  if (pairCount === 0) return 100;

  const rawReality = Math.round((totalSimilarity / pairCount) * 100);

  // Gradual onset: with very few choices, stay closer to 100%
  // Full effect after ~10 choices per person
  const onset = Math.min(1, avgChoices / 10);
  return Math.round(100 - (100 - rawReality) * onset);
}

// Get choices as array (handles Firebase object format)
function getChoicesArray(choices: Choice[] | Record<string, Choice> | undefined): Choice[] {
  if (!choices) return [];
  if (Array.isArray(choices)) return choices;
  return Object.values(choices);
}

// Calculate position for a participant based on their likes
// Uses dominant-category weighting + amplification from center so that
// people with different preferences visually spread across the map.
export function calculatePosition(participant: Participant): Position {
  const choices = getChoicesArray(participant.choices);
  const likes = choices.filter((c) => c.action === 'like');

  if (likes.length === 0) {
    // Slight random spread so new participants don't all stack at dead center
    return { x: 45 + Math.random() * 10, y: 45 + Math.random() * 10 };
  }

  // Count likes per subcategory
  const subcategoryWeights: Record<string, number> = {};
  for (const choice of likes) {
    const content = contentPool.find((c) => c.id === choice.contentId);
    if (content) {
      subcategoryWeights[content.category] = (subcategoryWeights[content.category] || 0) + 1;
    }
  }

  // Sort by frequency (most liked first)
  const sorted = Object.entries(subcategoryWeights).sort((a, b) => b[1] - a[1]);

  // Top-heavy weighting: dominant categories get exponentially more influence
  // This prevents averaging-to-center and makes your #1 preference drive your position
  let totalX = 0;
  let totalY = 0;
  let totalWeight = 0;

  for (let i = 0; i < sorted.length; i++) {
    const [cat, count] = sorted[i];
    const pos = categoryPositions[cat as ContentCategory] || { x: 50, y: 50 };
    // Rank bonus: #1 category gets 4x, #2 gets 2x, rest get 1x
    const rankMultiplier = i === 0 ? 4 : i === 1 ? 2 : 1;
    const weight = count * rankMultiplier;
    totalX += pos.x * weight;
    totalY += pos.y * weight;
    totalWeight += weight;
  }

  let x = totalX / totalWeight;
  let y = totalY / totalWeight;

  // Amplify offset from center to spread bubbles across the full visualization
  // Without this, averaging multiple category positions always converges to center
  const amplification = 1.8;
  x = 50 + (x - 50) * amplification;
  y = 50 + (y - 50) * amplification;

  // Clamp to valid range with padding
  x = Math.max(5, Math.min(95, x));
  y = Math.max(5, Math.min(95, y));

  return { x, y };
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
