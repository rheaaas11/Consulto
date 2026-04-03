import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from './ui/Button';
import { useSpeech } from '../hooks/useSpeech';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isProcessing?: boolean;
}

export const VoiceInput = ({ onTranscript, isProcessing }: VoiceInputProps) => {
  const { isListening, transcript, startListening, stopListening, setTranscript } = useSpeech();

  const handleToggle = () => {
    if (isListening) {
      stopListening();
      onTranscript(transcript);
      setTranscript('');
    } else {
      startListening();
    }
  };

  return (
    <Button
      variant={isListening ? 'danger' : 'outline'}
      size="icon"
      onClick={handleToggle}
      disabled={isProcessing}
      className={isListening ? 'animate-pulse' : ''}
    >
      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
    </Button>
  );
};
