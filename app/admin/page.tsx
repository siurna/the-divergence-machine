'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { createSession, getDb, subscribeToSession, deleteSession } from '@/lib/firebase';
import { ref, get, remove } from 'firebase/database';

const ADMIN_PASSWORD = 'adminadmin123';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [sessions, setSessions] = useState<Array<{ id: string; createdAt: number; participantCount: number }>>([]);
  const [newSessionId, setNewSessionId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load existing sessions
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadSessions = async () => {
      try {
        const db = getDb();
        const sessionsRef = ref(db, 'sessions');
        const snapshot = await get(sessionsRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const sessionList = Object.entries(data).map(([id, session]: [string, any]) => ({
            id,
            createdAt: session.createdAt || Date.now(),
            participantCount: session.participants ? Object.keys(session.participants).length : 0,
          }));
          setSessions(sessionList.sort((a, b) => b.createdAt - a.createdAt));
        }
      } catch (error) {
        console.error('Failed to load sessions:', error);
      }
    };

    loadSessions();
    const interval = setInterval(loadSessions, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleCreateSession = async () => {
    setIsCreating(true);
    try {
      const sessionId = await createSession();
      setNewSessionId(sessionId);
    } catch (error) {
      console.error('Failed to create session:', error);
      alert('Failed to create session. Check Firebase configuration.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('DELETE ALL DATA? This cannot be undone!')) return;
    if (!confirm('Are you REALLY sure? All sessions will be permanently deleted.')) return;

    setIsDeleting(true);
    try {
      const db = getDb();
      const sessionsRef = ref(db, 'sessions');
      await remove(sessionsRef);
      setSessions([]);
      setNewSessionId(null);
      alert('All data deleted successfully.');
    } catch (error) {
      console.error('Failed to delete data:', error);
      alert('Failed to delete data.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm(`Delete session ${sessionId}?`)) return;
    try {
      await deleteSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (newSessionId === sessionId) setNewSessionId(null);
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  const joinUrl = newSessionId
    ? typeof window !== 'undefined'
      ? `${window.location.origin}/join/${newSessionId}`
      : `/join/${newSessionId}`
    : '';

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg-dark cyber-grid scanlines flex flex-col items-center justify-center p-6">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-pink/10 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative z-10"
        >
          <h1 className="text-4xl font-black text-center mb-2">
            <span className="text-glow-pink text-neon-pink">ADMIN</span>
          </h1>
          <p className="text-text-muted text-center mb-8 font-mono">[ RESTRICTED ACCESS ]</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className={`w-full px-6 py-4 bg-bg-card border-2 rounded-none font-mono text-xl text-center
                        focus:outline-none transition-all
                        ${passwordError
                          ? 'border-danger text-danger'
                          : 'border-neon-pink/50 focus:border-neon-pink focus:shadow-neon-pink'
                        }`}
              autoFocus
            />
            {passwordError && (
              <p className="text-danger text-center font-mono">ACCESS DENIED</p>
            )}
            <button
              type="submit"
              className="w-full py-4 bg-neon-pink text-black font-bold text-xl uppercase tracking-wider
                       hover:shadow-neon-pink transition-all"
            >
              [ AUTHENTICATE ]
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-bg-dark cyber-grid p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black">
            <span className="text-glow-pink text-neon-pink">ADMIN CONSOLE</span>
          </h1>
          <button
            onClick={handleDeleteAll}
            disabled={isDeleting}
            className="px-6 py-3 bg-danger/20 border-2 border-danger text-danger font-bold uppercase
                     hover:bg-danger hover:text-black transition-all disabled:opacity-50"
          >
            {isDeleting ? 'DELETING...' : '[ DELETE ALL DATA ]'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Session Panel */}
          <div className="bg-bg-card/50 border border-neon-blue/30 p-6">
            <h2 className="text-xl font-bold text-neon-blue mb-6">CREATE SESSION</h2>

            {!newSessionId ? (
              <button
                onClick={handleCreateSession}
                disabled={isCreating}
                className="w-full py-6 bg-gradient-to-r from-neon-blue to-neon-pink text-white
                         font-bold text-2xl uppercase tracking-wider
                         hover:shadow-neon-blue transition-all disabled:opacity-50"
              >
                {isCreating ? 'CREATING...' : '[ NEW SESSION ]'}
              </button>
            ) : (
              <div className="space-y-6">
                {/* QR Code - HUGE */}
                <div className="flex justify-center">
                  <div className="bg-white p-6 relative">
                    <QRCodeSVG value={joinUrl} size={300} level="H" />
                    <div className="absolute inset-0 pointer-events-none border-4 border-neon-blue" />
                  </div>
                </div>

                {/* Session Code - HUGE */}
                <div className="text-center">
                  <p className="text-text-muted font-mono text-sm mb-2">SESSION CODE</p>
                  <p className="text-7xl md:text-8xl font-black text-glow-cyan tracking-[0.3em]">
                    {newSessionId}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <button
                    onClick={() => router.push(`/dashboard/${newSessionId}`)}
                    className="flex-1 py-4 bg-neon-blue text-black font-bold uppercase tracking-wider
                             hover:shadow-neon-blue transition-all"
                  >
                    [ OPEN DASHBOARD ]
                  </button>
                  <button
                    onClick={() => setNewSessionId(null)}
                    className="px-6 py-4 bg-bg-elevated border border-text-muted text-text-muted
                             font-bold uppercase hover:border-white hover:text-white transition-all"
                  >
                    [ NEW ]
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sessions List */}
          <div className="bg-bg-card/50 border border-neon-pink/30 p-6">
            <h2 className="text-xl font-bold text-neon-pink mb-6">
              ACTIVE SESSIONS ({sessions.length})
            </h2>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {sessions.length === 0 ? (
                <p className="text-text-muted font-mono text-center py-8">No sessions found</p>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 bg-bg-elevated border border-text-muted/20"
                  >
                    <div>
                      <p className="font-mono text-xl text-white">{session.id}</p>
                      <p className="text-text-muted text-sm">
                        {session.participantCount} participants
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/dashboard/${session.id}`)}
                        className="px-4 py-2 bg-neon-blue/20 border border-neon-blue text-neon-blue
                                 text-sm font-bold hover:bg-neon-blue hover:text-black transition-all"
                      >
                        VIEW
                      </button>
                      <button
                        onClick={() => handleDeleteSession(session.id)}
                        className="px-4 py-2 bg-danger/20 border border-danger text-danger
                                 text-sm font-bold hover:bg-danger hover:text-black transition-all"
                      >
                        DEL
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
