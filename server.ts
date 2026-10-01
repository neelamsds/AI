import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  MantraPublication,
  SchedulerState,
  DispatchConfig,
  DispatchLogItem
} from './src/types/vedic';
import {
  getNextMantraCoordinates,
  getPrevMantraCoordinates,
  getAudioUrl,
  getWebUrl
} from './src/services/liveWebsiteExtractor';
import { processAtharvavedaMantra } from './src/services/geminiVedicScholar';
import {
  dispatchToTelegram,
  dispatchToEmail,
  dispatchToWhatsApp
} from './src/services/dispatcherService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initial State with User-Selected Starting Point
let schedulerState: SchedulerState = {
  startKanda: parseInt(process.env.START_KANDA || '6', 10),
  startSukta: parseInt(process.env.START_SUKTA || '17', 10),
  startAnuvaka: parseInt(process.env.START_ANUVAKA || '0', 10),
  startMantra: parseInt(process.env.START_MANTRA || '2', 10),
  currentKanda: parseInt(process.env.START_KANDA || '6', 10),
  currentSukta: parseInt(process.env.START_SUKTA || '17', 10),
  currentAnuvaka: parseInt(process.env.START_ANUVAKA || '0', 10),
  currentMantra: parseInt(process.env.START_MANTRA || '2', 10),
  autoAdvance: process.env.AUTO_ADVANCE !== 'false',
  scheduleCron: process.env.SCHEDULE_CRON || '0 6 * * *',
  lastRunTime: null,
  nextScheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  isRunning: true
};

let dispatchConfig: DispatchConfig = {
  emailRecipient: process.env.EMAIL_TO || 'shobhasrinivas@gmail.com',
  emailFrom: process.env.EMAIL_FROM || 'Atharvaveda Daily <daily@atharvaveda.org>',
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
  telegramChatId: process.env.TELEGRAM_CHAT_ID || '',
  whatsAppPhone: process.env.WHATSAPP_PHONE || '',
  whatsAppGroupId: process.env.WHATSAPP_GROUP_ID || '',
  whatsAppWebhookUrl: process.env.WHATSAPP_WEBHOOK_URL || ''
};

const dispatchLogs: DispatchLogItem[] = [
  {
    id: 'log-init-1',
    timestamp: new Date().toISOString(),
    mantraLabel: `Kanda ${schedulerState.currentKanda} · Sukta ${schedulerState.currentSukta} · Mantra ${schedulerState.currentMantra}`,
    channel: 'all',
    recipient: `${dispatchConfig.emailRecipient}, Telegram, WhatsApp`,
    status: 'simulated',
    message: 'System initialized at user starting point. Scheduled daily auto-advance enabled.',
    audioAttached: true,
    audioUrl: getAudioUrl(schedulerState.currentKanda, schedulerState.currentSukta, schedulerState.currentMantra)
  }
];

// Helper: parse Atharvaveda URL
function parseAtharvavedaUrl(urlStr: string): { kanda: number; sukta: number; anuvaka: number; mantra: number } | null {
  try {
    const clean = decodeURIComponent(urlStr).replace(/https?:\/\/[^\/]+/, '');
    const match = clean.match(/\/atharvaveda\/(\d+)\/(\d+)(?:\/(\d+))?\/(\d+)/i);
    if (match) {
      return {
        kanda: parseInt(match[1], 10),
        sukta: parseInt(match[2], 10),
        anuvaka: match[3] ? parseInt(match[3], 10) : 0,
        mantra: parseInt(match[4], 10)
      };
    }
  } catch (e) {
    console.error('URL parse error:', e);
  }
  return null;
}

// ==========================================
// API Endpoints
// ==========================================

