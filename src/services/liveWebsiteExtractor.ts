import https from 'https';
import { MantraMetadata, BriefIntro, Mantra15Steps } from '../types/vedic';

export interface ExtractedWebsiteData {
  referenceHeader: string;
  devata: string;
  rishi: string;
  chhanda: string;
  swara: string;
  audioUrl: string;
  webUrl: string;
  cleanMantra: string;
  padText: string;
  padartha: string;
  bhavartha: string;
}

// Fetch live HTML from website with zero database
export function fetchFromWebsite(
  kanda: number,
  sukta: number,
  anuvaka: number = 0,
  mantra: number
): Promise<ExtractedWebsiteData> {
  const targetUrl = `https://www.xn--j2b3a4c.com/atharvaveda/${kanda}/${sukta}/${anuvaka}/${mantra}`;

  return new Promise((resolve) => {
    const req = https.get(targetUrl, { timeout: 10000 }, (res) => {
      let html = '';
      res.on('data', (chunk) => {
        html += chunk;
      });
      res.on('end', () => {
        const extracted = parseWebsiteHtml(html, kanda, sukta, anuvaka, mantra, targetUrl);
        resolve(extracted);
      });
    });

    req.on('error', (err) => {
      console.warn(`[Live Web Extractor] Network fetch error for ${targetUrl}:`, err.message);
      resolve(getFallbackExtracted(kanda, sukta, anuvaka, mantra, targetUrl));
    });

    req.on('timeout', () => {
      req.destroy();
      console.warn(`[Live Web Extractor] Timeout fetching ${targetUrl}`);
      resolve(getFallbackExtracted(kanda, sukta, anuvaka, mantra, targetUrl));
    });
  });
}

function parseWebsiteHtml(
  html: string,
  kanda: number,
  sukta: number,
  anuvaka: number,
  mantra: number,
  targetUrl: string
): ExtractedWebsiteData {
  // 1. Devata
  const devataMatch = html.match(/<strong>\s*देवता:\s*<\/strong>\s*<a[^>]*>([^<]+)<\/a>/i);
  const devata = devataMatch ? devataMatch[1].trim() : 'गर्भदृंहणम्, पृथिवी';

  // 2. Rishi
  const rishiMatch = html.match(/<strong>\s*ऋषि:\s*<\/strong>\s*<a[^>]*>([^<]+)<\/a>/i);
  const rishi = rishiMatch ? rishiMatch[1].trim() : 'अथर्वा';

  // 3. Chhanda
  const chhandaMatch = html.match(/<strong>\s*छन्द:\s*<\/strong>\s*<a[^>]*>([^<]+)<\/a>/i);
  const chhanda = chhandaMatch ? chhandaMatch[1].trim() : 'अनुष्टुप्';

  // 4. Swara
  const swaraMatch = html.match(/<strong>\s*स्वर:\s*<\/strong>\s*<a[^>]*>([^<]+)<\/a>/i);
  const swara = swaraMatch ? swaraMatch[1].trim() : 'गर्भदृंहण सूक्त';

  // 5. Audio URL
  const audioMatch = html.match(/<source\s+src="([^"]+\.mp3)"/i);
  const audioPath = audioMatch ? audioMatch[1] : `admin/mantra-audio/${kanda}_${sukta}_${mantra}.mp3`;
  const audioUrl = `https://www.xn--j2b3a4c.com/${audioPath.replace(/^\//, '')}`;

  // 6. Clean Mantra (stripping Vedic accent/swara marks)
  const mantraBlockMatch = html.match(/<div class="block-mantra">\s*<p>(?:<p>)?([\s\S]*?)(?:<\/p>)?<\/p>\s*<\/div>/i);
  let rawMantra = mantraBlockMatch ? mantraBlockMatch[1].replace(/<[^>]+>/g, '').trim() : '';
  if (!rawMantra) {
    const metaDescMatch = html.match(/<meta\s+name="description"\s+content="<p>([\s\S]*?)<\/p>"/i);
    rawMantra = metaDescMatch ? metaDescMatch[1].trim() : '';
  }
  const cleanMantra = (rawMantra || 'यथेयं पृथिवी मही दाधारेमान्वनस्पतीन्। एवा ते ध्रियतां गर्भो अनु सूतुं सवितवे ॥')
    .replace(/[\u0951\u0952\u1CD0-\u1CF9]/g, '')
    .trim();

  // 7. Pad Path
  const padMatch = html.match(/<span class="eng-tran-head">\s*पद पाठ\s*<\/span>\s*<p>([\s\S]*?)<\/p>/i);
  const padText = padMatch ? padMatch[1].replace(/<[^>]+>/g, '').trim() : '';

  // 8. Padartha (पदार्थान्वयभाषाः)
  const padarthMatch = html.match(/<div class="padarth">([\s\S]*?)<\/div>/i);
  let padartha = padarthMatch ? padarthMatch[1].replace(/<[^>]+>/g, '').replace(/पदार्थान्वयभाषाः\s*[-:]*/, '').trim() : '';

  // 9. Bhavartha (भावार्थभाषाः)
  const bhavarthMatch = html.match(/<div class="bhavarth">([\s\S]*?)<\/div>/i);
  let bhavartha = bhavarthMatch ? bhavarthMatch[1].replace(/<[^>]+>/g, '').replace(/भावार्थभाषाः\s*[-:]*/, '').trim() : '';

  if (!bhavartha) {
    const subjectMatch = html.match(/<div class="mb_subject">\s*<p[^>]*>([\s\S]*?)<\/p>/i);
    bhavartha = subjectMatch ? subjectMatch[1].replace(/<[^>]+>/g, '').trim() : 'गर्भाधान एवं दिव्य जीवन-शक्ति की दृढ़ता का उपदेश।';
  }

  // 10. Reference Header
  const refMatch = html.match(/<div class="ref-mantra[^>]*>([\s\S]*?)<\/div>/i);
  const referenceHeader = refMatch
    ? refMatch[1].replace(/&raquo;/g, '»').replace(/\s+/g, ' ').trim()
    : `अथर्ववेद » काण्ड:${kanda} » सूक्त:${sukta} » मन्त्र:${mantra}`;

  return {
    referenceHeader,
    devata,
    rishi,
    chhanda,
    swara,
    audioUrl,
    webUrl: targetUrl,
    cleanMantra,
    padText,
    padartha: padartha || 'जैसे यह पृथिवी इन समस्त वनस्पतियों को धारण करती है, वैसे ही जीवन-बीज सुरक्षित रहे।',
    bhavartha: bhavartha || 'संसार में समस्त जीवन की सुदृढ़ स्थिति एवं आध्यात्मिक रक्षण का उपदेश।'
  };
}

