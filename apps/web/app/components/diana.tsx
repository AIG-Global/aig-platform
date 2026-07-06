import React from 'react';

export interface DianaProps {
  role: 'welcome' | 'mission' | 'platform' | 'executive';
  missionTitle?: string;
  missionProgress?: number;
  onAction?: (action: string) => void;
  compact?: boolean;
}

export const Diana: React.FC<DianaProps> = ({
  role,
  missionTitle,
  missionProgress,
  onAction,
  compact = false,
}) => {
  const getContent = () => {
    switch (role) {
      case 'welcome':
        return {
          text: "Welcome to AIGINVEST. I'm Diana.\n\nI help people turn intentions into outcomes.\n\nLet's start by creating your first mission.\n\nWhat do you want to accomplish?",
          action: "Create Mission",
        };
      case 'mission':
        return {
          text: `📌 Current Mission: "${missionTitle}"\n✨ Progress: ${missionProgress}% complete\n\nWhat's your next step?`,
          action: "Get Guidance",
        };
      case 'platform':
        return {
          text: "I'm here to help you navigate AIGINVEST.\n\nWhat would you like to learn about?",
          action: "Ask Diana",
        };
      case 'executive':
        return {
          text: "🚀 Platform Health Status\n\nActive Missions: 247 ↑12%\nCompletion Rate: 68% ✓\n\nAll systems optimal.",
          action: "View Details",
        };
      default:
        return {
          text: "How can I help?",
          action: "Continue",
        };
    }
  };

  const content = getContent();

  if (compact) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-800 rounded-lg border border-slate-700">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-lg">
          ✨
        </div>
        <div className="flex-1 text-sm text-slate-300">
          <p className="font-medium text-slate-200">{content.text.split('\n')[0]}</p>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{content.text.split('\n').slice(1).join(' ')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 items-start max-w-2xl">
      {/* Diana Avatar */}
      <div className="flex-shrink-0">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-5xl shadow-lg">
          ✨
        </div>
        <p className="text-center mt-2 text-sm font-medium text-slate-300">Diana</p>
      </div>

      {/* Message */}
      <div className="flex-1">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
          <p className="text-slate-200 whitespace-pre-line leading-relaxed">
            {content.text}
          </p>
          
          <button
            onClick={() => onAction?.(role)}
            className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            {content.action}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Diana;
