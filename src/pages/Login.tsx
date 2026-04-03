import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup, signInAnonymously } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Brain, Activity, UserCircle } from 'lucide-react';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName || 'Student',
          email: user.email,
          role: 'student',
          createdAt: new Date(),
          streak: 0
        });
      }
      
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError('');
    console.log("Attempting guest login...");
    try {
      const result = await signInAnonymously(auth);
      console.log("Guest login successful:", result.user.uid);
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Guest login failed:", err);
      setError(`Guest login failed: ${err.message}. Please ensure Anonymous Authentication is enabled in the Firebase Console.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8 font-body">
      <div className="w-full max-w-2xl border border-line bg-surface p-12 lg:p-20">
        <div className="flex flex-col items-center mb-16">
          <div className="w-16 h-16 bg-primary flex items-center justify-center mb-10 shadow-lg shadow-blue-200 rounded-2xl">
            <Brain className="text-white w-8 h-8" />
          </div>
          <h1 className="text-8xl font-bold tracking-tight mb-2 leading-none">Consulto</h1>
          <p className="text-2xl font-heading italic tracking-tight text-text-muted mb-6">Welcome back</p>
          <div className="flex items-center gap-3">
            <span className="col-header">Sign in to your account</span>
            <Activity className="w-3 h-3 text-accent animate-pulse" />
          </div>
        </div>

        <div className="space-y-6">
          <Button 
            className="w-full py-6 text-lg font-heading italic tracking-tight flex items-center justify-center gap-4 border border-line"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? 'INITIALIZING...' : (
              <>
                <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                SIGN IN WITH GOOGLE
              </>
            )}
          </Button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-line"></span>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-widest">
              <span className="bg-surface px-6 text-text-muted">Or</span>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              variant="outline"
              className="w-full py-6 text-lg font-heading italic tracking-tight flex items-center justify-center gap-4 border-line"
              onClick={handleGuestLogin}
              disabled={loading}
            >
              <UserCircle className="w-5 h-5" />
              CONTINUE AS GUEST
            </Button>
            <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted text-center">
              * History and progress will not be saved
            </p>
          </div>
          
          {error && <p className="text-[10px] text-danger font-mono uppercase tracking-widest text-center">{error}</p>}
        </div>

        <div className="mt-16 pt-12 border-t border-line text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
            Don't have an account? <Link to="/signup" className="text-primary font-bold ml-2 hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
