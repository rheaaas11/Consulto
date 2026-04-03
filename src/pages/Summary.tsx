import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, collection, addDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { useGemini } from '../hooks/useGemini';
import { SESSION_SUMMARY_PROMPT } from '../prompts/core';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { CheckCircle2, AlertCircle, BookOpen, ChevronRight, LayoutDashboard, Brain, Activity, Sparkles, PlayCircle } from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export default function Summary() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { generateSummary } = useGemini();
  
  const [session, setSession] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionAndGenerateSummary = async () => {
      if (!sessionId) return;
      const docRef = doc(db, 'sessions', sessionId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSession(data);
        
        if (data.summary) {
          setSummary(data.summary);
          setLoading(false);
        } else {
          // Generate summary
          const transcript = data.messages.map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
          const prompt = SESSION_SUMMARY_PROMPT
            .replace('{SUBJECT}', data.subject)
            .replace('{TOPIC_LABEL}', data.topicLabel)
            .replace('{STUDENT_YEAR}', 'JC1') // Should get from user data
            .replace('{FULL_TRANSCRIPT}', transcript);
          
          const generatedSummary = await generateSummary(prompt);
          if (generatedSummary) {
            setSummary(generatedSummary);
            try {
              await updateDoc(docRef, { summary: generatedSummary });
            } catch (error) {
              console.error("Error saving summary to Firestore:", error);
              console.error("Summary object:", generatedSummary);
            }
          }
          setLoading(false);
        }
      }
    };
    fetchSessionAndGenerateSummary();
  }, [sessionId]);

  const handlePractice = async (question: any) => {
    if (!user) {
      alert("Please log in to start a practice session.");
      navigate('/login');
      return;
    }
    if (!session) return;
    
    try {
      const sessionData = {
        userId: user.uid,
        subjectId: session.subjectId,
        subject: session.subject,
        topicId: session.topicId,
        topicLabel: session.topicLabel,
        subtopicId: session.subtopicId || session.subtopicLabel,
        subtopicLabel: session.subtopicLabel,
        sessionType: 'question',
        status: 'active',
        startedAt: Timestamp.now(),
        messages: [
          {
            role: 'assistant',
            content: `Great! Let's practice this question: \n\n ${question.question} \n\n How would you approach this?`,
            timestamp: new Date()
          }
        ]
      };
      
      const docRef = await addDoc(collection(db, 'sessions'), sessionData);
      navigate(`/session/${docRef.id}`);
    } catch (error) {
      console.error("Error creating practice session:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-12 font-body">
        <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mb-12 animate-pulse shadow-2xl shadow-blue-200">
          <Brain className="text-white w-10 h-10" />
        </div>
        <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-4">Analyzing Session</h2>
        <p className="font-bold text-[10px] uppercase tracking-widest text-gray-400 text-center max-w-md">
          Consulto is synthesizing your transcript to identify strengths and misconceptions.
        </p>
      </div>
    );
  }

  if (!summary) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-12 font-body text-center">
      <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Error generating summary</h2>
      <p className="text-gray-500 mb-8 max-w-md">We encountered an issue while generating your session summary. Please try again.</p>
      <Button onClick={() => window.location.reload()}>Retry Generation</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col font-body">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Brain className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900">Consulto</span>
        </div>
        <Link to="/dashboard">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            Back to Dashboard
          </button>
        </Link>
      </header>

      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-3">
            <div className="px-4 py-2 bg-blue-50 rounded-full border border-blue-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Session Complete</span>
            </div>
            <div className="px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                {session.sessionType === 'theory' ? 'Theory Chat' : 'Question Chat'}
              </span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-tight">
            {session.topicLabel}
          </h1>
          <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
            Great work! You've completed your session on {session.subtopicLabel}. Here's your diagnostic report.
          </p>
        </div>

        {/* Diagnostic Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Readiness Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-4 bg-white p-10 rounded-[40px] border border-gray-100 card-shadow flex flex-col items-center justify-center text-center group hover:border-blue-200 transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>
            <div className={`w-32 h-32 rounded-full border-[10px] flex items-center justify-center mb-8 transition-transform group-hover:scale-110 duration-500 ${
              summary.overallReadiness >= 80 ? 'border-green-50 text-green-600' :
              summary.overallReadiness >= 50 ? 'border-blue-50 text-blue-600' :
              'border-orange-50 text-orange-600'
            }`}>
              <span className="text-5xl font-bold">{summary.overallReadiness}%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Overall Readiness</h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-[200px]">Your conceptual mastery based on the session dialogue.</p>
            
            <div className="mt-8 pt-8 border-t border-gray-50 w-full flex items-center justify-around">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Strengths</span>
                <span className="text-lg font-bold text-green-600">{summary.strengths.length}</span>
              </div>
              <div className="w-px h-8 bg-gray-100"></div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Gaps</span>
                <span className="text-lg font-bold text-red-600">{summary.areasToRevisit.length}</span>
              </div>
            </div>
          </motion.div>

          {/* Feedback Cards Column */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-[40px] border border-gray-100 card-shadow flex flex-col"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Key Strengths</h3>
              </div>
              <div className="space-y-3 flex-1">
                {summary.strengths.map((s: string, i: number) => (
                  <div key={i} className="p-4 bg-green-50/30 rounded-2xl border border-green-50/50 text-sm text-gray-700 font-medium leading-relaxed">
                    {s}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Areas to Revisit Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-[40px] border border-gray-100 card-shadow flex flex-col"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Growth Areas</h3>
              </div>
              <div className="space-y-3 flex-1">
                {summary.areasToRevisit.map((r: string, i: number) => (
                  <div key={i} className="p-4 bg-red-50/30 rounded-2xl border border-red-50/50 text-sm text-gray-700 font-medium leading-relaxed">
                    {r}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Misconceptions Card (Full Width in its column) */}
            {summary.misconceptions && summary.misconceptions.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="md:col-span-2 bg-amber-50/50 p-8 rounded-[40px] border border-amber-100 flex flex-col md:flex-row md:items-center gap-6"
              >
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-amber-900 tracking-tight mb-1">Identified Misconceptions</h3>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {summary.misconceptions.map((m: string, i: number) => (
                      <span key={i} className="px-4 py-1.5 bg-white border border-amber-200 rounded-full text-xs font-bold text-amber-700">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Practice Questions */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Recommended Practice</h2>
            <div className="px-3 py-1 bg-gray-100 rounded-full">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{summary.practiceQuestions.length} Questions</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {summary.practiceQuestions.map((q: any, i: number) => (
              <div key={i} className="bg-white p-10 rounded-[40px] border border-gray-100 card-shadow hover:border-blue-200 transition-all group relative overflow-hidden flex flex-col">
                <div className="absolute -right-4 -top-4 text-8xl font-bold text-blue-50 opacity-[0.03] group-hover:opacity-10 transition-opacity pointer-events-none">
                  {i + 1}
                </div>
                <div className="relative z-10 flex-1">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Question {i + 1}</span>
                    <div className="w-1 h-1 bg-blue-200 rounded-full"></div>
                  </div>
                  <div className="prose prose-slate max-w-none text-lg text-gray-800 font-medium leading-relaxed mb-8">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                      {q.question}
                    </ReactMarkdown>
                  </div>
                  <div className="pt-6 border-t border-gray-50 mb-8">
                    <p className="text-xs text-gray-500 leading-relaxed">
                      <span className="font-bold text-blue-600 uppercase mr-2">Hint:</span> {q.hint}
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => handlePractice(q)}
                  className="w-full py-6 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 rounded-2xl"
                >
                  <PlayCircle className="w-4 h-4" />
                  Practice Now
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12">
          <Link to={`/subjects/${session.subjectId}`}>
            <button className="px-10 py-4 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-700 transition-all hover:scale-105 shadow-lg shadow-blue-200">
              Start Related Topic
            </button>
          </Link>
          <Link to="/dashboard">
            <button className="px-10 py-4 bg-white border border-gray-200 text-gray-600 rounded-full font-bold text-sm hover:bg-gray-50 transition-all">
              Return to Dashboard
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
