import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Brain, History, User, LogOut, ChevronRight, Sparkles, Activity } from 'lucide-react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { motion } from 'motion/react';
import { SYLLABUS } from '../data/syllabus';
import { collection, query, where, orderBy, limit, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [stats, setStats] = useState({ avgReadiness: 0, totalSessions: 0 });
  const [generating, setGenerating] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedSectionIndex, setSelectedSectionIndex] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState('');

  useEffect(() => {
    if (user) {
      const fetchSessions = async () => {
        const q = query(
          collection(db, 'sessions'),
          where('userId', '==', user.uid),
          where('status', '==', 'completed'),
          orderBy('endedAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const sessions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecentSessions(sessions.slice(0, 5));

        // Calculate stats
        const completedWithSummary = sessions.filter((s: any) => s.summary?.overallReadiness);
        const totalReadiness = completedWithSummary.reduce((acc, s: any) => {
          const readiness = parseInt(s.summary.overallReadiness);
          return acc + (isNaN(readiness) ? 0 : readiness);
        }, 0);
        
        setStats({
          avgReadiness: completedWithSummary.length > 0 ? Math.round(totalReadiness / completedWithSummary.length) : 0,
          totalSessions: sessions.length
        });
      };
      fetchSessions();
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const allSubjects = Object.values(SYLLABUS);
  const selectedSubject = allSubjects.find(s => s.id === selectedSubjectId);
  const selectedSection = selectedSubject?.sections[parseInt(selectedSectionIndex)];
  const availableTopics = selectedSection ? selectedSection.topics : (selectedSubject ? selectedSubject.sections.flatMap(s => s.topics) : []);

  const handleGenerateQuestion = async () => {
    if (!user || generating || !selectedSubjectId || !selectedTopicId) return;
    setGenerating(true);
    try {
      const subject = selectedSubject;
      if (!subject) return;
      const topic = availableTopics.find(t => t.id === selectedTopicId);
      if (!topic) return;
      
      const randomSubtopic = topic.subtopics[Math.floor(Math.random() * topic.subtopics.length)];

      const sessionData = {
        userId: user.uid,
        subject: subject.name,
        subjectId: subject.id,
        topicId: topic.id,
        topicLabel: topic.name,
        subtopicId: randomSubtopic,
        subtopicLabel: randomSubtopic,
        sessionType: 'question',
        status: 'active',
        startedAt: Timestamp.now(),
        messages: []
      };

      const docRef = await addDoc(collection(db, 'sessions'), sessionData);
      navigate(`/session/${docRef.id}`);
    } catch (error) {
      console.error("Error generating question:", error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-body">
      {/* Guest Mode Notice */}
      {user?.isAnonymous && (
        <div className="bg-amber-50 border-b border-amber-100 px-8 py-2 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700 flex items-center justify-center gap-2">
            <Activity className="w-3 h-3 animate-pulse" />
            Guest Mode Active — Progress and history will not be saved after you sign out
          </p>
        </div>
      )}
      
      {/* Top Navigation */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Brain className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900">Consulto</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Current Streak</span>
            <span className="text-lg font-bold text-blue-600">{userData?.streak || 0} Days</span>
          </div>
          <div className="h-8 w-px bg-gray-100 mx-2"></div>
          <div className="flex items-center gap-2">
            <Link to="/history">
              <button className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-500">
                <History className="w-5 h-5" />
              </button>
            </Link>
            <Link to="/profile">
              <button className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-500">
                <User className="w-5 h-5" />
              </button>
            </Link>
            <button onClick={handleLogout} className="p-2 hover:bg-red-50 rounded-full transition-colors text-red-500">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
        {/* Welcome Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-2">
              Welcome back, <span className="text-blue-600">{userData?.name?.split(' ')[0] || 'Student'}</span>.
            </h1>
            <p className="text-gray-500 font-medium">Select a subject to start your consultation.</p>
          </div>
          <div className="flex items-center gap-4 bg-white border border-gray-100 p-4 rounded-3xl shadow-sm">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Average Readiness</span>
              <span className="text-xl font-bold text-gray-900">{stats.avgReadiness}%</span>
            </div>
            <div className="w-px h-8 bg-gray-100"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Sessions</span>
              <span className="text-xl font-bold text-gray-900">{stats.totalSessions}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Subjects Grid */}
          <div className="lg:col-span-8 space-y-12">
            <div className="flex items-center justify-between border-b border-gray-100 pb-6">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Your Subjects</h2>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{allSubjects.length} Active Modules</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {allSubjects.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          </div>

          {/* Sidebar / Recent Activity */}
          <div className="lg:col-span-4 space-y-12">
            <div className="bg-white border border-gray-100 rounded-[40px] p-8 shadow-xl shadow-blue-500/5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Recent Activity</h2>
                <Link to="/history" className="text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:underline">View All</Link>
              </div>

              <div className="space-y-6">
                {recentSessions.length > 0 ? (
                  recentSessions.map((session) => (
                    <Link key={session.id} to={`/session/${session.id}/summary`} className="flex items-start gap-4 p-4 rounded-3xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 truncate">{session.topicLabel}</h4>
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mt-0.5">
                          {session.subject} • {formatDistanceToNow(session.endedAt.toDate())} ago
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="h-1 flex-1 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 w-3/4"></div>
                          </div>
                          <span className="text-[9px] font-bold text-blue-600">{session.summary?.overallReadiness || '0%'}</span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-8 bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No recent sessions</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <Sparkles className="w-8 h-8 mb-6 opacity-80" />
              <h3 className="text-2xl font-bold mb-4 leading-tight">Targeted<br />Practice</h3>
              <p className="text-sm text-blue-100 mb-8 leading-relaxed opacity-80 font-medium">Choose a subject and topic to generate a specific A-Level challenge.</p>
              
              <div className="space-y-4 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Subject</label>
                  <select 
                    value={selectedSubjectId}
                    onChange={(e) => {
                      setSelectedSubjectId(e.target.value);
                      setSelectedSectionIndex('');
                      setSelectedTopicId('');
                    }}
                    className="w-full bg-white/10 border border-white/20 rounded-2xl p-3 text-sm font-bold text-white focus:outline-none focus:border-white/40 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="text-gray-900">Select Subject</option>
                    {allSubjects.map(s => (
                      <option key={s.id} value={s.id} className="text-gray-900">{s.name}</option>
                    ))}
                  </select>
                </div>

                {selectedSubject && selectedSubject.sections.length > 1 && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Paper / Section</label>
                    <select 
                      value={selectedSectionIndex}
                      onChange={(e) => {
                        setSelectedSectionIndex(e.target.value);
                        setSelectedTopicId('');
                      }}
                      className="w-full bg-white/10 border border-white/20 rounded-2xl p-3 text-sm font-bold text-white focus:outline-none focus:border-white/40 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" className="text-gray-900">Select Paper</option>
                      {selectedSubject.sections.map((s, idx) => (
                        <option key={idx} value={idx} className="text-gray-900">{s.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedSubjectId && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Topic</label>
                    <select 
                      value={selectedTopicId}
                      onChange={(e) => setSelectedTopicId(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-2xl p-3 text-sm font-bold text-white focus:outline-none focus:border-white/40 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" className="text-gray-900">Select Topic</option>
                      {availableTopics.map(t => (
                        <option key={t.id} value={t.id} className="text-gray-900">{t.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <button 
                onClick={handleGenerateQuestion}
                disabled={generating || !selectedSubjectId || !selectedTopicId}
                className="w-full py-4 bg-white text-blue-600 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? 'Generating...' : 'Generate Question'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SubjectCard({ subject }: { subject: any }) {
  return (
    <Link to={`/subjects/${subject.id}`} className="group block h-full">
      <div className="bg-white p-10 rounded-[40px] border border-gray-100 h-full flex flex-col justify-between hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 relative overflow-hidden group">
        {/* Decorative element */}
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 duration-500 ${
              subject.id === 'chemistry' ? 'bg-orange-500 shadow-orange-200' :
              subject.id === 'physics' ? 'bg-blue-500 shadow-blue-200' :
              subject.id === 'biology' ? 'bg-green-500 shadow-green-200' :
              'bg-purple-500 shadow-purple-200'
            }`}>
              <Brain className="w-7 h-7" />
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Active</span>
              </div>
            </div>
          </div>
          
          <h3 className="text-4xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-3 tracking-tight">
            {subject.name}
          </h3>
          <p className="text-base text-gray-500 font-medium leading-relaxed">
            Your dedicated AI thinking coach for H2 {subject.name}.
          </p>
        </div>
        
        <div className="relative z-10 flex items-center justify-between mt-12 pt-8 border-t border-gray-50">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Modules</span>
              <span className="text-base font-bold text-gray-900">
                {subject.sections.length}
              </span>
            </div>
            <div className="w-px h-8 bg-gray-100"></div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Level</span>
              <span className="text-base font-bold text-gray-900">H2</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-gray-50 group-hover:bg-blue-600 text-gray-400 group-hover:text-white flex items-center justify-center rounded-2xl transition-all shadow-sm group-hover:shadow-lg group-hover:shadow-blue-200 group-hover:-translate-y-1">
            <ChevronRight className="w-6 h-6" />
          </div>
        </div>
      </div>
    </Link>
  );
}