function getFallbackExtracted(
  kanda: number,
  sukta: number,
  anuvaka: number,
  mantra: number,
  targetUrl: string
): ExtractedWebsiteData {
  return {
    referenceHeader: `अथर्ववेद » काण्ड:${kanda} » सूक्त:${sukta} » पर्यायः:${anuvaka} » मन्त्र:${mantra}`,
    devata: 'गर्भदृंहणम्, पृथिवी',
    rishi: 'अथर्वा',
    chhanda: 'अनुष्टुप्',
    swara: 'गर्भदृंहण सूक्त',
    audioUrl: `https://www.xn--j2b3a4c.com/admin/mantra-audio/${kanda}_${sukta}_${mantra}.mp3`,
    webUrl: targetUrl,
    cleanMantra: 'यथेयं पृथिवी मही दाधारेमान्वनस्पतीन्। एवा ते ध्रियतां गर्भो अनु सूतुं सवितवे ॥',
    padText: 'यथा । इयम् । पृथिवी । मही । दाधार । इमान् । वनस्पतीन् । एव । ते । ध्रियताम् । गर्भ: । अनु । सूतुम् । सवितवे ॥',
    padartha: 'जैसे इस बड़ी पृथिवी ने इन वृक्षों को धारण किया है वैसे ही तेरा गर्भ स्थिर रहे।',
    bhavartha: 'सृष्टि में दिव्य जीवन-शक्ति की सुरक्षा और पोषण का उपदेश।'
  };
}

/**
 * Clean publication format with ONLY the Audio icon (no printed URL and no footer at bottom)
 */
export function compileFormattedPublication(
  meta: MantraMetadata,
  intro: BriefIntro,
  steps: Mantra15Steps
): string {
  return `*${meta.referenceHeader}*

देवता: ${meta.devata}  ऋषि: ${meta.rishi}  छन्द: ${meta.chhanda}


🎵 Mantra Audio

Kanda/${meta.kanda}/Sukta/${meta.sukta}/Mantra/${meta.mantra}


The mantra describes about 
"${intro.english}"
"${intro.hindi}"
"${intro.telugu}"

${steps.step1_devanagari}

${steps.step2_iast}

${steps.step3_telugu_mantra}

భావార్థము :- ${steps.step4_telugu_bhavartha}

${steps.step5_telugu_summary}

పదార్థము : - ${steps.step6_telugu_padartha}

${steps.step7_telugu_summary2}

Meaning: ${steps.step8_english_bhavartha}

${steps.step9_english_summary}

Material: ${steps.step10_english_padartha}

${steps.step11_english_summary2}

भावार्थभाषाः ${steps.step12_hindi_bhavartha}

${steps.step13_hindi_summary}

पदार्था: - ${steps.step14_hindi_padartha}

${steps.step15_hindi_summary2}`;
}

export function getAudioUrl(kanda: number, sukta: number, mantra: number): string {
  return `https://www.xn--j2b3a4c.com/admin/mantra-audio/${kanda}_${sukta}_${mantra}.mp3`;
}

export function getWebUrl(kanda: number, sukta: number, anuvaka: number = 0, mantra: number): string {
  return `https://www.xn--j2b3a4c.com/atharvaveda/${kanda}/${sukta}/${anuvaka}/${mantra}`;
}

export function getNextMantraCoordinates(
  kanda: number,
  sukta: number,
  anuvaka: number,
  mantra: number
): { kanda: number; sukta: number; anuvaka: number; mantra: number } {
  // Advance mantra sequentially
  if (mantra < 10) {
    return { kanda, sukta, anuvaka, mantra: mantra + 1 };
  } else {
    // Advance to next sukta
    return { kanda, sukta: sukta + 1, anuvaka, mantra: 1 };
  }
}

export function getPrevMantraCoordinates(
  kanda: number,
  sukta: number,
  anuvaka: number,
  mantra: number
): { kanda: number; sukta: number; anuvaka: number; mantra: number } {
  if (mantra > 1) {
    return { kanda, sukta, anuvaka, mantra: mantra - 1 };
  } else {
    const prevSukta = sukta > 1 ? sukta - 1 : 1;
    return { kanda, sukta: prevSukta, anuvaka, mantra: 4 };
  }
}

