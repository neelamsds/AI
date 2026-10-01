import React, { useState } from 'react';
import {
  Mail,
  Send,
  MessageSquare,
  Music,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { DispatchConfig, DispatchLogItem, MantraPublication } from '../types/vedic';

interface MultiChannelHubProps {
  config: DispatchConfig;
  logs: DispatchLogItem[];
  publication: MantraPublication;
  onUpdateConfig: (newConfig: Partial<DispatchConfig>) => void;
  onDispatch: (channel: 'email' | 'telegram' | 'whatsapp' | 'all') => void;
  isDispatching: boolean;
  onRefreshLogs: () => void;
}

export const MultiChannelHub: React.FC<MultiChannelHubProps> = ({
  config,
  logs,
  publication,
  onUpdateConfig,
  onDispatch,
  isDispatching,
  onRefreshLogs
}) => {
  const [emailTo, setEmailTo] = useState(config.emailRecipient);
  const [tgToken, setTgToken] = useState(config.telegramBotToken);
  const [tgChatId, setTgChatId] = useState(config.telegramChatId);
  const [waPhone, setWaPhone] = useState(config.whatsAppPhone);
  const [waGroup, setWaGroup] = useState(config.whatsAppGroupId);
  const [savedNote, setSavedNote] = useState(false);

  const handleSaveSettings = () => {
    onUpdateConfig({
      emailRecipient: emailTo,
      telegramBotToken: tgToken,
      telegramChatId: tgChatId,
      whatsAppPhone: waPhone,
      whatsAppGroupId: waGroup
    });
    setSavedNote(true);
    setTimeout(() => setSavedNote(false), 2500);
  };

  const { metadata } = publication;

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-[#FFFDF8] border border-amber-900/15 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 mb-1">
              Multi-Channel Dispatch Hub
            </h3>
            <p className="text-xs sm:text-sm text-stone-600">
              Deliver daily Atharvaveda publications to Email, Telegram Bot, and WhatsApp with the chant audio attached.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {savedNote && (
              <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
              </span>
            )}
            <button
              onClick={handleSaveSettings}
              className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-stone-800 bg-amber-100 hover:bg-amber-200 rounded border border-amber-300 transition-colors cursor-pointer"
            >
              Save Channel Settings
            </button>
            <button
              onClick={() => onDispatch('all')}
              disabled={isDispatching}
              className="px-4 py-1.5 text-xs sm:text-sm font-medium text-white bg-amber-800 hover:bg-amber-900 rounded transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isDispatching ? 'Dispatching...' : 'Dispatch All Channels'}
            </button>
          </div>
        </div>
      </div>

      {/* Grid of 3 Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Channel 1: Email (SMTP) */}
        <div className="bg-[#FFFDF8] border border-amber-900/15 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-amber-900/10 pb-2">
              <div className="flex items-center gap-2 text-amber-900 font-serif font-bold text-base">
                <Mail className="w-4 h-4 text-amber-800" />
                <span>Email Publisher</span>
              </div>
              <span className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                MP3 MIME Attachment
              </span>
            </div>

            <p className="text-xs text-stone-600 mb-3">
              Sends an illuminated parchment HTML email with full 15 steps and attaches the MP3 audio chant file.
            </p>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Recipient Email Address
                </label>
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  className="w-full text-xs font-mono bg-white border border-stone-300 rounded px-2.5 py-1.5 text-stone-800 focus:outline-amber-700"
                />
              </div>

              <div className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded border border-stone-200 space-y-1">
                <div className="flex items-center gap-1.5 text-stone-700 font-medium">
                  <Music className="w-3 h-3 text-amber-700" />
                  <span>Audio Attachment:</span>
                </div>
                <div className="truncate font-mono text-[10px]">
                  Atharvaveda_{metadata.kanda}_{metadata.sukta}_{metadata.mantra}.mp3
                </div>
                <div className="text-emerald-700">✓ Ready to send to {emailTo}</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onDispatch('email')}
            disabled={isDispatching}
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white bg-amber-800 hover:bg-amber-900 rounded transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Email with MP3 Now</span>
          </button>
        </div>

        {/* Channel 2: Telegram Bot */}
        <div className="bg-[#FFFDF8] border border-amber-900/15 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-amber-900/10 pb-2">
              <div className="flex items-center gap-2 text-sky-900 font-serif font-bold text-base">
                <Send className="w-4 h-4 text-sky-700" />
                <span>Telegram Bot</span>
              </div>
              <span className="text-[11px] text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                sendAudio Native
              </span>
            </div>

            <p className="text-xs text-stone-600 mb-3">
              Posts the complete publication and attaches the chant MP3 directly into chat via Telegram Bot API.
            </p>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Telegram Chat ID / Client ID
                </label>
                <input
                  type="text"
                  value={tgChatId}
                  onChange={(e) => setTgChatId(e.target.value)}
                  placeholder="e.g. 123456789 or @my_channel"
                  className="w-full text-xs font-mono bg-white border border-stone-300 rounded px-2.5 py-1.5 text-stone-800 focus:outline-sky-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Bot Token (from @BotFather)
                </label>
                <input
                  type="password"
                  value={tgToken}
                  onChange={(e) => setTgToken(e.target.value)}
                  placeholder="e.g. 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                  className="w-full text-xs font-mono bg-white border border-stone-300 rounded px-2.5 py-1.5 text-stone-800 focus:outline-sky-700"
                />
              </div>

              <div className="text-[11px] text-stone-500 bg-sky-50/50 p-2 rounded border border-sky-100">
                <span>Method: <code>sendMessage</code> + <code>sendAudio</code></span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onDispatch('telegram')}
            disabled={isDispatching}
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white bg-sky-700 hover:bg-sky-800 rounded transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Telegram & Audio</span>
          </button>
        </div>

        {/* Channel 3: WhatsApp & WhatsApp Group */}
        <div className="bg-[#FFFDF8] border border-amber-900/15 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-amber-900/10 pb-2">
              <div className="flex items-center gap-2 text-emerald-900 font-serif font-bold text-base">
                <MessageSquare className="w-4 h-4 text-emerald-700" />
                <span>WhatsApp & Group</span>
              </div>
              <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Click-to-Send & API
              </span>
            </div>

            <p className="text-xs text-stone-600 mb-3">
              One-click pre-formatted payload launcher for personal chat or WhatsApp Group with audio stream link.
            </p>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Recipient Phone Number (with Country Code)
                </label>
                <input
                  type="text"
                  value={waPhone}
                  onChange={(e) => setWaPhone(e.target.value)}
                  placeholder="+919876543210"
                  className="w-full text-xs font-mono bg-white border border-stone-300 rounded px-2.5 py-1.5 text-stone-800 focus:outline-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  WhatsApp Group Invite Code / ID
                </label>
                <input
                  type="text"
                  value={waGroup}
                  onChange={(e) => setWaGroup(e.target.value)}
                  placeholder="e.g. Kjd98a7sd78a"
                  className="w-full text-xs font-mono bg-white border border-stone-300 rounded px-2.5 py-1.5 text-stone-800 focus:outline-emerald-700"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => onDispatch('whatsapp')}
              disabled={isDispatching}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded transition-colors disabled:opacity-50 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Launch WhatsApp Web / App</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dispatch History & Audit Logs */}
      <div className="bg-[#FFFDF8] border border-amber-900/15 rounded-lg p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b border-amber-900/10 pb-3">
          <div className="flex items-center gap-2 font-serif font-bold text-stone-900">
            <Clock className="w-4 h-4 text-amber-800" />
            <span>Dispatch Activity & Delivery Audit</span>
          </div>

          <button
            onClick={onRefreshLogs}
            className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> Refresh Logs
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 font-mono">
                <th className="py-2 px-3">Timestamp</th>
                <th className="py-2 px-3">Mantra</th>
                <th className="py-2 px-3">Channel</th>
                <th className="py-2 px-3">Recipient</th>
                <th className="py-2 px-3">Audio Attached</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-amber-50/40 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-stone-500 tabular-nums whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-stone-900 whitespace-nowrap">
                    {log.mantraLabel}
                  </td>
                  <td className="py-2.5 px-3 uppercase text-[10px] font-mono font-semibold text-stone-600">
                    {log.channel}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-stone-700 truncate max-w-[160px]">
                    {log.recipient}
                  </td>
                  <td className="py-2.5 px-3">
                    {log.audioAttached ? (
                      <span className="inline-flex items-center gap-1 text-amber-800 font-medium">
                        <Music className="w-3 h-3 text-amber-700" /> Yes (.mp3)
                      </span>
                    ) : (
                      <span className="text-stone-400">None</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        log.status === 'success'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : log.status === 'simulated'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {log.status === 'success' ? 'Delivered' : log.status === 'simulated' ? 'Ready / Simulated' : 'Error'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-stone-600 truncate max-w-[280px]">
                    {log.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
