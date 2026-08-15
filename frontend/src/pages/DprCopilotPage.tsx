import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BotMessageSquare,
  Send,
  Sparkles,
  User,
  Trash2,
  Download,
  FileSearch,
  ExternalLink,
  HelpCircle,
  Clock,
  CheckCircle2,
  RefreshCw,
  Copy,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { copilotService, INITIAL_COPILOT_MESSAGES, PRESET_QUESTIONS } from '../services/copilotService';
import { CopilotMessage } from '../types';

export const DprCopilotPage: React.FC = () => {
  const { activeProject, setActiveEvidenceTarget, addToast } = useProject();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<CopilotMessage[]>(INITIAL_COPILOT_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isTyping) return;

    const userMsg: CopilotMessage = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      grounded: true,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      const response = await copilotService.askQuestion(query, messages);
      setMessages((prev) => [...prev, response]);
    } catch (err) {
      addToast('error', 'Copilot Error', 'Failed to generate response. Please retry.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleCitationClick = (page: number, section?: string, title?: string) => {
    setActiveEvidenceTarget({
      page,
      section: section || `Page ${page}`,
      title: title || 'DPR Grounded Evidence',
    });
    navigate('/evidence');
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'msg-init-reset',
        role: 'assistant',
        content: `Chat history cleared. Grounded in **${activeProject.name}**. What would you like to investigate?`,
        timestamp: 'Just now',
        grounded: true,
      },
    ]);
    addToast('info', 'Chat Cleared', 'Conversation history reset.');
  };

  const handleExportTranscript = () => {
    const transcriptText = messages
      .map((m) => `[${m.timestamp}] ${m.role.toUpperCase()}:\n${m.content}\n`)
      .join('\n---\n\n');
    const blob = new Blob([transcriptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeProject.code}_Copilot_Transcript.txt`;
    a.click();
    addToast('success', 'Transcript Exported', 'Downloaded conversation logs.');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto space-y-4">
      {/* HEADER BAR */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20">
            <BotMessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
              DPR Intelligence Copilot
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Grounded
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Knowledge Source: {activeProject.name} (148 Pages Indexed)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportTranscript}
            title="Export chat transcript"
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleClearChat}
            title="Clear conversation"
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* CHAT MESSAGES STREAM */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 rounded-2xl bg-slate-50/50 p-4 border border-slate-200/80 dark:bg-[#0c1427]/60 dark:border-slate-800">
        {messages.map((msg) => {
          const isAssistant = msg.role === 'assistant';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
            >
              {isAssistant && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white mt-1 shadow-xs">
                  <BotMessageSquare className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-2.5 ${
                  isAssistant
                    ? 'bg-white text-slate-800 shadow-xs border border-slate-200 dark:bg-[#0f172a] dark:text-slate-200 dark:border-slate-800'
                    : 'bg-blue-600 text-white shadow-md'
                }`}
              >
                {/* MESSAGE TEXT */}
                <div className="whitespace-pre-line space-y-2">
                  {msg.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* CITATIONS TAGS */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-cyan-500" />
                      Grounded Citations (Click to View):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.citations.map((cite, i) => (
                        <button
                          key={i}
                          onClick={() => handleCitationClick(cite.page, cite.section, cite.title)}
                          className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-cyan-300 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800 transition cursor-pointer"
                        >
                          <FileSearch className="h-3 w-3" />
                          <span>Page {cite.page} • {cite.section}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ACTIONABLE INSIGHTS */}
                {msg.actionableInsights && msg.actionableInsights.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Key Recommendations:
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                      {msg.actionableInsights.map((insight, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div
                  className={`text-[10px] font-mono text-right ${
                    isAssistant ? 'text-slate-400' : 'text-blue-100'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {!isAssistant && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-white mt-1 shadow-xs">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* TYPING INDICATOR */}
        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
              <BotMessageSquare className="h-4 w-4" />
            </div>
            <div className="rounded-2xl bg-white p-3.5 shadow-xs border border-slate-200 dark:bg-[#0f172a] dark:border-slate-800 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-xs text-slate-500 font-mono ml-2">Consulting DPR Knowledge Graph...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* PROMPT SUGGESTIONS CHIPS */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs no-scrollbar">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-amber-500" /> Prompts:
        </span>
        {PRESET_QUESTIONS.map((query, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(query)}
            className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-700 hover:border-blue-400 hover:text-blue-600 dark:border-slate-800 dark:bg-[#0c1427] dark:text-slate-300 dark:hover:border-cyan-500 dark:hover:text-cyan-300 transition cursor-pointer"
          >
            {query}
          </button>
        ))}
      </div>

      {/* INPUT FORM */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="relative flex items-center"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask anything about this DPR (e.g., 'What is the physical contingency provision?')..."
          className="w-full rounded-2xl border border-slate-300 bg-white py-3.5 pl-4 pr-24 text-xs text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-[#0c1427] dark:text-white"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="absolute right-2 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 disabled:opacity-40 transition cursor-pointer"
        >
          <span>Send</span>
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
};
