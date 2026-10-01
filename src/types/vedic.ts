export interface MantraCoordinates {
  kanda: number;
  sukta: number;
  anuvaka: number;
  mantra: number;
}

export interface MantraMetadata {
  referenceHeader: string;
  devata: string;
  rishi: string;
  chhanda: string;
  swara: string;
  audioUrl: string;
  webUrl: string;
  kanda: number;
  sukta: number;
  anuvaka: number;
  mantra: number;
}

export interface BriefIntro {
  english: string;
  hindi: string;
  telugu: string;
}

export interface Mantra15Steps {
  // Step 1: Input 1 (Clean Devanagari) as it is.
  step1_devanagari: string;
  // Step 2: Transliterate Input 1 into English script (IAST/Romanized).
  step2_iast: string;
  // Step 3: Transliterate Input 1 into Telugu script.
  step3_telugu_mantra: string;
  // Step 4: Translate Input 2 (भावार्थभाषाः) into simple Telugu in a single horizontal sentence.
  step4_telugu_bhavartha: string;
  // Step 5: Concise spiritual summary of Input 2 in Telugu (Prefixed with: "ఆధ్యాత్మిక అర్థం సంక్షిప్త సారాంశం: ").
  step5_telugu_summary: string;
  // Step 6: Translate Input 3 (पदार्थान्वयभाषाः) word-by-word into Telugu in horizontal format.
  step6_telugu_padartha: string;
  // Step 7: Concise spiritual summary of Input 3 in Telugu (Prefixed with: "ఆధ్యాత్మిక అర్థం సంక్షిప్త సారాంశం: ").
  step7_telugu_summary2: string;
  // Step 8: Translate Input 2 (भावार्थभाषाः) into simple English in a single horizontal sentence.
  step8_english_bhavartha: string;
  // Step 9: Concise spiritual summary of Input 2 in English (Prefixed with: "Spiritual Meaning: ").
  step9_english_summary: string;
  // Step 10: Translate Input 3 (पदार्थान्वयभाषाः) word-by-word into English in horizontal format.
  step10_english_padartha: string;
  // Step 11: Concise spiritual summary of Input 3 in English (Prefixed with: "Spiritual Meaning: ").
  step11_english_summary2: string;
  // Step 12: Extract Input 2 (भावार्थभाषाः) in clean Hindi in a single horizontal sentence.
  step12_hindi_bhavartha: string;
  // Step 13: Concise spiritual summary of Input 2 in Hindi (Prefixed with: "आध्यात्मिक अर्थ : - ").
  step13_hindi_summary: string;
  // Step 14: Extract Input 3 (पदार्थान्वयभाषाः) word-by-word in Hindi in horizontal format.
  step14_hindi_padartha: string;
  // Step 15: Concise spiritual summary of Input 3 in Hindi (Prefixed with: "आध्यात्मिक अर्थ : - ").
  step15_hindi_summary2: string;
}

export interface MantraPublication {
  metadata: MantraMetadata;
  briefIntro: BriefIntro;
  steps: Mantra15Steps;
  formattedPublication: string;
  audioAvailable: boolean;
}

export interface SchedulerState {
  currentKanda: number;
  currentSukta: number;
  currentAnuvaka: number;
  currentMantra: number;
  startKanda: number;
  startSukta: number;
  startAnuvaka: number;
  startMantra: number;
  autoAdvance: boolean;
  scheduleCron: string;
  lastRunTime: string | null;
  nextScheduledTime: string | null;
  isRunning: boolean;
}

export interface DispatchConfig {
  emailRecipient: string;
  emailFrom: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  telegramBotToken: string;
  telegramChatId: string;
  whatsAppPhone: string;
  whatsAppGroupId: string;
  whatsAppWebhookUrl: string;
}

export interface DispatchLogItem {
  id: string;
  timestamp: string;
  mantraLabel: string;
  channel: 'email' | 'telegram' | 'whatsapp' | 'all';
  recipient: string;
  status: 'success' | 'warning' | 'error' | 'simulated';
  message: string;
  audioAttached: boolean;
  audioUrl?: string;
}