// Get current active mantra
app.get('/api/mantra/current', async (req, res) => {
  try {
    const publication = await processAtharvavedaMantra(
      schedulerState.currentKanda,
      schedulerState.currentSukta,
      schedulerState.currentAnuvaka,
      schedulerState.currentMantra
    );
    res.json({ publication, state: schedulerState });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch arbitrary mantra or parse URL
app.post('/api/mantra/fetch', async (req, res) => {
  try {
    const { kanda, sukta, anuvaka, mantra, customUrl, customText } = req.body;
    let targetK = kanda || schedulerState.currentKanda;
    let targetS = sukta || schedulerState.currentSukta;
    let targetA = anuvaka !== undefined ? anuvaka : schedulerState.currentAnuvaka;
    let targetM = mantra || schedulerState.currentMantra;

    if (customUrl) {
      const parsed = parseAtharvavedaUrl(customUrl);
      if (parsed) {
        targetK = parsed.kanda;
        targetS = parsed.sukta;
        targetA = parsed.anuvaka;
        targetM = parsed.mantra;
      }
    }

    const publication = await processAtharvavedaMantra(targetK, targetS, targetA, targetM, customText);
    res.json({ publication });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Set User-Selected Starting Point
app.post('/api/mantra/set-starting-point', async (req, res) => {
  try {
    const { kanda, sukta, anuvaka, mantra, customUrl } = req.body;
    let k = kanda;
    let s = sukta;
    let a = anuvaka !== undefined ? anuvaka : 0;
    let m = mantra;

    if (customUrl) {
      const parsed = parseAtharvavedaUrl(customUrl);
      if (parsed) {
        k = parsed.kanda;
        s = parsed.sukta;
        a = parsed.anuvaka;
        m = parsed.mantra;
      }
    }

    schedulerState.startKanda = k;
    schedulerState.startSukta = s;
    schedulerState.startAnuvaka = a;
    schedulerState.startMantra = m;

    // Also update current active pointer to starting point
    schedulerState.currentKanda = k;
    schedulerState.currentSukta = s;
    schedulerState.currentAnuvaka = a;
    schedulerState.currentMantra = m;

    const publication = await processAtharvavedaMantra(k, s, a, m);

    dispatchLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      mantraLabel: `Kanda ${k} · Sukta ${s} · Mantra ${m}`,
      channel: 'all',
      recipient: 'Scheduler Config',
      status: 'success',
      message: `User set new baseline starting point: Kanda ${k}, Sukta ${s}, Mantra ${m}`,
      audioAttached: true,
      audioUrl: getAudioUrl(k, s, m)
    });

    res.json({ success: true, state: schedulerState, publication });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Advance Sequential Mantra (Next or Previous)
app.post('/api/mantra/advance', async (req, res) => {
  try {
    const { direction } = req.body; // 'next' or 'prev'
    const nextCoords = direction === 'prev'
      ? getPrevMantraCoordinates(
          schedulerState.currentKanda,
          schedulerState.currentSukta,
          schedulerState.currentAnuvaka,
          schedulerState.currentMantra
        )
      : getNextMantraCoordinates(
          schedulerState.currentKanda,
          schedulerState.currentSukta,
          schedulerState.currentAnuvaka,
          schedulerState.currentMantra
        );

    schedulerState.currentKanda = nextCoords.kanda;
    schedulerState.currentSukta = nextCoords.sukta;
    schedulerState.currentAnuvaka = nextCoords.anuvaka;
    schedulerState.currentMantra = nextCoords.mantra;

    const publication = await processAtharvavedaMantra(
      schedulerState.currentKanda,
      schedulerState.currentSukta,
      schedulerState.currentAnuvaka,
      schedulerState.currentMantra
    );

    res.json({ success: true, state: schedulerState, publication });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Reset pointer to starting point
app.post('/api/mantra/reset', async (req, res) => {
  try {
    schedulerState.currentKanda = schedulerState.startKanda;
    schedulerState.currentSukta = schedulerState.startSukta;
    schedulerState.currentAnuvaka = schedulerState.startAnuvaka;
    schedulerState.currentMantra = schedulerState.startMantra;

    const publication = await processAtharvavedaMantra(
      schedulerState.currentKanda,
      schedulerState.currentSukta,
      schedulerState.currentAnuvaka,
      schedulerState.currentMantra
    );

    res.json({ success: true, state: schedulerState, publication });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Scheduler state & config
app.get('/api/scheduler/state', (req, res) => {
  res.json({
    state: schedulerState,
    config: {
      ...dispatchConfig,
      // Mask password slightly for safety
      smtpPass: dispatchConfig.smtpPass ? '••••••••' : ''
    }
  });
});

// Update config & scheduler
app.post('/api/scheduler/update', (req, res) => {
  const { config, autoAdvance, scheduleCron } = req.body;
  if (config) {
    dispatchConfig = {
      ...dispatchConfig,
      ...config,
      smtpPass: config.smtpPass === '••••••••' ? dispatchConfig.smtpPass : config.smtpPass || dispatchConfig.smtpPass
    };
  }
  if (autoAdvance !== undefined) schedulerState.autoAdvance = autoAdvance;
  if (scheduleCron) schedulerState.scheduleCron = scheduleCron;

  res.json({ success: true, state: schedulerState, config: dispatchConfig });
});

// Dispatch publication to channel(s) with audio file attached
app.post('/api/dispatch/send', async (req, res) => {
  try {
    const { channel, advanceAfterSend } = req.body; // 'email' | 'telegram' | 'whatsapp' | 'all'
    const publication = await processAtharvavedaMantra(
      schedulerState.currentKanda,
      schedulerState.currentSukta,
      schedulerState.currentAnuvaka,
      schedulerState.currentMantra
    );

    const mantraLabel = `Kanda ${publication.metadata.kanda} · Sukta ${publication.metadata.sukta} · Mantra ${publication.metadata.mantra}`;
    const results: any = {};

    if (channel === 'telegram' || channel === 'all') {
      const tgRes = await dispatchToTelegram(
        publication,
        dispatchConfig.telegramBotToken,
        dispatchConfig.telegramChatId
      );
      results.telegram = tgRes;
      dispatchLogs.unshift({
        id: `tg-${Date.now()}`,
        timestamp: new Date().toISOString(),
        mantraLabel,
        channel: 'telegram',
        recipient: dispatchConfig.telegramChatId || 'Not configured (Simulated)',
        status: tgRes.success ? (dispatchConfig.telegramBotToken ? 'success' : 'simulated') : 'error',
        message: tgRes.message,
        audioAttached: tgRes.audioSent,
        audioUrl: publication.metadata.audioUrl
      });
    }

    if (channel === 'email' || channel === 'all') {
      const emailRes = await dispatchToEmail(publication, dispatchConfig);
      results.email = emailRes;
      dispatchLogs.unshift({
        id: `email-${Date.now()}`,
        timestamp: new Date().toISOString(),
        mantraLabel,
        channel: 'email',
        recipient: dispatchConfig.emailRecipient,
        status: emailRes.success ? (dispatchConfig.smtpHost ? 'success' : 'simulated') : 'error',
        message: emailRes.message,
        audioAttached: emailRes.audioAttached,
        audioUrl: publication.metadata.audioUrl
      });
    }

    if (channel === 'whatsapp' || channel === 'all') {
      const waRes = await dispatchToWhatsApp(publication, dispatchConfig);
      results.whatsapp = waRes;
      dispatchLogs.unshift({
        id: `wa-${Date.now()}`,
        timestamp: new Date().toISOString(),
        mantraLabel,
        channel: 'whatsapp',
        recipient: dispatchConfig.whatsAppPhone || dispatchConfig.whatsAppGroupId || 'Direct Launch Link',
        status: waRes.webhookSent ? 'success' : 'simulated',
        message: waRes.message,
        audioAttached: true,
        audioUrl: publication.metadata.audioUrl
      });
    }

    schedulerState.lastRunTime = new Date().toISOString();

    // Auto-advance if requested
    if (advanceAfterSend && schedulerState.autoAdvance) {
      const next = getNextMantraCoordinates(
        schedulerState.currentKanda,
        schedulerState.currentSukta,
        schedulerState.currentAnuvaka,
        schedulerState.currentMantra
      );
      schedulerState.currentKanda = next.kanda;
      schedulerState.currentSukta = next.sukta;
      schedulerState.currentAnuvaka = next.anuvaka;
      schedulerState.currentMantra = next.mantra;
    }

    res.json({
      success: true,
      results,
      state: schedulerState,
      logs: dispatchLogs.slice(0, 20)
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Logs endpoint
app.get('/api/dispatch/logs', (req, res) => {
  res.json({ logs: dispatchLogs });
});

// Start Express server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Atharvaveda Scholar] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
