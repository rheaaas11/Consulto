import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Brain, Users, BarChart3, FileText, ChevronLeft, Activity, ChevronRight } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function TeacherDashboard() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData?.role !== 'teacher' && userData?.role !== 'admin') {
      // navigate('/dashboard');
    }
    
    const fetchStudents = async () => {
      const q = query(collection(db, 'users'), where('role', '==', 'student'));
      const snapshot = await getDocs(q);
      setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchStudents();
  }, [userData, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col font-body">
      <header className="bg-surface border-b border-line px-8 py-6 flex items-center gap-6 sticky top-0 z-50">
        <Link to="/dashboard">
          <Button variant="ghost" size="icon" className="hover:bg-primary hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary flex items-center justify-center">
            <Brain className="text-white w-6 h-6" />
          </div>
          <h1 className="text-3xl font-heading italic tracking-tighter">Teacher Portal</h1>
        </div>
      </header>

      <main className="flex-1 p-8 md:p-12 max-w-7xl mx-auto w-full">
        <div className="mb-16 border-b border-line pb-8">
          <h1 className="text-7xl font-heading italic tracking-tighter mb-4">Class Overview</h1>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">Monitor student progress and identify recurring misconceptions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line mb-16">
          <StatCard icon={<Users className="w-5 h-5" />} title="Total Students" value={students.length.toString()} />
          <StatCard icon={<BarChart3 className="w-5 h-5" />} title="Avg. Readiness" value="Progressing" />
          <StatCard icon={<FileText className="w-5 h-5" />} title="Sessions This Week" value="124" />
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <h2 className="col-header">Student Roster</h2>
            <Activity className="w-3 h-3 opacity-30" />
          </div>
          
          <div className="grid grid-cols-1 gap-px bg-line border border-line">
            <div className="bg-background p-4 grid grid-cols-4 gap-4">
              <span className="col-header">Student Name</span>
              <span className="col-header">Email Address</span>
              <span className="col-header">Streak</span>
              <span className="col-header text-right">Actions</span>
            </div>
            
            {students.map((student) => (
              <div key={student.id} className="bg-surface p-6 grid grid-cols-4 gap-4 items-center hover:bg-primary hover:text-white transition-colors group">
                <span className="text-2xl font-heading italic tracking-tight leading-none">{student.name || 'Anonymous'}</span>
                <span className="font-mono text-[10px] opacity-60 group-hover:opacity-100">{student.email}</span>
                <span className="data-value text-accent group-hover:text-white">{student.streak || 0} DAYS</span>
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" className="font-mono text-[10px] uppercase tracking-widest group-hover:bg-white group-hover:text-primary">
                    View History <ChevronRight className="w-3 h-3 ml-2" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) {
  return (
    <div className="bg-surface p-10 flex items-center gap-6">
      <div className="w-12 h-12 border border-line flex items-center justify-center text-accent">
        {icon}
      </div>
      <div>
        <p className="col-header mb-1">{title}</p>
        <p className="text-4xl font-heading italic tracking-tighter leading-none">{value}</p>
      </div>
    </div>
  );
}
