import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  update,
  get,
  remove,
  Database,
  onDisconnect,
  serverTimestamp,
} from 'firebase/database';
import {
  Session,
  Participant,
  Choice,
  GameState,
  SessionConfig,
  SessionStats,
  Position,
} from '@/types';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (only once)
let app: FirebaseApp;
let db: Database;

function initFirebase() {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  db = getDatabase(app);
  return { app, db };
}

// Get database instance
export function getDb(): Database {
  if (!db) {
    initFirebase();
  }
  return db;
}

// Generate random session ID (6 alphanumeric characters)
export function generateSessionId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed ambiguous chars (0, O, I, 1)
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generate random participant ID
export function generateParticipantId(): string {
  return `p_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Default session config
const defaultConfig: SessionConfig = {
  maxParticipants: 50,
  cardsPerParticipant: 40,
  roundDurationSeconds: 180,
  contentCategories: [],
};

// Default session stats
const defaultStats: SessionStats = {
  sharedReality: 100,
  totalChoicesMade: 0,
  averageProgress: 0,
  clusters: [],
  mostUnique: '',
  mostMainstream: '',
};

// Create a new session
export async function createSession(customConfig?: Partial<SessionConfig>): Promise<string> {
  const database = getDb();
  const sessionId = generateSessionId();
  const sessionRef = ref(database, `sessions/${sessionId}`);

  const session: Session = {
    id: sessionId,
    createdAt: Date.now(),
    gameState: 'waiting',
    config: { ...defaultConfig, ...customConfig },
    participants: {},
    stats: defaultStats,
  };

  await set(sessionRef, session);
  return sessionId;
}

// Check if session exists
export async function sessionExists(sessionId: string): Promise<boolean> {
  const database = getDb();
  const sessionRef = ref(database, `sessions/${sessionId}`);
  const snapshot = await get(sessionRef);
  return snapshot.exists();
}

// Subscribe to session data
export function subscribeToSession(
  sessionId: string,
  callback: (data: Session | null) => void
): () => void {
  const database = getDb();
  const sessionRef = ref(database, `sessions/${sessionId}`);
  const unsubscribe = onValue(sessionRef, (snapshot) => {
    callback(snapshot.val());
  });
  return unsubscribe;
}

// Subscribe to game state only
export function subscribeToGameState(
  sessionId: string,
  callback: (state: GameState) => void
): () => void {
  const database = getDb();
  const stateRef = ref(database, `sessions/${sessionId}/gameState`);
  const unsubscribe = onValue(stateRef, (snapshot) => {
    callback(snapshot.val() || 'waiting');
  });
  return unsubscribe;
}

// Subscribe to participants
export function subscribeToParticipants(
  sessionId: string,
  callback: (participants: Record<string, Participant>) => void
): () => void {
  const database = getDb();
  const participantsRef = ref(database, `sessions/${sessionId}/participants`);
  const unsubscribe = onValue(participantsRef, (snapshot) => {
    callback(snapshot.val() || {});
  });
  return unsubscribe;
}

// Subscribe to participant count
export function subscribeToParticipantCount(
  sessionId: string,
  callback: (count: number) => void
): () => void {
  const database = getDb();
  const participantsRef = ref(database, `sessions/${sessionId}/participants`);
  const unsubscribe = onValue(participantsRef, (snapshot) => {
    const data = snapshot.val();
    callback(data ? Object.keys(data).length : 0);
  });
  return unsubscribe;
}

// Add a participant to a session
export async function addParticipant(sessionId: string, name: string): Promise<string> {
  const database = getDb();
  const odId = generateParticipantId();
  const participantRef = ref(database, `sessions/${sessionId}/participants/${odId}`);

  const participant: Participant = {
    odId,
    name,
    joinedAt: Date.now(),
    choices: [],
    currentCardIndex: 0,
    position: { x: 50, y: 50 },
    isActive: true,
  };

  await set(participantRef, participant);

  // Set up disconnect handler to mark as inactive
  const activeRef = ref(database, `sessions/${sessionId}/participants/${odId}/isActive`);
  onDisconnect(activeRef).set(false);

  return odId;
}

// Record a choice for a participant
export async function recordChoice(
  sessionId: string,
  odId: string,
  choice: Choice,
  cardIndex?: number
): Promise<void> {
  const database = getDb();
  const choicesRef = ref(database, `sessions/${sessionId}/participants/${odId}/choices`);
  await push(choicesRef, choice);

  // Update current card index if provided (avoids an extra get() round-trip)
  if (cardIndex !== undefined) {
    const indexRef = ref(database, `sessions/${sessionId}/participants/${odId}/currentCardIndex`);
    await set(indexRef, cardIndex);
  }
}

// Update participant position
export async function updateParticipantPosition(
  sessionId: string,
  odId: string,
  position: Position
): Promise<void> {
  const database = getDb();
  const positionRef = ref(database, `sessions/${sessionId}/participants/${odId}/position`);
  await set(positionRef, position);
}

// Update multiple participant positions at once
// If previousPositions provided, only writes positions that moved > threshold
export async function updateAllPositions(
  sessionId: string,
  positions: Record<string, Position>,
  previousPositions?: Record<string, Position>,
  threshold: number = 1.5
): Promise<void> {
  const database = getDb();
  const updates: Record<string, Position> = {};

  for (const [odId, position] of Object.entries(positions)) {
    if (previousPositions) {
      const prev = previousPositions[odId];
      if (prev) {
        const dist = Math.abs(position.x - prev.x) + Math.abs(position.y - prev.y);
        if (dist < threshold) continue; // Skip — hasn't moved enough
      }
    }
    updates[`sessions/${sessionId}/participants/${odId}/position`] = position;
  }

  if (Object.keys(updates).length > 0) {
    await update(ref(database), updates);
  }
}

// Update game state
export async function updateGameState(sessionId: string, state: GameState): Promise<void> {
  const database = getDb();
  const stateRef = ref(database, `sessions/${sessionId}/gameState`);
  await set(stateRef, state);
}

// Update session stats
export async function updateSessionStats(
  sessionId: string,
  stats: Partial<SessionStats>
): Promise<void> {
  const database = getDb();
  const statsRef = ref(database, `sessions/${sessionId}/stats`);
  await update(statsRef, stats);
}

// Set timer end timestamp
export async function setTimerEnd(sessionId: string, endTimestamp: number | null): Promise<void> {
  const database = getDb();
  const timerRef = ref(database, `sessions/${sessionId}/timerEnd`);
  await set(timerRef, endTimestamp);
}

// Reset session (clear participants, reset state)
export async function resetSession(sessionId: string): Promise<void> {
  const database = getDb();
  const updates: Record<string, unknown> = {
    [`sessions/${sessionId}/gameState`]: 'waiting',
    [`sessions/${sessionId}/participants`]: {},
    [`sessions/${sessionId}/stats`]: defaultStats,
    [`sessions/${sessionId}/timerEnd`]: null,
  };
  await update(ref(database), updates);
}

// Delete session
export async function deleteSession(sessionId: string): Promise<void> {
  const database = getDb();
  const sessionRef = ref(database, `sessions/${sessionId}`);
  await remove(sessionRef);
}

// Get session data once
export async function getSession(sessionId: string): Promise<Session | null> {
  const database = getDb();
  const sessionRef = ref(database, `sessions/${sessionId}`);
  const snapshot = await get(sessionRef);
  return snapshot.val();
}

// Update participant cluster assignment
export async function updateParticipantCluster(
  sessionId: string,
  odId: string,
  cluster: string
): Promise<void> {
  const database = getDb();
  const clusterRef = ref(database, `sessions/${sessionId}/participants/${odId}/cluster`);
  await set(clusterRef, cluster);
}
