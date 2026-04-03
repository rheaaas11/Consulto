import React from 'react';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Visualizer } from './Visualizer';
import { FileIcon, ExternalLink } from 'lucide-react';
import 'katex/dist/katex.min.css';

interface Attachment {
  name: string;
  url: string;
  type: string;
}

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  onGenerateVisual?: () => void;
  attachments?: Attachment[];
}

export const MessageBubble = ({ role, content, isStreaming, onGenerateVisual, attachments }: MessageBubbleProps) => {
  const isAI = role === 'assistant';

  // Extract visual blocks
  const parts = content.split(/```json:visual\n([\s\S]*?)\n```/);
  const hasVisual = parts.length > 1;

  return (
    <div className={cn('flex w-full mb-2', isAI ? 'justify-start' : 'justify-end')}>
      <div className={cn(
        'px-5 py-3.5 max-w-[85%] font-medium text-[15px] leading-relaxed shadow-sm transition-all duration-300 relative group',
        isAI 
          ? 'bg-white border border-gray-100 text-gray-800 rounded-[24px_24px_24px_4px]' 
          : 'bg-blue-600 text-white rounded-[24px_24px_4px_24px]'
      )}>
        <div className={cn(
          'prose max-w-none break-words',
          isAI ? 'prose-slate' : 'prose-invert'
        )}>
          {parts.map((part, index) => {
            if (index % 2 === 1) {
              try {
                const visualData = JSON.parse(part);
                return <Visualizer key={index} data={visualData} />;
              } catch (e) {
                return <pre key={index} className="text-xs text-red-500 bg-red-50 p-2 rounded">Error rendering visual: {e instanceof Error ? e.message : String(e)}</pre>;
              }
            }
            return (
              <ReactMarkdown
                key={index}
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {part}
              </ReactMarkdown>
            );
          })}
          {isStreaming && (
            <span className="inline-flex gap-1 ml-1">
              <span className="w-1 h-1 bg-current opacity-40 animate-pulse" />
              <span className="w-1 h-1 bg-current opacity-40 animate-pulse [animation-delay:0.2s]" />
              <span className="w-1 h-1 bg-current opacity-40 animate-pulse [animation-delay:0.4s]" />
            </span>
          )}
        </div>

        {attachments && attachments.length > 0 && (
          <div className="mt-3 space-y-2">
            {attachments.map((file, idx) => (
              <a 
                key={idx}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center gap-2 p-2 rounded-xl text-xs font-bold transition-all border",
                  isAI 
                    ? "bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100" 
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                )}
              >
                <FileIcon className="w-4 h-4" />
                <span className="truncate flex-1">{file.name}</span>
                <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
            ))}
          </div>
        )}

        {isAI && !hasVisual && !isStreaming && onGenerateVisual && (
          <div className="mt-4 flex justify-end">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onGenerateVisual();
              }}
              className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-blue-100 hover:bg-blue-100 transition-colors shadow-sm"
            >
              Visual
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
