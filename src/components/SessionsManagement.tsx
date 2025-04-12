'use client'

import { useState, useEffect } from 'react';
import { getActiveSessions, revokeSession } from '@/lib/auth';
import { Session } from '@/types';
import { Loader2, Trash2, Calendar, Clock, Laptop, ShieldCheck } from 'lucide-react';

export default function SessionsManagement() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRevoking, setIsRevoking] = useState<number | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const activeSessions = await getActiveSessions();
      setSessions(activeSessions as Session[]);
      setError(null);
    } catch (err) {
      setError('Failed to load active sessions');
      console.error('Error loading sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId: number) => {
    try {
      setIsRevoking(sessionId);
      await revokeSession(sessionId.toString());
      setSessions(sessions.filter(session => session.id !== sessionId));
    } catch (err) {
      setError('Failed to revoke session');
      console.error('Error revoking session:', err);
    } finally {
      setIsRevoking(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-avocado-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button 
          onClick={loadSessions}
          className="mt-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Active Sessions</h2>
        <button
          onClick={loadSessions}
          className="text-sm font-medium text-avocado-600 hover:text-avocado-700 dark:text-avocado-400 dark:hover:text-avocado-300"
        >
          Refresh
        </button>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">No active sessions found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
            >
              <div className="flex justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-avocado-50 dark:bg-avocado-900/30 rounded-lg">
                    <Laptop className="h-5 w-5 text-avocado-600 dark:text-avocado-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                      {session.userAgent || 'Unknown device'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      IP: {session.ipAddress || 'Unknown'}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-3">
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span>Created: {formatDate(session.createdAt)}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>Expires: {formatDate(session.expiresAt)}</span>
                      </div>
                      {session.isRememberMe && (
                        <div className="flex items-center text-xs text-amber-600 dark:text-amber-400">
                          <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                          <span>Remember Me</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRevokeSession(session.id)}
                  disabled={isRevoking === session.id}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  {isRevoking === session.id ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Trash2 className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}