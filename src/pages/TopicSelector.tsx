import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { SYLLABUS } from '../data/syllabus';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { ChevronLeft, ChevronRight, Search, BookOpen, Activity, Brain, Sparkles } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export default function TopicSelector() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>('');
  const [sessionType, setSessionType] = useState<'theory' | 'question'>('theory');
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  const subject = Object.values(SYLLABUS).find(s => s.id === subjectId);

  if (!subject) {
    return <div>Subject not found</div>;
  }

  const handleStartSession = async (overrideTopic?: any, overrideSubtopic?: string, overrideType?: 'theory' | 'question') => {
    const topic = overrideTopic || selectedTopic;
    const subtopic = overrideSubtopic || selectedSubtopic;
    const type = overrideType || sessionType;

    if (!topic || !subtopic || !auth.currentUser) return;

    try {
      const sessionRef = await addDoc(collection(db, 'sessions'), {
        userId: auth.currentUser.uid,
        subject: subject.name,
        subjectId: subject.id,
        topicId: topic.id,
        topicLabel: topic.name,
        subtopicId: subtopic,
        subtopicLabel: subtopic,
        sessionType: type,
        startedAt: Timestamp.now(),
        status: 'active',
        messages: []
      });
      navigate(`/session/${sessionRef.id}`);
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-body">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link to="/dashboard">
            <button className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-500">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{subject.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
            <Brain className="text-white w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900">Consulto</span>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-12 max-w-5xl mx-auto w-full">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Syllabus Explorer</span>
            </div>
            <div className="h-px flex-1 bg-gray-100"></div>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8 leading-tight">
            Select Topic
          </h2>
          
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text"
              placeholder="Search topics or subtopics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-8 py-5 bg-white border border-gray-100 rounded-3xl text-sm font-medium focus:outline-none focus:border-blue-200 focus:shadow-xl focus:shadow-blue-500/5 transition-all placeholder:text-gray-300"
            />
          </div>
        </div>

        {subject.sections.length > 1 && (
          <div className="flex items-center gap-2 mb-12 bg-gray-50 p-1.5 rounded-3xl border border-gray-100 w-fit">
            {subject.sections.map((section, idx) => (
              <button
                key={section.name}
                onClick={() => setActiveSectionIndex(idx)}
                className={`px-8 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
                  activeSectionIndex === idx 
                    ? 'bg-white text-blue-600 shadow-sm border border-gray-100' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {section.name}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-16 pb-32">
          {subject.sections.filter((_, idx) => subject.sections.length <= 1 || idx === activeSectionIndex).map((section) => {
            const filteredTopics = section.topics.filter(t => 
              t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
              t.subtopics.some(st => st.toLowerCase().includes(searchQuery.toLowerCase()))
            );

            if (filteredTopics.length === 0) return null;

            // Group topics by their 'group' property
            const groups = filteredTopics.reduce((acc: Record<string, any[]>, topic) => {
              const groupName = topic.group || 'General';
              if (!acc[groupName]) acc[groupName] = [];
              acc[groupName].push(topic);
              return acc;
            }, {});

            return (
              <div key={section.name} className="space-y-12">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">{section.name}</h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{filteredTopics.length} Topics</span>
                </div>
                
                {Object.entries(groups).map(([groupName, groupTopics]) => (
                  <div key={groupName} className="space-y-6">
                    {groupName !== 'General' && (
                      <div className="flex items-center gap-3">
                        <div className="h-px w-8 bg-blue-200"></div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-blue-400">{groupName}</h4>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {groupTopics.map((topic) => (
                        <div 
                          key={topic.id} 
                          className="bg-white p-8 rounded-[32px] border border-gray-100 flex flex-col h-full hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all group"
                        >
                          <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <BookOpen className="w-5 h-5" />
                              </div>
                              <h4 className="text-xl font-bold text-gray-900 tracking-tight leading-tight">{topic.name}</h4>
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Subtopics</span>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartSession(topic, topic.subtopics[0], 'question');
                                }}
                                className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors"
                              >
                                <Sparkles className="w-3 h-3" />
                                Quick Question
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {topic.subtopics.map((subtopic) => {
                                const isSelected = selectedTopic?.id === topic.id && selectedSubtopic === subtopic;
                                return (
                                  <button
                                    key={subtopic}
                                    onClick={() => {
                                      setSelectedTopic(topic);
                                      setSelectedSubtopic(subtopic);
                                    }}
                                    className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all border ${
                                      isSelected 
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200' 
                                        : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100'
                                    }`}
                                  >
                                    {subtopic}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      {selectedTopic && selectedSubtopic && (
        <div className="fixed bottom-8 left-0 right-0 px-4 z-50">
          <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-xl border border-gray-200 rounded-[32px] p-4 shadow-2xl flex flex-col md:flex-row items-center gap-6 animate-in slide-in-from-bottom-full">
            <div className="flex items-center gap-6 flex-1 w-full md:w-auto">
              <div className="hidden md:flex flex-col flex-1 px-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Selected Module</span>
                <span className="text-lg font-bold text-blue-600 truncate">{selectedTopic.name}</span>
              </div>
              <div className="h-10 w-px bg-gray-100 hidden md:block"></div>
              <div className="flex flex-col flex-1 px-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Focus Area</span>
                <span className="text-lg font-bold text-gray-900 truncate">{selectedSubtopic}</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 bg-gray-50 p-2 rounded-3xl border border-gray-100 w-full md:w-auto">
              <button 
                onClick={() => setSessionType('theory')}
                className={`flex-1 md:flex-none px-6 py-3 rounded-2xl transition-all flex flex-col items-center gap-1 ${
                  sessionType === 'theory' 
                    ? 'bg-white text-blue-600 shadow-sm border border-gray-100' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest">Theory Chat</span>
                <span className="text-[8px] font-medium opacity-60">Conceptual Mastery</span>
              </button>
              <button 
                onClick={() => setSessionType('question')}
                className={`flex-1 md:flex-none px-6 py-3 rounded-2xl transition-all flex flex-col items-center gap-1 ${
                  sessionType === 'question' 
                    ? 'bg-white text-blue-600 shadow-sm border border-gray-100' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest">Question Chat</span>
                <span className="text-[8px] font-medium opacity-60">Problem Solving</span>
              </button>
            </div>

            <button 
              className="w-full md:w-auto px-10 py-4 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
              onClick={() => handleStartSession()}
            >
              INITIALIZE SESSION <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
