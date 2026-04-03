import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { ChevronLeft, User, Check, Save, Activity } from 'lucide-react';
import { db, auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export default function Profile() {
  const { user, userData } = useAuth();
  const [name, setName] = useState(userData?.name || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errInfo = {
      error: errorMessage,
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', errInfo);
    throw new Error(errorMessage);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const path = `users/${user.uid}`;
    try {
      await setDoc(doc(db, 'users', user.uid), {
        name,
      }, { merge: true });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-body">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center gap-4 sticky top-0 z-50">
        <Link to="/dashboard">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Profile Settings</h1>
      </header>

      <main className="flex-1 p-6 md:p-12 max-w-4xl mx-auto w-full">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Account</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Manage your student identity</span>
            <Activity className="w-3 h-3 text-blue-600 animate-pulse" />
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[40px] border border-gray-100 card-shadow p-10">
            <div className="flex items-center gap-3 mb-10 border-b border-gray-50 pb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <User className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Identity Information</h2>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 font-medium text-gray-900 transition-all"
                  placeholder="Enter your name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Email Address</label>
                <div className="w-full px-6 py-4 bg-gray-100 border border-gray-100 rounded-2xl font-medium text-gray-400 cursor-not-allowed">
                  {user?.email}
                </div>
                <p className="text-[10px] text-gray-400 font-medium mt-2 ml-1 italic">Email cannot be changed</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {success && (
              <div className="flex items-center gap-2 text-green-600 font-bold text-sm animate-in fade-in slide-in-from-left-4">
                <div className="w-6 h-6 bg-green-50 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                Profile updated successfully!
              </div>
            )}
            <div className="flex-1" />
            <button 
              onClick={handleSave} 
              disabled={saving} 
              className="px-10 py-4 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-700 transition-all hover:scale-105 shadow-lg shadow-blue-200 disabled:opacity-50 disabled:scale-100"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
