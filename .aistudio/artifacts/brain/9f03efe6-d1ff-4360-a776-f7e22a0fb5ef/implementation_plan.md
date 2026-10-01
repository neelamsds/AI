# Atharvaveda Daily Mantra Scheduler & Multilingual Dispatch Engine

An automated Vedic scholarship processing suite and multi-channel daily scheduler that ingests Atharvaveda mantras, executes the 15-step script transliteration and multilingual translation pipeline (Devanagari, IAST, Telugu, English, Hindi with spiritual summaries), **attaches the authentic Vedic audio file directly to all outbound dispatches** (Telegram native audio message and Email MP3 attachment), and delivers formatted publications to Email (`shobhasrinivas@gmail.com`), Telegram Bot, and WhatsApp.

Includes **custom user-selected starting point configuration** with sequential progression matching the canonical order on `https://www.xn--j2b3a4c.com` (persisting current position and advancing day by day), a standalone local CLI runner, daemon scheduler, and interactive `.env` configuration studio.

## User Review & Critical Decisions

> [!IMPORTANT]
> Revised with direct emphasis on **User-Selected Starting Point & Sequential Progression**:

- **User-Configured Starting Point**:
  - **Custom Starting Index Selector**: The user can set any desired starting point for the daily sequential schedule:
    - By selecting **Kanda** (1–20), **Sukta**, and **Mantra** index.
    - Or by pasting any direct URL (e.g. `https://www.xn--j2b3a4c.com/atharvaveda/6/17/0/2`).
    - Defaults conveniently to Atharvaveda **Kanda 6, Sukta 17, Mantra 2**, but fully reconfigurable at any time with a single click ("Set as Schedule Starting Point").
  - **Sequential Daily Advance from Starting Point**: From the user's chosen starting point, each daily scheduled run processes the current verse and automatically increments to the next sequential mantra as cataloged on the website.
  - **Sequence Management Controls**:
    - **Interactive Stepper**: Jump directly to any verse, or step forward/backward (← Previous / Next →).
    - **Reset to Starting Point**: One-click reset to restart the daily cycle from the user's defined starting point.
    - **Current Pointer Display**: Always displays the exact current position, starting position, and total mantras in the current Sukta.
- **Audio Attachment Integration (Native Media Delivery)**:
  - **Telegram Bot API**: Uses Telegram's `sendAudio` method with audio stream/URL, title (`Atharvaveda Kanda {K} Sukta {S} Mantra {N}`), performer (`Veda Chanting`), and caption.
  - **Email (SMTP)**: Direct MIME attachment of the MP3 file (`Atharvaveda_K{K}_S{S}_M{N}.mp3`) sent to `shobhasrinivas@gmail.com`, accompanied by an embedded HTML5 player.
  - **In-App Ceremonial Audio Player**: Seamless native audio player with waveform visuals, play/pause, scrub, volume, and MP3 download.
  - **Audio Source**: Direct MP3 from `https://www.xn--j2b3a4c.com/audio/atharvaveda/Kanda/{K}/Sukta/{S}/Mantra/{N}.mp3`.
- **Sequential 15-Step Scholarship Processing**:
  - Step 1 to Step 15 executed and rendered in exact chronological order with live step-by-step pipeline status.
- **Local Setup & .env Configurator**:
  - Standalone script `local-scheduler.ts` / `local-runner.ts` for running locally with `.env` settings (`START_KANDA`, `START_SUKTA`, `START_MANTRA`, chat client IDs, etc.) and persistent sequence tracking in `state.json`.

---

## 1. Overview & Core Concept

The engine allows the scholar or devotee to begin their daily Atharvaveda study at any point in the scripture and progress methodically day by day.

### User Starting Point & Sequential Scripture Order
- **Configurable Starting Baseline**:
  - `start_kanda`: 6 (editable to any 1–20)
  - `start_sukta`: 17 (editable)
  - `start_anuvaka`: 0 (editable)
  - `start_mantra`: 2 (editable)
- **URL Mapping**: `https://www.xn--j2b3a4c.com/atharvaveda/{kanda}/{sukta}/{anuvaka}/{mantra}`
- **Sequential Increment Rule**:
  - Day 1: Starts at user-selected verse (e.g., Kanda 6, Sukta 17, Mantra 2).
  - Day 2: Advances to Mantra 3.
  - Day 3: Advances to Mantra 4.
  - End of Sukta: Rolls over to the first mantra of Sukta 18.

### Mandatory 15-Step Processing Pipeline
- **Step 1**: Clean Devanagari Mantra.
- **Step 2**: IAST Romanized Transliteration with standard diacritics.
- **Step 3**: Telugu script Transliteration.
- **Step 4**: Telugu Bhavartha in a single horizontal sentence.
- **Step 5**: Telugu Spiritual Summary 1 (`ఆధ్యాత్మిక అర్థం సంక్షిప్త సారాంశం: `).
- **Step 6**: Telugu Word-by-Word Padartha in horizontal format.
- **Step 7**: Telugu Spiritual Summary 2 (`ఆధ్యాత్మిక అర్థం సంక్షిప్త సారాంశం: `).
- **Step 8**: English Bhavartha in a single horizontal sentence.
- **Step 9**: English Spiritual Summary 1 (`Spiritual Meaning: `).
- **Step 10**: English Word-by-Word Padartha (Material) in horizontal format.
- **Step 11**: English Spiritual Summary 2 (`Spiritual Meaning: `).
- **Step 12**: Hindi Bhavartha (भावार्थभाषाः) in clean horizontal prose.
- **Step 13**: Hindi Spiritual Summary 1 (`आध्यात्मिक अर्थ : - `).
- **Step 14**: Hindi Word-by-Word Padartha (पदार्था: -) in horizontal format.
- **Step 15**: Hindi Spiritual Summary 2 (`आध्यात्मिक अर्थ : - `).

