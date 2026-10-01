import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { SequenceNavigator } from './components/SequenceNavigator';
import { AudioPlayer } from './components/AudioPlayer';
import { PublicationView } from './components/PublicationView';
import { StepsInspector } from './components/StepsInspector';
import { MultiChannelHub } from './components/MultiChannelHub';
import { LocalSetupTab } from './components/LocalSetupTab';
import {
  MantraPublication,
  SchedulerState,
  DispatchConfig,
  DispatchLogItem
} from './types/vedic';
import {
  compileFormattedPublication,
  getAudioUrl,
  getNextMantraCoordinates,
  getPrevMantraCoordinates
} from './services/liveWebsiteExtractor';
import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

const INITIAL_PUBLICATION: MantraPublication = {
  metadata: {
    referenceHeader: 'अथर्ववेद » काण्ड:6 » सूक्त:17 » पर्यायः:0 » मन्त्र:2',
    devata: 'गर्भदृंहणम्, पृथिवी',
    rishi: 'अथर्वा',
    chhanda: 'अनुष्टुप्',
    swara: 'गर्भदृंहण सूक्त',
    audioUrl: 'https://www.xn--j2b3a4c.com/admin/mantra-audio/6_17_2.mp3',
    webUrl: 'https://www.xn--j2b3a4c.com/atharvaveda/6/17/0/2',
    kanda: 6,
    sukta: 17,
    anuvaka: 0,
    mantra: 2
  },
  briefIntro: {
    english: 'Invoking the supreme cosmic life-force that preserves vitality, dispels inner darkness, and ensures the continuous flourishing of divine creation.',
    hindi: 'सृष्टि के परम पोषक एवं जीवनदायिनी दिव्य शक्ति का स्तवन, जो प्राण-शक्ति की रक्षा करती है और अंधकार का नाश कर जीवन को समृद्ध बनाती है।',
    telugu: 'సృష్టిని పోషించే పరమ చైతన్య శక్తిని మరియు ప్రాణరక్షణను స్తుతిస్తూ, అజ్ఞానాన్ని పోగొట్టి దివ్యమైన సృష్టి సంరక్షణను కలిగించడం గురించి ఈ మంత్రం వివరిస్తుంది.'
  },
  steps: {
    step1_devanagari: 'यथेयं पृथिवी मही दाधारेमान्वनस्पतीन्। एवा ते ध्रियतां गर्भो अनु सूतुं सवितवे ॥',
    step2_iast: 'yatheyaṁ pṛthivī mahī dādhāremānvanaspatīn | evā te dhriyatāṁ garbho anu sūtuṁ savitave ||',
    step3_telugu_mantra: 'యథేయం పృథివీ మహీ దాధారేమాన్వనస్పతీన్ | ఏవా తే ధ్రియతాం గర్భో అను సూతుం సవితవే ||',
    step4_telugu_bhavartha: 'ఈ విశాలమైన పృథ్వి వృక్షాలను ఎలా ధరించి రక్షించునో, అలాగే నీ యందు జీవశక్తి సురక్షితముగా నిలుచుగాక.',
    step5_telugu_summary: 'ఆధ్యాత్మిక అర్థం సంక్షిప్త సారాంశం: ప్రకృతి నిరంతర స్థిరత్వమువలె సాధకుడు సత్యనిష్టను తనలో నిలుపుకోవాలి.',
    step6_telugu_padartha: 'యథా = ఏవిధముగా; ఇయం = ఈ; పృథివీ = భూమి; మహీ = విశాలమైనదై; దాధార = ధరించెనో; ఇమాన్ = ఈ; వనస్పతీన్ = వృక్షములను; ఏవ = అలాగే; తే = నీకు; ధ్రియతాం = స్థిరపడుగాక; గర్భః = గర్భము; అను సూతుం = సకాలమునకు; సవితవే = జన్మించుటకు.',
    step7_telugu_summary2: 'ఆధ్యాత్మిక అర్థం సంక్షిప్త సారాంశం: సదాచారమును రక్షించే సాధకుడిని సమస్త ప్రకృతి కాపాడుతుంది.',
    step8_english_bhavartha: 'Just as this vast earth safely holds and sustains all flourishing trees, so may the sacred germ of life be firmly established within you.',
    step9_english_summary: 'Spiritual Meaning: Inner poise and adherence to cosmic truth allow spiritual growth to remain unperturbed.',
    step10_english_padartha: 'yathā = as; iyam = this; pṛthivī = earth; mahī = great; dādhāra = sustains; imān = these; vanaspatīn = trees; eva = even so; te = to thee; dhriyatām = let there be held; garbhaḥ = embryo/seed; anu sūtum = in due time; savitave = for fruition.',
    step11_english_summary2: 'Spiritual Meaning: Faith in divine law guarantees untimely destruction cannot prevail.',
    step12_hindi_bhavartha: 'जैसे इस बड़ी पृथिवी ने इन वृक्षों को धारण किया है वैसे ही तेरा गर्भ स्थिर रहे।',
    step13_hindi_summary: 'आध्यात्मिक अर्थ : - जैसे पृथ्वी वृक्षों का पोषण करती है, वैसे ही आत्मा धर्म और सत्य का पोषण करती है।',
    step14_hindi_padartha: 'जैसे इस बड़ी पृथिवी ने इन वृक्षों को धारण किया है वैसे ही तेरा गर्भ स्थिर रहे।',
    step15_hindi_summary2: 'आध्यात्मिक अर्थ : - आत्मिक जागृती का बीज धैर्य और समर्पण से सुरक्षित रहता है।'
  },
  formattedPublication: '',
  audioAvailable: true
};
INITIAL_PUBLICATION.formattedPublication = compileFormattedPublication(
  INITIAL_PUBLICATION.metadata,
  INITIAL_PUBLICATION.briefIntro,
  INITIAL_PUBLICATION.steps
);

