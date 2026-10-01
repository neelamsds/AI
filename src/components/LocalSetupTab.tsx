import React, { useState } from 'react';
import {
  Terminal,
  Copy,
  Check,
  Download,
  Key,
  Shield,
  FileCode,
  Play,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';
import { DispatchConfig, SchedulerState } from '../types/vedic';

interface LocalSetupTabProps {
  config: DispatchConfig;
  state: SchedulerState;
  onUpdateConfig: (newConfig: Partial<DispatchConfig>) => void;
}

export const LocalSetupTab: React.FC<LocalSetupTabProps> = ({
  config,
  state,
  onUpdateConfig
}) => {
  const [tgToken, setTgToken] = useState(config.telegramBotToken || '123456789:ABCDefGHIjkLMNopQRSTUvwxyz');
  const [tgChatId, setTgChatId] = useState(config.telegramChatId || '-1001234567890');
  const [emailTo, setEmailTo] = useState(config.emailRecipient || 'shobhasrinivas@gmail.com');
  const [smtpHost, setSmtpHost] = useState(config.smtpHost || 'smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState(config.smtpPort || 587);
  const [smtpUser, setSmtpUser] = useState(config.smtpUser || 'your_email@gmail.com');
  const [smtpPass, setSmtpPass] = useState(config.smtpPass || 'your_app_password');
  const [waPhone, setWaPhone] = useState(config.whatsAppPhone || '+919876543210');
  const [waGroup, setWaGroup] = useState(config.whatsAppGroupId || 'your_group_invite_code');
  const [cronExp, setCronExp] = useState(state.scheduleCron || '0 6 * * *');
  const [apiKey, setApiKey] = useState('YOUR_GEMINI_API_KEY');

  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);

  const generatedEnvContent = `# =================================================================
# ATHARVAVEDA DAILY SCHOLAR - LOCAL ENVIRONMENT CONFIGURATION (.env)
# =================================================================

# 1. Gemini AI API Key (For Vedic transliterations & multilingual scholarship)
GEMINI_API_KEY="${apiKey}"

# 2. Sequential Scripture Starting Point (User Selected)
START_KANDA="${state.startKanda}"
START_SUKTA="${state.startSukta}"
START_ANUVAKA="${state.startAnuvaka}"
START_MANTRA="${state.startMantra}"
AUTO_ADVANCE="${state.autoAdvance ? 'true' : 'false'}"
SCHEDULE_CRON="${cronExp}"

# 3. Telegram Bot Credentials (Chat ID / Client ID + Audio Attachment)
TELEGRAM_BOT_TOKEN="${tgToken}"
TELEGRAM_CHAT_ID="${tgChatId}"

# 4. Email (SMTP) Dispatch (Pre-addressed to shobhasrinivas@gmail.com with MP3 MIME attachment)
EMAIL_TO="${emailTo}"
EMAIL_FROM="Atharvaveda Daily <daily@atharvaveda.org>"
SMTP_HOST="${smtpHost}"
SMTP_PORT=${smtpPort}
SMTP_USER="${smtpUser}"
SMTP_PASS="${smtpPass}"

# 5. WhatsApp & WhatsApp Group Configuration
WHATSAPP_PHONE="${waPhone}"
WHATSAPP_GROUP_ID="${waGroup}"
WHATSAPP_WEBHOOK_URL=""
`;

  const copyToClipboard = (text: string, isEnv: boolean) => {
    navigator.clipboard.writeText(text);
    if (isEnv) {
      setCopiedEnv(true);
      setTimeout(() => setCopiedEnv(false), 2500);
    } else {
      setCopiedCli(true);
      setTimeout(() => setCopiedCli(false), 2500);
    }
  };

  const downloadEnvFile = () => {
    const blob = new Blob([generatedEnvContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '.env';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Intro Card */}
      <div className="bg-[#FFFDF8] border border-amber-900/15 rounded-lg p-5 shadow-xs">
        <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 mb-1 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-amber-800" />
          <span>Local Setup & .env Configuration Studio</span>
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Configure your chat client IDs, bot credentials, and starting verse pointer here to generate your production <code>.env</code> file. You can run the standalone daemon on your local computer, home server, or cloud VPS 24/7.
        </p>
      </div>

      {/* Two Column Layout: Editor + Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-6 space-y-5 bg-[#FFFDF8] border border-amber-900/15 rounded-lg p-5 shadow-xs">
          <div className="text-xs uppercase tracking-wider font-semibold text-amber-900 border-b border-amber-900/10 pb-1 flex items-center justify-between">
            <span>1. Chat Client IDs & Telegram Configuration</span>
            <span className="text-[11px] font-normal text-stone-500">Telegram Bot API</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Telegram Chat ID / Client ID
              </label>
              <input
                type="text"
                value={tgChatId}
                onChange={(e) => setTgChatId(e.target.value)}
                placeholder="e.g. 123456789 or -1001234567890"
                className="w-full text-xs font-mono bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-amber-700"
              />
              <span className="text-[11px] text-stone-500 mt-0.5 block">
                Can be your personal user ID or channel/group ID where the mantra and audio file are posted.
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Telegram Bot Token (from @BotFather)
              </label>
              <input
                type="text"
                value={tgToken}
                onChange={(e) => setTgToken(e.target.value)}
                placeholder="123456789:ABCDefGHIjkLMNopQRSTUvwxyz"
                className="w-full text-xs font-mono bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-amber-700"
              />
            </div>
          </div>

          <div className="text-xs uppercase tracking-wider font-semibold text-amber-900 border-b border-amber-900/10 pb-1 pt-2 flex items-center justify-between">
            <span>2. Email & SMTP Delivery Configuration</span>
            <span className="text-[11px] font-normal text-stone-500">MIME MP3 Attachment</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Recipient Email
              </label>
              <input
                type="email"
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
                className="w-full text-xs font-mono bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-amber-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  SMTP Host
                </label>
                <input
                  type="text"
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  className="w-full text-xs font-mono bg-white border border-stone-300 rounded px-3 py-1.5 text-stone-800 focus:outline-amber-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  SMTP Port
                </label>
                <input
                  type="number"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(parseInt(e.target.value, 10))}
                  className="w-full text-xs font-mono bg-white border border-stone-300 rounded px-3 py-1.5 text-stone-800 focus:outline-amber-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  SMTP User (Email)
                </label>
                <input
                  type="text"
                  value={smtpUser}
                  onChange={(e) => setSmtpUser(e.target.value)}
                  className="w-full text-xs font-mono bg-white border border-stone-300 rounded px-3 py-1.5 text-stone-800 focus:outline-amber-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  SMTP Password / App Password
                </label>
                <input
                  type="password"
                  value={smtpPass}
                  onChange={(e) => setSmtpPass(e.target.value)}
                  className="w-full text-xs font-mono bg-white border border-stone-300 rounded px-3 py-1.5 text-stone-800 focus:outline-amber-700"
                />
              </div>
            </div>
          </div>

          <div className="text-xs uppercase tracking-wider font-semibold text-amber-900 border-b border-amber-900/10 pb-1 pt-2 flex items-center justify-between">
            <span>3. WhatsApp Contacts & Schedule Cadence</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                WhatsApp Phone
              </label>
              <input
                type="text"
                value={waPhone}
                onChange={(e) => setWaPhone(e.target.value)}
                className="w-full text-xs font-mono bg-white border border-stone-300 rounded px-3 py-1.5 text-stone-800 focus:outline-amber-700"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                WhatsApp Group ID
              </label>
              <input
                type="text"
                value={waGroup}
                onChange={(e) => setWaGroup(e.target.value)}
                className="w-full text-xs font-mono bg-white border border-stone-300 rounded px-3 py-1.5 text-stone-800 focus:outline-amber-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Daily Cron Expression (Default: 6:00 AM)
            </label>
            <input
              type="text"
              value={cronExp}
              onChange={(e) => setCronExp(e.target.value)}
              className="w-full text-xs font-mono bg-white border border-stone-300 rounded px-3 py-1.5 text-stone-800 focus:outline-amber-700"
            />
          </div>
        </div>

        {/* Right Column: Live .env Preview & Download */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#1C1917] text-stone-200 rounded-lg p-5 shadow-sm border border-stone-800 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-stone-700 mb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-amber-500" />
                <span className="font-mono text-xs font-semibold text-amber-400">.env File Preview</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(generatedEnvContent, true)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-stone-200 bg-stone-800 hover:bg-stone-700 rounded transition-colors cursor-pointer"
                >
                  {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEnv ? 'Copied .env' : 'Copy .env'}</span>
                </button>

                <button
                  onClick={downloadEnvFile}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-stone-900 bg-amber-400 hover:bg-amber-300 rounded transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .env</span>
                </button>
              </div>
            </div>

            <pre className="text-[11px] font-mono leading-relaxed overflow-x-auto p-2 bg-black/40 rounded border border-stone-800/80 text-amber-100 max-h-[360px]">
              {generatedEnvContent}
            </pre>
          </div>

          {/* Standalone Execution Terminal Guide */}
          <div className="bg-[#FFFDF8] border border-amber-900/15 rounded-lg p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-amber-900/10 pb-2">
              <div className="font-serif font-bold text-stone-900 text-sm flex items-center gap-2">
                <Play className="w-4 h-4 text-amber-800" />
                <span>Run Standalone Locally</span>
              </div>
              <button
                onClick={() => copyToClipboard(`git clone <repo>
cd atharvaveda-scholar
npm install
cp .env.example .env
npm run local:run`, false)}
                className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
              >
                {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCli ? 'Copied Commands' : 'Copy Commands'}</span>
              </button>
            </div>

            <div className="space-y-2 text-xs text-stone-700">
              <p>Execute this command on your machine to run a single daily test dispatch:</p>
              <div className="bg-stone-900 text-stone-100 font-mono text-[11px] p-2.5 rounded">
                npm run local:run
              </div>

              <p className="pt-1">Or run the persistent 24/7 background scheduler daemon:</p>
              <div className="bg-stone-900 text-stone-100 font-mono text-[11px] p-2.5 rounded">
                npm run local:daemon
              </div>

              <div className="pt-2 text-[11px] text-stone-500 border-t border-stone-200">
                ✓ State is automatically persisted in <code>local-state.json</code>, tracking your sequential Atharvaveda progression day by day.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