### Output Publication Format
```
*अथर्ववेद » काण्ड:६ » सूक्त:१७ » मन्त्र:२*
देवता: अग्निः  ऋषि: अथर्वा  छन्द: अनुष्टुप्

🎵 Mantra Audio: https://www.xn--j2b3a4c.com/audio/atharvaveda/Kanda/6/Sukta/17/Mantra/2.mp3
(Attached as audio media file for Telegram / Embedded player & MP3 attachment for Email)

Kanda/6/Sukta/17/Mantra/2

The mantra describes about 
"Igniting the sacrificial and inner spiritual fire to overcome inner darkness and adversaries"
"आंतरिक और बाह्य अज्ञान रूपी शत्रुओं के विनाश हेतु आत्म-अग्नि को प्रज्वलित करने का आह्वान"
"అంతర్గత అజ్ఞానాన్ని, శత్రుత్వ భావాలను నశింపజేసే దివ్య అగ్నిని ప్రజ్వలింపజేయడం గురించి"

[Step 1: Devanagari]
[Step 2: IAST]
[Step 3: Telugu]

భావార్థము :- [Step 4]
ఆధ్యాత్మిక అర్థం సంక్షిప్త సారాంశం: [Step 5]
పదార్థము : - [Step 6]
ఆధ్యాత్మిక అర్థం సంక్షిప్త సారాంశం: [Step 7]

Meaning: [Step 8]
Spiritual Meaning: [Step 9]
Material: [Step 10]
Spiritual Meaning: [Step 11]

भावार्थभाषाः [Step 12]
आध्यात्मिक अर्थ : - [Step 13]
पदार्था: - [Step 14]
आध्यात्मिक अर्थ : - [Step 15]
```

---

## 2. Starting Point Selection & Navigation Controls

### Starting Index Configuration Strip
```
┌────────────────────────────────────────────────────────────────────────┐
│  STARTING INDEX CONFIGURATION                                          │
│  Kanda: [ 6  ▼ ]   Sukta: [ 17 ]   Mantra: [ 2 ]                       │
│  or Paste URL: [ https://www.xn--j2b3a4c.com/atharvaveda/6/17/0/2    ] │
│  [📍 Set as Starting Point]   [🔄 Reset to Starting Point]              │
│                                                                        │
│  Active Schedule Pointer: Kanda 6 · Sukta 17 · Mantra 2 (Auto-Next: ON)│
│  [◀ Previous Verse (6.17.1)]                   [Next Verse (6.17.3) ▶] │
└────────────────────────────────────────────────────────────────────────┘
```
- Users can choose any Kanda from 1 to 20, select Sukta and Mantra number.
- "Set as Starting Point" saves the baseline both in local browser storage and server state.
- Daily runs march sequentially forward from this point.
- "Reset to Starting Point" allows resetting the pointer back to the user's initial chosen verse whenever desired.

---

## 3. Audio Attachment & Multi-Channel Dispatch

### Telegram Bot Flow
- Dispatches the full publication text.
- Calls Telegram's `sendAudio` endpoint to attach the native audio file directly with play/download in chat.
- Increments sequence pointer after successful dispatch.

### Email (SMTP) Flow
- Dispatches rich parchment-styled HTML email to `shobhasrinivas@gmail.com`.
- Attaches the MP3 chant as a genuine email file attachment.
- Features an embedded HTML5 audio player in the email body.

### WhatsApp Flow
- Provides formatted WhatsApp text with bolded headers, dividers, and audio link.
- Supports instant click-to-send launch for WhatsApp Web and WhatsApp Groups.

---

## 4. Local Setup & Standalone Daemon

### Standalone Local Runner (`local-scheduler.ts`)
- Configured via local `.env` and `state.json`:
  ```env
  START_KANDA=6
  START_SUKTA=17
  START_MANTRA=2
  AUTO_ADVANCE=true
  SCHEDULE_CRON="0 6 * * *"
  TELEGRAM_BOT_TOKEN="your_bot_token"
  TELEGRAM_CHAT_ID="your_chat_id"
  EMAIL_TO="shobhasrinivas@gmail.com"
  SMTP_HOST="smtp.gmail.com"
  SMTP_PORT=587
  SMTP_USER="your_email@gmail.com"
  SMTP_PASS="your_app_password"
  WHATSAPP_PHONE="your_phone_number"
  WHATSAPP_GROUP_ID="your_group_id"
  ```
- Command to run once: `npm run local:run`
- Command to run 24/7 background scheduler: `npm run local:daemon`

### Interactive `.env` Studio in the UI
- Visual form to edit credentials, chat client IDs, and starting point.
- Single-click "Copy .env" and "Download .env" buttons.
- Test connection and live audio dispatch buttons for immediate verification.
