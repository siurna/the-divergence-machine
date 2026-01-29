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
// Groups are placed as interior clusters distributed across the space.
// Subcategories within each group are close together (±3-5 units) to form
// visible organic clusters rather than outlining the viewport edges.
export const categoryPositions: CategoryPositions = {
  // Politics cluster — top left
  politics_left: { x: 17, y: 20 },
  politics_right: { x: 23, y: 20 },
  politics_center: { x: 20, y: 26 },
  // Tech cluster — top center
  tech_optimist: { x: 47, y: 16 },
  tech_pessimist: { x: 53, y: 20 },
  // Science cluster — top right
  science_climate: { x: 77, y: 20 },
  science_space: { x: 83, y: 20 },
  science_health: { x: 80, y: 26 },
  // Finance cluster — right
  finance_crypto: { x: 80, y: 47 },
  finance_traditional: { x: 84, y: 53 },
  // Sports cluster — bottom right
  sports_mainstream: { x: 77, y: 76 },
  sports_niche: { x: 83, y: 80 },
  // Entertainment cluster — bottom center
  entertainment_celebrity: { x: 47, y: 80 },
  entertainment_movies: { x: 53, y: 80 },
  entertainment_gaming: { x: 50, y: 85 },
  // Lifestyle cluster — bottom left
  lifestyle_fitness: { x: 17, y: 76 },
  lifestyle_food: { x: 23, y: 76 },
  lifestyle_travel: { x: 20, y: 82 },
  // Animals cluster — left
  animals_cute: { x: 16, y: 47 },
  animals_wild: { x: 20, y: 53 },
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
// Uses dominant-category weighting so people with strong preferences
// gravitate toward their category's cluster. Mixed interests → center area.
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
  // This makes your #1 preference drive your position toward that cluster.
  // People with diverse interests naturally land between clusters (center area).
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

  // Deterministic jitter based on participant name to avoid exact overlaps
  // when multiple people have identical preferences
  const hash = participant.odId.split('').reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0);
  const jitterX = ((hash % 100) / 100) * 6 - 3; // ±3 units
  const jitterY = (((hash >> 8) % 100) / 100) * 6 - 3;
  x += jitterX;
  y += jitterY;

  // Clamp to valid range
  x = Math.max(8, Math.min(92, x));
  y = Math.max(8, Math.min(92, y));

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

// Find dominant subcategories for a set of participants
// Returns subcategory-level names (e.g., 'tech_optimist', 'science_climate')
export function findDominantCategories(
  memberIds: string[],
  participants: Record<string, Participant>
): string[] {
  const subcategoryCount: Record<string, number> = {};

  for (const odId of memberIds) {
    const participant = participants[odId];
    if (!participant) continue;

    const choices = getChoicesArray(participant.choices);
    const likes = choices.filter((c) => c.action === 'like');

    for (const choice of likes) {
      const content = contentPool.find((c) => c.id === choice.contentId);
      if (content) {
        subcategoryCount[content.category] = (subcategoryCount[content.category] || 0) + 1;
      }
    }
  }

  // Sort by count and return top 3 subcategories
  return Object.entries(subcategoryCount)
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
// dominantCategories now contains subcategory names like 'tech_optimist'
export function generateClusterLabel(dominantCategories: string[]): string {
  if (dominantCategories.length === 0) return 'The Eclectics';
  const group = dominantCategories[0].split('_')[0];
  return clusterLabels[group] || 'The Eclectics';
}

// Detect clusters among participants using category cosine similarity
export function detectClusters(
  participants: Record<string, Participant>,
  threshold: number = 0.5
): ClusterInfo[] {
  const participantList = Object.values(participants).filter((p) => p.isActive !== false);

  const clusters: ClusterInfo[] = [];
  const assigned = new Set<string>();

  // Pre-compute category vectors for all participants
  const vectors = new Map<string, number[]>();
  for (const p of participantList) {
    vectors.set(p.odId, buildCategoryVector(p));
  }

  for (const p of participantList) {
    if (assigned.has(p.odId)) continue;

    const cluster: string[] = [p.odId];
    assigned.add(p.odId);

    const vectorP = vectors.get(p.odId)!;

    for (const other of participantList) {
      if (assigned.has(other.odId)) continue;

      const vectorOther = vectors.get(other.odId)!;
      const sim = cosineSimilarity(vectorP, vectorOther);

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

// Find most unique participant (lowest average category similarity to others)
export function findMostUnique(participants: Record<string, Participant>): string {
  const participantList = Object.values(participants).filter((p) => p.isActive !== false);
  if (participantList.length < 2) return '';

  const vectors = new Map<string, number[]>();
  for (const p of participantList) {
    vectors.set(p.odId, buildCategoryVector(p));
  }

  let mostUnique = '';
  let lowestAvgSimilarity = 1;

  for (const p of participantList) {
    const vectorP = vectors.get(p.odId)!;
    let totalSim = 0;
    let count = 0;

    for (const other of participantList) {
      if (other.odId === p.odId) continue;
      totalSim += cosineSimilarity(vectorP, vectors.get(other.odId)!);
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

// Find most mainstream participant (highest average category similarity to others)
export function findMostMainstream(participants: Record<string, Participant>): string {
  const participantList = Object.values(participants).filter((p) => p.isActive !== false);
  if (participantList.length < 2) return '';

  const vectors = new Map<string, number[]>();
  for (const p of participantList) {
    vectors.set(p.odId, buildCategoryVector(p));
  }

  let mostMainstream = '';
  let highestAvgSimilarity = 0;

  for (const p of participantList) {
    const vectorP = vectors.get(p.odId)!;
    let totalSim = 0;
    let count = 0;

    for (const other of participantList) {
      if (other.odId === p.odId) continue;
      totalSim += cosineSimilarity(vectorP, vectors.get(other.odId)!);
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