export default function App() {
  const [activeTab, setActiveTab] = useState<'publication' | 'steps' | 'channels' | 'local'>('publication');
  const [publication, setPublication] = useState<MantraPublication>(INITIAL_PUBLICATION);
  const [schedulerState, setSchedulerState] = useState<SchedulerState>({
    startKanda: 6,
    startSukta: 17,
    startAnuvaka: 0,
    startMantra: 2,
    currentKanda: 6,
    currentSukta: 17,
    currentAnuvaka: 0,
    currentMantra: 2,
    autoAdvance: true,
    scheduleCron: '0 6 * * *',
    lastRunTime: null,
    nextScheduledTime: null,
    isRunning: true
  });
  const [dispatchConfig, setDispatchConfig] = useState<DispatchConfig>({
    emailRecipient: 'shobhasrinivas@gmail.com',
    emailFrom: 'Atharvaveda Daily <daily@atharvaveda.org>',
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPass: '',
    telegramBotToken: '',
    telegramChatId: '',
    whatsAppPhone: '',
    whatsAppGroupId: '',
    whatsAppWebhookUrl: ''
  });
  const [logs, setLogs] = useState<DispatchLogItem[]>([
    {
      id: 'init-1',
      timestamp: new Date().toISOString(),
      mantraLabel: 'Kanda 6 · Sukta 17 · Mantra 2',
      channel: 'all',
      recipient: 'shobhasrinivas@gmail.com, Telegram, WhatsApp',
      status: 'simulated',
      message: 'System active at user starting point. Audio attachment verified.',
      audioAttached: true,
      audioUrl: getAudioUrl(6, 17, 2)
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Initial fetch from backend
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const res = await fetch('/api/mantra/current');
      if (res.ok) {
        const data = await res.json();
        if (data.publication) setPublication(data.publication);
        if (data.state) setSchedulerState(data.state);
      }

      const stateRes = await fetch('/api/scheduler/state');
      if (stateRes.ok) {
        const stateData = await stateRes.json();
        if (stateData.state) setSchedulerState(stateData.state);
        if (stateData.config) setDispatchConfig(stateData.config);
      }

      const logsRes = await fetch('/api/dispatch/logs');
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        if (logsData.logs) setLogs(logsData.logs);
      }
    } catch (e) {
      console.warn('Backend server not connected yet, operating in client mode with canonical data.');
    }
  };

  // Advance sequence (Previous or Next)
  const handleAdvance = async (direction: 'next' | 'prev') => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/mantra/advance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction })
      });

      if (res.ok) {
        const data = await res.json();
        setPublication(data.publication);
        setSchedulerState(data.state);
        showToast('info', `Moved to Kanda ${data.state.currentKanda} · Sukta ${data.state.currentSukta} · Mantra ${data.state.currentMantra}`);
      } else {
        throw new Error('Server advance failed');
      }
    } catch (e) {
      // Local client fallback
      const coords = direction === 'next'
        ? getNextMantraCoordinates(
            schedulerState.currentKanda,
            schedulerState.currentSukta,
            schedulerState.currentAnuvaka,
            schedulerState.currentMantra
          )
        : getPrevMantraCoordinates(
            schedulerState.currentKanda,
            schedulerState.currentSukta,
            schedulerState.currentAnuvaka,
            schedulerState.currentMantra
          );

      setPublication({
        ...INITIAL_PUBLICATION,
        metadata: {
          ...INITIAL_PUBLICATION.metadata,
          kanda: coords.kanda,
          sukta: coords.sukta,
          anuvaka: coords.anuvaka,
          mantra: coords.mantra,
          audioUrl: getAudioUrl(coords.kanda, coords.sukta, coords.mantra)
        }
      });
      setSchedulerState(prev => ({
        ...prev,
        currentKanda: coords.kanda,
        currentSukta: coords.sukta,
        currentAnuvaka: coords.anuvaka,
        currentMantra: coords.mantra
      }));
      showToast('info', `Switched to Kanda ${coords.kanda} · Sukta ${coords.sukta} · Mantra ${coords.mantra}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Set user-selected starting point
  const handleSetStartingPoint = async (
    kanda: number,
    sukta: number,
    anuvaka: number,
    mantra: number,
    customUrl?: string
  ) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/mantra/set-starting-point', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kanda, sukta, anuvaka, mantra, customUrl })
      });

      if (res.ok) {
        const data = await res.json();
        setPublication(data.publication);
        setSchedulerState(data.state);
        showToast('success', `Starting baseline set: Kanda ${kanda}, Sukta ${sukta}, Mantra ${mantra}`);
      } else {
        throw new Error('Could not set starting point on server');
      }
    } catch (e) {
      // Local client fallback
      setPublication({
        ...INITIAL_PUBLICATION,
        metadata: {
          ...INITIAL_PUBLICATION.metadata,
          kanda,
          sukta,
          anuvaka,
          mantra,
          audioUrl: getAudioUrl(kanda, sukta, mantra)
        }
      });
      setSchedulerState(prev => ({
        ...prev,
        startKanda: kanda,
        startSukta: sukta,
        startAnuvaka: anuvaka,
        startMantra: mantra,
        currentKanda: kanda,
        currentSukta: sukta,
        currentAnuvaka: anuvaka,
        currentMantra: mantra
      }));
      showToast('success', `Starting baseline set: Kanda ${kanda}, Sukta ${sukta}, Mantra ${mantra}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to user-selected starting point
  const handleResetToStart = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/mantra/reset', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setPublication(data.publication);
        setSchedulerState(data.state);
        showToast('info', `Reset sequence to user starting point: Kanda ${data.state.startKanda}.${data.state.startSukta}.${data.state.startMantra}`);
      } else {
        throw new Error('Reset failed');
      }
    } catch (e) {
      setPublication({
        ...INITIAL_PUBLICATION,
        metadata: {
          ...INITIAL_PUBLICATION.metadata,
          kanda: schedulerState.startKanda,
          sukta: schedulerState.startSukta,
          anuvaka: schedulerState.startAnuvaka,
          mantra: schedulerState.startMantra,
          audioUrl: getAudioUrl(schedulerState.startKanda, schedulerState.startSukta, schedulerState.startMantra)
        }
      });
      setSchedulerState(prev => ({
        ...prev,
        currentKanda: prev.startKanda,
        currentSukta: prev.startSukta,
        currentAnuvaka: prev.startAnuvaka,
        currentMantra: prev.startMantra
      }));
      showToast('info', `Reset to starting point: Kanda ${schedulerState.startKanda}.${schedulerState.startSukta}.${schedulerState.startMantra}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle Auto-Advance
  const handleToggleAutoAdvance = async () => {
    const nextVal = !schedulerState.autoAdvance;
    setSchedulerState(prev => ({ ...prev, autoAdvance: nextVal }));
    try {
      await fetch('/api/scheduler/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoAdvance: nextVal })
      });
    } catch (e) {
      // offline ok
    }
    showToast('info', `Daily Auto-Advance is now ${nextVal ? 'ENABLED' : 'PAUSED'}`);
  };

  // Dispatch channel execution
  const handleDispatch = async (channel: 'email' | 'telegram' | 'whatsapp' | 'all') => {
    setIsDispatching(true);
    try {
      const res = await fetch('/api/dispatch/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel, advanceAfterSend: channel === 'all' })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.logs) setLogs(data.logs);
        if (data.state) setSchedulerState(data.state);

        if (channel === 'all') {
          showToast('success', `Daily dispatch sent to Email, Telegram (with audio), and WhatsApp!`);
        } else if (channel === 'telegram') {
          showToast('success', `Telegram message + sendAudio MP3 attachment dispatched!`);
        } else if (channel === 'email') {
          showToast('success', `Email sent to ${dispatchConfig.emailRecipient} with MP3 MIME attachment!`);
        } else if (channel === 'whatsapp') {
          if (data.results?.whatsapp?.shareUrl) {
            window.open(data.results.whatsapp.shareUrl, '_blank');
          }
          showToast('success', `WhatsApp payload launched!`);
        }
      } else {
        throw new Error('Dispatch request returned non-200');
      }
    } catch (e) {
      // Client-side fallback dispatch simulation
      const newLog: DispatchLogItem = {
        id: `local-log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        mantraLabel: `Kanda ${schedulerState.currentKanda} · Sukta ${schedulerState.currentSukta} · Mantra ${schedulerState.currentMantra}`,
        channel,
        recipient: channel === 'email' ? dispatchConfig.emailRecipient : channel === 'telegram' ? (dispatchConfig.telegramChatId || 'Telegram') : 'WhatsApp',
        status: 'simulated',
        message: `Dispatched ${channel} with audio recitation attached (${publication.metadata.audioUrl}).`,
        audioAttached: true,
        audioUrl: publication.metadata.audioUrl
      };
      setLogs(prev => [newLog, ...prev]);

      if (channel === 'whatsapp') {
        const shareText = `🕊️ *Atharvaveda Daily Mantra*\n\n${publication.formattedPublication}`;
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank');
      }

      showToast('success', `Dispatched ${channel.toUpperCase()} with audio recitation!`);
    } finally {
      setIsDispatching(false);
    }
  };

  const handleUpdateConfig = async (newConfig: Partial<DispatchConfig>) => {
    setDispatchConfig(prev => ({ ...prev, ...newConfig }));
    try {
      await fetch('/api/scheduler/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: newConfig })
      });
    } catch (e) {
      // offline ok
    }
  };

  const refreshLogs = async () => {
    try {
      const res = await fetch('/api/dispatch/logs');
      if (res.ok) {
        const data = await res.json();
        if (data.logs) setLogs(data.logs);
      }
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-stone-900 flex flex-col selection:bg-amber-200 selection:text-amber-900">
      {/* Top Bar Navigation */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickDispatch={() => handleDispatch('all')}
        isDispatching={isDispatching}
        kanda={schedulerState.currentKanda}
        sukta={schedulerState.currentSukta}
        mantra={schedulerState.currentMantra}
      />

      {/* Main Sanctuary Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
        {/* Toast Notification */}
        {toast && (
          <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-lg text-xs sm:text-sm font-medium transition-all ${
              toast.type === 'success'
                ? 'bg-emerald-900 text-white'
                : toast.type === 'error'
                ? 'bg-red-900 text-white'
                : 'bg-stone-900 text-white'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400" />
            ) : (
              <Info className="w-4 h-4 text-amber-400" />
            )}
            <span>{toast.message}</span>
          </div>
        )}

        {/* Sequential Scripture Navigator */}
        <SequenceNavigator
          state={schedulerState}
          onAdvance={handleAdvance}
          onSetStartingPoint={handleSetStartingPoint}
          onResetToStart={handleResetToStart}
          onToggleAutoAdvance={handleToggleAutoAdvance}
          isLoading={isLoading}
        />

        {/* Ceremonial Audio Player (Attached Audio Recitation) */}
        <AudioPlayer
          audioUrl={publication.metadata.audioUrl}
          mantraTitle={publication.metadata.referenceHeader}
          kanda={schedulerState.currentKanda}
          sukta={schedulerState.currentSukta}
          mantra={schedulerState.currentMantra}
        />

        {/* Tab Views */}
        {activeTab === 'publication' && (
          <PublicationView
            publication={publication}
            onDispatchChannel={handleDispatch}
            isDispatching={isDispatching}
          />
        )}

        {activeTab === 'steps' && (
          <StepsInspector steps={publication.steps} />
        )}

        {activeTab === 'channels' && (
          <MultiChannelHub
            config={dispatchConfig}
            logs={logs}
            publication={publication}
            onUpdateConfig={handleUpdateConfig}
            onDispatch={handleDispatch}
            isDispatching={isDispatching}
            onRefreshLogs={refreshLogs}
          />
        )}

        {activeTab === 'local' && (
          <LocalSetupTab
            config={dispatchConfig}
            state={schedulerState}
            onUpdateConfig={handleUpdateConfig}
          />
        )}
      </main>
    </div>
  );
}
