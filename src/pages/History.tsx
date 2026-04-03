import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { ChevronLeft, Calendar, Clock, ChevronRight, BookOpen, Activity } from 'lucide-react';
import { format } from 'date-fns';

export default function History() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchHistory = async () => {
        const q = query(
          collection(db, 'sessions'),
          where('userId', '==', user.uid),
          where('status', '==', 'completed'),
          orderBy('endedAt', 'desc')
        );
        const snapshot = await getDocs(q);
        setSessions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      };
      fetchHistory();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-background flex flex-col font-body">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center gap-4 sticky top-0 z-50">
        <Link to="/dashboard">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Session Archive</h1>
      </header>

      <main className="flex-1 p-6 md:p-12 max-w-5xl mx-auto w-full">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Past Thinking Sessions</h2>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{sessions.length} Total</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center animate-pulse shadow-lg shadow-blue-200">
              <Activity className="text-white w-6 h-6" />
            </div>
          </div>
        ) : sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => (
              <Link key={session.id} to={`/session/${session.id}/summary`} className="block group">
                <div className="bg-white p-6 rounded-[32px] border border-gray-100 card-shadow hover:border-blue-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                      <BookOpen className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-gray-900">{session.topicLabel}</h3>
                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-widest border ${
                          session.sessionType === 'theory' 
                            ? 'bg-blue-50 text-blue-600 border-blue-100' 
                            : 'bg-purple-50 text-purple-600 border-purple-100'
                        }`}>
                          {session.sessionType === 'theory' ? 'Theory' : 'Question'}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">{session.subtopicLabel} • {session.subject}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8 text-sm font-medium text-gray-500">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mb-1">Date</span>
                      <span className="text-gray-900">{format(session.endedAt.toDate(), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mb-1">Duration</span>
                      <span className="text-gray-900">{Math.round(session.durationSeconds / 60)} MIN</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[40px] border border-gray-100 card-shadow">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <BookOpen className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No sessions yet</h3>
            <p className="text-sm text-gray-400 font-medium mb-10">Start your first tutoring session today!</p>
            <Link to="/dashboard">
              <button className="px-10 py-4 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                Go to Dashboard
              </button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
