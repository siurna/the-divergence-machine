// Game state types
export type GameState = 'waiting' | 'playing' | 'paused' | 'reveal' | 'ended';

// Content category types
export type ContentCategory =
  | 'politics_left'
  | 'politics_right'
  | 'politics_center'
  | 'tech_optimist'
  | 'tech_pessimist'
  | 'entertainment_celebrity'
  | 'entertainment_movies'
  | 'entertainment_gaming'
  | 'sports_mainstream'
  | 'sports_niche'
  | 'science_climate'
  | 'science_space'
  | 'science_health'
  | 'lifestyle_fitness'
  | 'lifestyle_food'
  | 'lifestyle_travel'
  | 'finance_crypto'
  | 'finance_traditional'
  | 'animals_cute'
  | 'animals_wild';

// Content item
export interface ContentItem {
  id: string;
  headline: string;
  imageUrl?: string;
  category: ContentCategory;
  tags: string[];
  political_lean?: number;
  sensationalism?: number;
}

// Choice made by participant
export interface Choice {
  contentId: string;
  action: 'like' | 'skip';
  timestamp: number;
  dwellTimeMs?: number;
}

// Position on dashboard
export interface Position {
  x: number;
  y: number;
}

// Participant in session
export interface Participant {
  odId: string;
  name: string;
  joinedAt: number;
  choices: Choice[];
  currentCardIndex: number;
  position: Position;
  cluster?: string;
  isActive: boolean;
}

// Session configuration
export interface SessionConfig {
  maxParticipants: number;
  cardsPerParticipant: number;
  roundDurationSeconds: number;
  contentCategories: string[];
}

// Cluster information
export interface ClusterInfo {
  id: string;
  label: string;
  memberIds: string[];
  centroid: Position;
  dominantCategories: string[];
}

// Session statistics
export interface SessionStats {
  sharedReality: number;
  totalChoicesMade: number;
  averageProgress: number;
  clusters: ClusterInfo[];
  mostUnique: string;
  mostMainstream: string;
}

// Full session object
export interface Session {
  id: string;
  createdAt: number;
  gameState: GameState;
  config: SessionConfig;
  participants: Record<string, Participant>;
  stats: SessionStats;
  timerEnd?: number;
}

// Phone client local state
export interface PhoneClientState {
  sessionId: string;
  odId: string;
  name: string;
  screen: 'join' | 'waiting' | 'playing' | 'complete';
  currentCardIndex: number;
  contentQueue: ContentItem[];
  choices: Choice[];
  isConnected: boolean;
}

// Dot visualization data
export interface DotData {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
  size: number;
}

// Category position mapping for visualization
export interface CategoryPosition {
  x: number;
  y: number;
}

export type CategoryPositions = Record<ContentCategory, CategoryPosition>;
