/**
 * Standalone Local Scheduler & CLI Daemon for Atharvaveda Daily Publisher
 * 
 * Usage:
 *   npx tsx local-scheduler.ts --once     # Run once immediately and advance sequence
 *   npx tsx local-scheduler.ts --daemon   # Run 24/7 background scheduler loop
 */

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { processAtharvavedaMantra } from './src/services/geminiVedicScholar';
import { getNextMantraCoordinates, getAudioUrl } from './src/services/liveWebsiteExtractor';
import { dispatchToTelegram, dispatchToEmail, dispatchToWhatsApp } from './src/services/dispatcherService';
import { DispatchConfig } from './src/types/vedic';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, '.env') });

const STATE_FILE = path.join(__dirname, 'local-state.json');

interface LocalState {
  startKanda: number;
  startSukta: number;
  startAnuvaka: number;
  startMantra: number;
  currentKanda: number;
  currentSukta: number;
  currentAnuvaka: number;
  currentMantra: number;
  lastRunTimestamp: string | null;
  totalDispatches: number;
}

function loadState(): LocalState {
  const startK = parseInt(process.env.START_KANDA || '6', 10);
  const startS = parseInt(process.env.START_SUKTA || '17', 10);
  const startA = parseInt(process.env.START_ANUVAKA || '0', 10);
  const startM = parseInt(process.env.START_MANTRA || '2', 10);

  if (fs.existsSync(STATE_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
      return {
        startKanda: data.startKanda || startK,
        startSukta: data.startSukta || startS,
        startAnuvaka: data.startAnuvaka || startA,
        startMantra: data.startMantra || startM,
        currentKanda: data.currentKanda || startK,
        currentSukta: data.currentSukta || startS,
        currentAnuvaka: data.currentAnuvaka || startA,
        currentMantra: data.currentMantra || startM,
        lastRunTimestamp: data.lastRunTimestamp || null,
        totalDispatches: data.totalDispatches || 0
      };
    } catch (e) {
      console.warn('Could not read existing state file, using .env defaults.');
    }
  }

  return {
    startKanda: startK,
    startSukta: startS,
    startAnuvaka: startA,
    startMantra: startM,
    currentKanda: startK,
    currentSukta: startS,
    currentAnuvaka: startA,
    currentMantra: startM,
    lastRunTimestamp: null,
    totalDispatches: 0
  };
}

function saveState(state: LocalState) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
}

async function runDailyPublish(state: LocalState) {
  console.log('\n======================================================');
  console.log(`🕊️  Atharvaveda Daily Run: Kanda ${state.currentKanda} · Sukta ${state.currentSukta} · Mantra ${state.currentMantra}`);
  console.log('======================================================');

  const config: DispatchConfig = {
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

  console.log('⏳ Processing 15-Step Vedic Scholarship Pipeline...');
  const publication = await processAtharvavedaMantra(
    state.currentKanda,
    state.currentSukta,
    state.currentAnuvaka,
    state.currentMantra
  );

  console.log('✅ Vedic Scholarship Steps Compiled.');
  console.log(`🎵 Audio Recitation: ${publication.metadata.audioUrl}`);

  // 1. Dispatch Telegram with Native Audio
  console.log('✈️  Dispatching to Telegram (Text + sendAudio Attachment)...');
  const tgRes = await dispatchToTelegram(publication, config.telegramBotToken, config.telegramChatId);
  console.log(`   Telegram Status: ${tgRes.message}`);

  // 2. Dispatch Email with MP3 MIME Attachment
  console.log(`✉️  Dispatching Email to ${config.emailRecipient} (with MP3 attachment)...`);
  const emailRes = await dispatchToEmail(publication, config);
  console.log(`   Email Status: ${emailRes.message}`);

  // 3. Dispatch WhatsApp
  console.log('💬  Preparing WhatsApp dispatch payload...');
  const waRes = await dispatchToWhatsApp(publication, config);
  console.log(`   WhatsApp Status: ${waRes.message}`);

  // Advance Sequence Pointer
  const next = getNextMantraCoordinates(
    state.currentKanda,
    state.currentSukta,
    state.currentAnuvaka,
    state.currentMantra
  );
  state.currentKanda = next.kanda;
  state.currentSukta = next.sukta;
  state.currentAnuvaka = next.anuvaka;
  state.currentMantra = next.mantra;
  state.lastRunTimestamp = new Date().toISOString();
  state.totalDispatches += 1;

  saveState(state);
  console.log(`➡️  Sequence advanced to: Kanda ${state.currentKanda} · Sukta ${state.currentSukta} · Mantra ${state.currentMantra}`);
  console.log('======================================================\n');
}

async function main() {
  const args = process.argv.slice(2);
  const isOnce = args.includes('--once') || args.length === 0;
  const isDaemon = args.includes('--daemon');

  const state = loadState();

  if (isOnce && !isDaemon) {
    console.log('Executing one-shot Atharvaveda publish run...');
    await runDailyPublish(state);
    process.exit(0);
  }

  if (isDaemon) {
    console.log('Starting Atharvaveda 24/7 background scheduler daemon...');
    console.log(`Initial Starting Point: Kanda ${state.startKanda} · Sukta ${state.startSukta} · Mantra ${state.startMantra}`);
    console.log(`Current Pointer: Kanda ${state.currentKanda} · Sukta ${state.currentSukta} · Mantra ${state.currentMantra}`);
    console.log(`Schedule: ${process.env.SCHEDULE_CRON || '0 6 * * *'}`);

    // Run once on startup
    await runDailyPublish(state);

    // Run every 24 hours (or interval)
    const INTERVAL_MS = 24 * 60 * 60 * 1000;
    setInterval(async () => {
      try {
        await runDailyPublish(state);
      } catch (e) {
        console.error('Daemon run error:', e);
      }
    }, INTERVAL_MS);
  }
}

main().catch(err => {
  console.error('Fatal CLI Error:', err);
  process.exit(1);
});
