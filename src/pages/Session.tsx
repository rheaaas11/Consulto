import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth, storage } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useGemini } from '../hooks/useGemini';
import { UNIVERSAL_CORE_PROMPT } from '../prompts/core';
import { TOPIC_OVERLAYS } from '../prompts/topics';
import { MessageBubble } from '../components/MessageBubble';
import { VoiceInput } from '../components/VoiceInput';
import { Button } from '../components/ui/Button';
import { Send, ChevronLeft, Flag, Clock, Activity, Terminal, Brain, Paperclip, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function Session() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const { streamResponse, loading: aiLoading } = useGemini();
  
  const [session, setSession] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) return;
      const docRef = doc(db, 'sessions', sessionId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSession(data);
        setMessages(data.messages || []);
        
        // If no messages, start with opening question
        if (!data.messages || data.messages.length === 0) {
          startSession(data);
        }
      }
    };
    fetchSession();
  }, [sessionId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  const startSession = async (sessionData: any) => {
    const overlayKey = Object.keys(TOPIC_OVERLAYS).find(k => sessionData.topicId.startsWith(k)) as keyof typeof TOPIC_OVERLAYS;
    const overlay = TOPIC_OVERLAYS[overlayKey] || "";
    
    let openingQuestion = "";
    
    if (sessionData.sessionType === 'question') {
      openingQuestion = `Hello! I'm your Consulto tutor. For this Question Chat on ${sessionData.subtopicLabel}, would you like me to generate a challenging A-Level style question for you, or do you have a specific question you'd like to work through?`;
    } else {
      // Extract opening question from overlay
      const openingMatch = overlay.match(/## OPENING QUESTION\nStart (?:the session )?with: '(.+?)'/);
      openingQuestion = openingMatch 
        ? openingMatch[1] 
        : `Let's dive in. To start, could you explain in your own words how you understand the core concept of ${sessionData.subtopicLabel}?`;
    }

    const initialMessage = {
      role: 'assistant',
      content: openingQuestion,
      timestamp: new Date(),
      inputMethod: 'text'
    };

    setMessages([initialMessage]);
    await updateDoc(doc(db, 'sessions', sessionId!), {
      messages: arrayUnion(initialMessage)
    });
  };

  const handleSend = async (text: string = inputText, attachments: any[] = []) => {
    if ((!text.trim() && attachments.length === 0) || aiLoading || isStreaming) return;

    const userMessage = {
      role: 'user',
      content: text,
      timestamp: new Date(),
      inputMethod: 'text',
      attachments: attachments
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');

    await updateDoc(doc(db, 'sessions', sessionId!), {
      messages: arrayUnion(userMessage)
    });

    // Generate AI Response
    const overlayKey = Object.keys(TOPIC_OVERLAYS).find(k => session.topicId.startsWith(k)) as keyof typeof TOPIC_OVERLAYS;
    const overlay = TOPIC_OVERLAYS[overlayKey] || "";
    
    const systemInstruction = UNIVERSAL_CORE_PROMPT
      .replace('{SUBJECT}', session.subject)
      .replace('{TOPIC_LABEL}', session.topicLabel)
      .replace('{SUBTOPIC_LABEL}', session.subtopicLabel)
      .replace('{SESSION_TYPE}', session.sessionType === 'theory' ? 'Theory Chat' : 'Question Chat')
      .replace('{STUDENT_YEAR}', userData?.year || 'JC1')
      .replace('{SESSION_GOAL}', session.sessionType === 'theory' 
        ? `Explain the underlying logic of ${session.subtopicLabel} and identify subtle distinctions.` 
        : `Guide the student through solving a specific problem on ${session.subtopicLabel}, focusing on their thought process.`)
      + "\n" + overlay + "\nBe concise.";

    setIsStreaming(true);
    let fullResponse = "";
    
    const assistantMessage = {
      role: 'assistant',
      content: "",
      timestamp: new Date(),
      inputMethod: 'text'
    };
    
    setMessages(prev => [...prev, assistantMessage]);

    // Include attachment context in the prompt if any
    let promptText = text;
    if (attachments.length > 0) {
      const fileNames = attachments.map(a => a.name).join(', ');
      promptText = `[User uploaded files: ${fileNames}]\n\n${text}`;
    }

    await streamResponse(systemInstruction, [...messages, { ...userMessage, content: promptText }], (chunk) => {
      fullResponse += chunk;
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].content = fullResponse;
        return updated;
      });
    });

    setIsStreaming(false);
    
    // Update Firestore with the full assistant message
    const finalAssistantMessage = {
      ...assistantMessage,
      content: fullResponse,
      timestamp: new Date()
    };
    
    await updateDoc(doc(db, 'sessions', sessionId!), {
      messages: arrayUnion(finalAssistantMessage)
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !sessionId) return;

    try {
      setIsUploading(true);
      const storageRef = ref(storage, `sessions/${sessionId}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const attachment = {
        name: file.name,
        url: downloadURL,
        type: file.type
      };

      // Send a message with the attachment
      await handleSend(`I've uploaded a file: ${file.name}`, [attachment]);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleGenerateVisual = async (index: number) => {
    if (aiLoading || isStreaming) return;

    const targetMessage = messages[index];
    const originalContent = targetMessage.content;
    const visualPrompt = `Based on your previous message: "${originalContent}", please generate a relevant visual aid (diagram, chart, interactive, or conceptMap) that helps explain the concept. Output ONLY the JSON block wrapped in \`\`\`json:visual\`\`\`. Do not include any other text.`;

    setIsStreaming(true);
    let fullVisualResponse = "";
    
    // Use the core prompt but emphasize visual generation
    const overlayKey = Object.keys(TOPIC_OVERLAYS).find(k => session.topicId.startsWith(k)) as keyof typeof TOPIC_OVERLAYS;
    const overlay = TOPIC_OVERLAYS[overlayKey] || "";
    const systemInstruction = UNIVERSAL_CORE_PROMPT
      .replace('{SUBJECT}', session.subject)
      .replace('{TOPIC_LABEL}', session.topicLabel)
      .replace('{SUBTOPIC_LABEL}', session.subtopicLabel)
      .replace('{SESSION_TYPE}', session.sessionType === 'theory' ? 'Theory Chat' : 'Question Chat')
      .replace('{STUDENT_YEAR}', userData?.year || 'JC1')
      .replace('{SESSION_GOAL}', "Generate a high-quality visual aid for the current concept.")
      + "\n" + overlay;

    await streamResponse(systemInstruction, [...messages.slice(0, index + 1), { role: 'user', content: visualPrompt }], (chunk) => {
      fullVisualResponse += chunk;
      setMessages(prev => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          content: originalContent + "\n\n" + fullVisualResponse
        };
        return updated;
      });
    });

    setIsStreaming(false);
    
    // Update Firestore with the final combined content
    setMessages(prev => {
      const finalMessages = [...prev];
      updateDoc(doc(db, 'sessions', sessionId!), {
        messages: finalMessages
      }).catch(err => console.error("Error updating session with visual:", err));
      return finalMessages;
    });
  };

  const handleEndSession = async () => {
    if (!sessionId) return;
    await updateDoc(doc(db, 'sessions', sessionId), {
      status: 'completed',
      endedAt: new Date(),
      durationSeconds: elapsedTime
    });
    navigate(`/session/${sessionId}/summary`);
  };

  const handleGetHint = () => {
    handleSend("I'm a bit stuck. Could you give me a small nudge or a hint to help me think about this?");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!session) return null;

  return (
    <div className="h-screen flex flex-col bg-[#F9FAFB] font-body">
      {/* Top Bar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0 z-50 sticky top-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600">{session.subject}</span>
              <span className="text-gray-300">•</span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">{session.topicLabel}</span>
            </div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">{session.subtopicLabel}</h1>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Brain className="text-white w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Consultation</span>
            <span className="text-sm font-bold text-gray-900 leading-none">Consulto AI</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-bold text-blue-700 tabular-nums">{formatTime(elapsedTime)}</span>
          </div>
          <button 
            className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-full transition-colors border border-red-100" 
            onClick={handleEndSession}
          >
            END SESSION
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth"
      >
        <div className="max-w-3xl mx-auto space-y-6 pb-32">
          {messages.map((msg, i) => (
            <MessageBubble 
              key={i} 
              role={msg.role} 
              content={msg.content} 
              isStreaming={isStreaming && i === messages.length - 1}
              onGenerateVisual={msg.role === 'assistant' ? () => handleGenerateVisual(i) : undefined}
              attachments={msg.attachments}
            />
          ))}
          {(aiLoading || isStreaming) && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Thinking</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Input Bar */}
      <div className="fixed bottom-8 left-0 right-0 z-50 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-[32px] p-2 shadow-2xl flex flex-col gap-2">
            {inputText.includes('$') && (
              <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-4">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">LaTeX Preview</span>
                <div className="text-gray-900 text-lg">
                  <InlineMath math={inputText.replace(/\$/g, '')} />
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <div className="flex-1 relative flex items-center">
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={aiLoading || isStreaming || isUploading}
                  className="ml-2 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all disabled:opacity-50"
                  title="Upload file"
                >
                  {isUploading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Paperclip className="w-5 h-5" />
                  )}
                </button>

                <input 
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type or describe observations..."
                  className="w-full pl-4 pr-12 py-4 bg-transparent focus:outline-none text-gray-900 text-lg placeholder:text-gray-400 font-medium"
                  disabled={aiLoading || isStreaming || isUploading}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <VoiceInput onTranscript={setInputText} isProcessing={aiLoading || isStreaming} />
                </div>
              </div>
              
              <button 
                onClick={() => handleSend()}
                disabled={!inputText.trim() || aiLoading || isStreaming}
                className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center disabled:bg-gray-200 disabled:text-gray-400 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-200"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 px-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleGetHint}
                disabled={aiLoading || isStreaming}
                className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:text-blue-700 disabled:text-gray-400 transition-colors bg-blue-50 px-3 py-1 rounded-full border border-blue-100"
              >
                Get Hint
              </button>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">System Active</span>
              </div>
            </div>
            <p className="text-[9px] font-medium text-gray-400 uppercase tracking-widest hidden sm:block">
              Thinking Coach: Focus on first principles
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
