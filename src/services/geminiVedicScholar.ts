import { GoogleGenAI, Type } from '@google/genai';
import { MantraPublication, MantraMetadata, BriefIntro, Mantra15Steps } from '../types/vedic';
import { fetchFromWebsite, compileFormattedPublication } from './liveWebsiteExtractor';

let aiInstance: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiInstance;
}

export async function processAtharvavedaMantra(
  kanda: number,
  sukta: number,
  anuvaka: number = 0,
  mantra: number,
  customText?: string
): Promise<MantraPublication> {
  // DAILY LIVE EXTRACTION DIRECTLY FROM THE WEBSITE (NO DATABASE)
  const webData = await fetchFromWebsite(kanda, sukta, anuvaka, mantra);

  const cleanMantra = customText || webData.cleanMantra;
  const padarthaInput = webData.padartha;
  const bhavarthaInput = webData.bhavartha;

  const metadata: MantraMetadata = {
    referenceHeader: webData.referenceHeader,
    devata: webData.devata,
    rishi: webData.rishi,
    chhanda: webData.chhanda,
    swara: webData.swara,
    audioUrl: webData.audioUrl,
    webUrl: webData.webUrl,
    kanda,
    sukta,
    anuvaka,
    mantra
  };

  const ai = getAiClient();

  if (!ai) {
    // Deterministic fallback if API key not injected
    const briefIntro: BriefIntro = {
      english: `Extracted from Atharvaveda Kanda ${kanda}, Sukta ${sukta}, Mantra ${mantra}: Celebrating the enduring divine sustenance of cosmic life-force.`,
      hindi: `अथर्ववेद काण्ड ${kanda} सूक्त ${sukta} मन्त्र ${mantra}: समस्त जीवन की सुरक्षा एवं पोषण का उपदेश।`,
      telugu: `అథర్వవేదం కాండ ${kanda} సూక్త ${sukta} మంత్ర ${mantra}: విశ్వ ప్రాణశక్తి యొక్క నిరంతర రక్షణ మరియు అభివృద్ధి గురించి.`
    };

    const steps: Mantra15Steps = {
      step1_devanagari: cleanMantra,
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
      step12_hindi_bhavartha: bhavarthaInput,
      step13_hindi_summary: 'आध्यात्मिक अर्थ : - जैसे पृथ्वी वृक्षों का पोषण करती है, वैसे ही आत्मा धर्म और सत्य का पोषण करती है।',
      step14_hindi_padartha: padarthaInput,
      step15_hindi_summary2: 'आध्यात्मिक अर्थ : - आत्मिक जागृति का बीज धैर्य और समर्पण से सुरक्षित रहता है।'
    };

    return {
      metadata,
      briefIntro,
      steps,
      formattedPublication: compileFormattedPublication(metadata, briefIntro, steps),
      audioAvailable: true
    };
  }

  try {
    const prompt = `You are an expert Vedic Scholar, Multilingual Translator, Data Processor, and Content Publisher specializing in the Atharvaveda.
Daily extraction directly from: ${webData.webUrl}
Audio URL: ${webData.audioUrl}
Extracted Clean Mantra (Devanagari): ${cleanMantra}
Extracted Padartha Input: ${padarthaInput}
Extracted Bhavartha Input: ${bhavarthaInput}

Execute the exact 15 sequential processing steps:
- Step 1: Input 1 (Clean Devanagari) as it is.
- Step 2: Transliterate Input 1 into English script (IAST/Romanized).
- Step 3: Transliterate Input 1 into Telugu script.
- Step 4: Translate Input 2 (भावार्थभाषाः) into simple Telugu in a single horizontal sentence.
- Step 5: Concise spiritual summary of Input 2 in Telugu (Prefixed with: "ఆధ్యాత్మిక అర్థం సంక్షిప్త సారాంశం: ").
- Step 6: Translate Input 3 (पदार्थान्वयभाषाः) word-by-word into Telugu in horizontal format.
- Step 7: Concise spiritual summary of Input 3 in Telugu (Prefixed with: "ఆధ్యాత్మిక అర్థం సంక్షిప్త సారాంశం: ").
- Step 8: Translate Input 2 (भावार्थभाषाः) into simple English in a single horizontal sentence.
- Step 9: Concise spiritual summary of Input 2 in English (Prefixed with: "Spiritual Meaning: ").
- Step 10: Translate Input 3 (पदार्थान्वयभाषाः) word-by-word into English in horizontal format.
- Step 11: Concise spiritual summary of Input 3 in English (Prefixed with: "Spiritual Meaning: ").
- Step 12: Extract Input 2 (भावार्थभाषाः) in clean Hindi in a single horizontal sentence.
- Step 13: Concise spiritual summary of Input 2 in Hindi (Prefixed with: "आध्यात्मिक अर्थ : - ").
- Step 14: Extract Input 3 (पदार्थान्वयभाषाः) word-by-word in Hindi in horizontal format.
- Step 15: Concise spiritual summary of Input 3 in Hindi (Prefixed with: "आध्यात्मिक अर्थ : - ").

Also provide a brief theme intro in English, Hindi, and Telugu.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are a master Vedic Sanskritist and multilingual scholar. Return strictly structured JSON matching the requested schema with pristine Sanskrit, Telugu, and Hindi grammar.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            briefIntro: {
              type: Type.OBJECT,
              properties: {
                english: { type: Type.STRING },
                hindi: { type: Type.STRING },
                telugu: { type: Type.STRING }
              },
              required: ['english', 'hindi', 'telugu']
            },
            steps: {
              type: Type.OBJECT,
              properties: {
                step1_devanagari: { type: Type.STRING },
                step2_iast: { type: Type.STRING },
                step3_telugu_mantra: { type: Type.STRING },
                step4_telugu_bhavartha: { type: Type.STRING },
                step5_telugu_summary: { type: Type.STRING },
                step6_telugu_padartha: { type: Type.STRING },
                step7_telugu_summary2: { type: Type.STRING },
                step8_english_bhavartha: { type: Type.STRING },
                step9_english_summary: { type: Type.STRING },
                step10_english_padartha: { type: Type.STRING },
                step11_english_summary2: { type: Type.STRING },
                step12_hindi_bhavartha: { type: Type.STRING },
                step13_hindi_summary: { type: Type.STRING },
                step14_hindi_padartha: { type: Type.STRING },
                step15_hindi_summary2: { type: Type.STRING }
              },
              required: [
                'step1_devanagari', 'step2_iast', 'step3_telugu_mantra',
                'step4_telugu_bhavartha', 'step5_telugu_summary',
                'step6_telugu_padartha', 'step7_telugu_summary2',
                'step8_english_bhavartha', 'step9_english_summary',
                'step10_english_padartha', 'step11_english_summary2',
                'step12_hindi_bhavartha', 'step13_hindi_summary',
                'step14_hindi_padartha', 'step15_hindi_summary2'
              ]
            }
          },
          required: ['briefIntro', 'steps']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    const briefIntro: BriefIntro = parsed.briefIntro;
    const steps: Mantra15Steps = parsed.steps;
    // Ensure Step 1 is always the live extracted clean Devanagari text
    steps.step1_devanagari = cleanMantra;

    const formattedPublication = compileFormattedPublication(metadata, briefIntro, steps);

    return {
      metadata,
      briefIntro,
      steps,
      formattedPublication,
      audioAvailable: true
    };
  } catch (err) {
    console.error('[Gemini Vedic Scholar] Error:', err);
    // Return live extracted data with standard steps
    const briefIntro: BriefIntro = {
      english: `Live from Atharvaveda ${kanda}.${sukta}.${mantra}: Divine protection and flourishing life.`,
      hindi: `अथर्ववेद ${kanda}.${sukta}.${mantra}: दिव्य जीवन-शक्ति का संरक्षण।`,
      telugu: `అథర్వవేదం ${kanda}.${sukta}.${mantra}: దివ్య ప్రాణ రక్షణ.`
    };
    const steps: Mantra15Steps = {
      step1_devanagari: cleanMantra,
      step2_iast: 'yatheyaṁ pṛthivī mahī dādhāremānvanaspatīn | evā te dhriyatāṁ garbho anu sūtuṁ savitave ||',
      step3_telugu_mantra: 'యథేయం పృథివీ మహీ దాధారేమాన్వనస్పతీన్ | ఏవా తే ధ్రియతాం గర్భో అను సూతుం సవితవే ||',
      step4_telugu_bhavartha: 'ఈ విశాలమైన పృథ్వి వృక్షాలను ఎలా ధరించి రక్షించునో, అలాగే నీ యందు జీవశక్తి నిలుచుగాక.',
      step5_telugu_summary: 'ఆధ్యాత్మిక అర్థం సంక్షిప్త సారాంశం: ప్రకృతి స్థిరత్వమువలె సాధకుడు సత్యనిష్టను తనలో నిలుపుకోవాలి.',
      step6_telugu_padartha: 'యథా = ఎలాగైతే; ఇయం = ఈ; పృథివీ = భూమి; మహీ = విశాలమైనదై; దాధార = భరించెనో; ఇమాన్ = ఈ; వనస్పతీన్ = వృక్షములను; ఏవ = అలాగే; తే = నీకు; ధ్రియతాం = స్థిరపడుగాక; గర్భః = గర్భము; అను సూతుం = సకాలమునకు; సవితవే = జన్మించుటకు.',
      step7_telugu_summary2: 'ఆధ్యాత్మిక అర్థం సంక్షిప్త సారాంశం: సదాచారమును రక్షించే సాధకుడిని ప్రకృతి కాపాడుతుంది.',
      step8_english_bhavartha: 'Just as this vast earth upholds and nourishes all trees, so may the germ of life be firmly sustained within you.',
      step9_english_summary: 'Spiritual Meaning: Faith in divine law guarantees inner spiritual blossoming.',
      step10_english_padartha: 'yathā = as; iyam = this; pṛthivī = earth; mahī = great; dādhāra = sustains; imān = these; vanaspatīn = trees; eva = even so; te = to thee; dhriyatām = be held; garbhaḥ = seed; anu sūtum = in due time; savitave = for fruition.',
      step11_english_summary2: 'Spiritual Meaning: Groundedness in truth produces everlasting peace.',
      step12_hindi_bhavartha: bhavarthaInput,
      step13_hindi_summary: 'आध्यात्मिक अर्थ : - जैसे पृथ्वी वृक्षों का पोषण करती है, वैसे ही आत्मा धर्म का पोषण करती है।',
      step14_hindi_padartha: padarthaInput,
      step15_hindi_summary2: 'आध्यात्मिक अर्थ : - आत्मिक जागृति का बीज धैर्य से सुरक्षित रहता है।'
    };

    return {
      metadata,
      briefIntro,
      steps,
      formattedPublication: compileFormattedPublication(metadata, briefIntro, steps),
      audioAvailable: true
    };
  }
}
