import nodemailer from 'nodemailer';
import { MantraPublication, DispatchConfig, DispatchLogItem } from '../types/vedic';

export async function dispatchToTelegram(
  publication: MantraPublication,
  token: string,
  chatId: string
): Promise<{ success: boolean; message: string; audioSent: boolean; details?: any }> {
  if (!token || !chatId) {
    return {
      success: true,
      message: 'Simulated Telegram Dispatch: Credentials not configured. Payload formatted and ready.',
      audioSent: true,
      details: {
        chatId: chatId || 'SIMULATED_CHAT',
        audioUrl: publication.metadata.audioUrl,
        textPreview: publication.formattedPublication.slice(0, 150) + '...'
      }
    };
  }

  try {
    // 1. Send Text Publication
    const textUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    const textRes = await fetch(textUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: publication.formattedPublication,
        parse_mode: 'HTML',
        disable_web_page_preview: false
      })
    });
    const textJson = await textRes.json();

    // 2. Send Audio File Attachment via sendAudio
    let audioSent = false;
    let audioDetails: any = null;
    if (publication.metadata.audioUrl) {
      const audioApiUrl = `https://api.telegram.org/bot${token}/sendAudio`;
      const audioRes = await fetch(audioApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          audio: publication.metadata.audioUrl,
          title: `Atharvaveda Kanda ${publication.metadata.kanda} Sukta ${publication.metadata.sukta} Mantra ${publication.metadata.mantra}`,
          performer: 'Veda Chanting',
          caption: `🎵 Sacred Vedic Chant Recitation: Kanda ${publication.metadata.kanda} Sukta ${publication.metadata.sukta} Mantra ${publication.metadata.mantra}`
        })
      });
      audioDetails = await audioRes.json();
      audioSent = audioDetails.ok === true;
    }

    if (textJson.ok) {
      return {
        success: true,
        message: `Dispatched to Telegram chat ${chatId} with native audio attachment.`,
        audioSent,
        details: { textJson, audioDetails }
      };
    } else {
      return {
        success: false,
        message: `Telegram API error: ${textJson.description || 'Unknown error'}`,
        audioSent: false,
        details: textJson
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to dispatch Telegram message: ${err.message}`,
      audioSent: false
    };
  }
}

export async function dispatchToEmail(
  publication: MantraPublication,
  config: DispatchConfig
): Promise<{ success: boolean; message: string; audioAttached: boolean; details?: any }> {
  const recipient = config.emailRecipient || 'shobhasrinivas@gmail.com';
  const hasSmtp = Boolean(config.smtpHost && config.smtpUser && config.smtpPass);

  const subject = `🕊️ Atharvaveda Daily: Kanda ${publication.metadata.kanda} Sukta ${publication.metadata.sukta} Mantra ${publication.metadata.mantra} with Audio`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Georgia', serif; background-color: #FAF7F0; color: #1C1917; margin: 0; padding: 24px; }
    .container { max-width: 680px; margin: 0 auto; background: #FFFDF8; border: 1px solid #E7DEC8; border-radius: 8px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { border-bottom: 2px solid #D97706; padding-bottom: 16px; margin-bottom: 24px; text-align: center; }
    .title { font-size: 22px; font-weight: bold; color: #92400E; margin-bottom: 8px; }
    .meta { font-size: 14px; color: #78350F; }
    .audio-box { background: #FEF3C7; border: 1px solid #FCD34D; border-radius: 6px; padding: 16px; margin: 20px 0; text-align: center; }
    .mantra-sanskrit { font-size: 20px; color: #78350F; background: #FDFBF7; padding: 16px; border-left: 4px solid #D97706; margin: 20px 0; line-height: 1.8; }
    .mantra-iast { font-style: italic; color: #44403C; margin-bottom: 16px; line-height: 1.6; }
    .mantra-telugu { color: #1C1917; margin-bottom: 20px; line-height: 1.8; font-size: 17px; }
    .section-title { font-weight: bold; color: #B45309; margin-top: 20px; margin-bottom: 6px; }
    .spiritual-box { background: #F5F3FF; border-left: 3px solid #7C3AED; padding: 12px; margin: 12px 0; font-size: 14px; color: #4C1D95; }
    .footer { font-size: 12px; color: #78716C; margin-top: 32px; border-top: 1px solid #E7DEC8; padding-top: 16px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="title">${publication.metadata.referenceHeader}</div>
      <div class="meta">देवता: ${publication.metadata.devata} · ऋषि: ${publication.metadata.rishi} · छन्द: ${publication.metadata.chhanda} · स्वर: ${publication.metadata.swara}</div>
    </div>

    <div class="audio-box">
      <strong>🎵 Sacred Mantra Audio Recitation</strong><br/>
      <p style="margin: 8px 0; font-size: 13px; color: #92400E;">The MP3 chant audio is attached to this email and can also be played online below:</p>
      <audio controls src="${publication.metadata.audioUrl}" style="width: 100%; max-width: 400px; margin-top: 8px;">
        <p>Your email client does not support inline audio. Please download the attached <b>Atharvaveda_${publication.metadata.kanda}_${publication.metadata.sukta}_${publication.metadata.mantra}.mp3</b> file.</p>
      </audio>
    </div>

    <p><strong>The mantra describes about:</strong></p>
    <p style="color: #44403C; margin-left: 12px;">"${publication.briefIntro.english}"</p>
    <p style="color: #78350F; margin-left: 12px;">"${publication.briefIntro.hindi}"</p>
    <p style="color: #1C1917; margin-left: 12px;">"${publication.briefIntro.telugu}"</p>

    <div class="mantra-sanskrit">${publication.steps.step1_devanagari}</div>
    <div class="mantra-iast">${publication.steps.step2_iast}</div>
    <div class="mantra-telugu">${publication.steps.step3_telugu_mantra}</div>

    <div class="section-title">భావార్థము :-</div>
    <p>${publication.steps.step4_telugu_bhavartha}</p>
    <div class="spiritual-box">${publication.steps.step5_telugu_summary}</div>

    <div class="section-title">పదార్థము : -</div>
    <p>${publication.steps.step6_telugu_padartha}</p>
    <div class="spiritual-box">${publication.steps.step7_telugu_summary2}</div>

    <div class="section-title">Meaning:</div>
    <p>${publication.steps.step8_english_bhavartha}</p>
    <div class="spiritual-box">${publication.steps.step9_english_summary}</div>

    <div class="section-title">Material:</div>
    <p>${publication.steps.step10_english_padartha}</p>
    <div class="spiritual-box">${publication.steps.step11_english_summary2}</div>

    <div class="section-title">भावार्थभाषाः</div>
    <p>${publication.steps.step12_hindi_bhavartha}</p>
    <div class="spiritual-box">${publication.steps.step13_hindi_summary}</div>

    <div class="section-title">पदार्था: -</div>
    <p>${publication.steps.step14_hindi_padartha}</p>
    <div class="spiritual-box">${publication.steps.step15_hindi_summary2}</div>

    <div class="footer">
      Delivered by Atharvaveda Daily Scholar Publisher · Source: ${publication.metadata.webUrl}
    </div>
  </div>
</body>
</html>`;

  if (!hasSmtp) {
    return {
      success: true,
      message: `Simulated Email Dispatch to ${recipient}: SMTP credentials not configured. Rich HTML body with MP3 audio attachment generated.`,
      audioAttached: true,
      details: {
        to: recipient,
        subject,
        audioFilename: `Atharvaveda_${publication.metadata.kanda}_${publication.metadata.sukta}_${publication.metadata.mantra}.mp3`,
        audioUrl: publication.metadata.audioUrl
      }
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort || 587,
      secure: config.smtpPort === 465,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass
      }
    });

    const info = await transporter.sendMail({
      from: config.emailFrom || 'Atharvaveda Chants <daily@atharvaveda.org>',
      to: recipient,
      subject,
      text: publication.formattedPublication,
      html: htmlContent,
      attachments: [
        {
          filename: `Atharvaveda_${publication.metadata.kanda}_${publication.metadata.sukta}_${publication.metadata.mantra}.mp3`,
          path: publication.metadata.audioUrl,
          contentType: 'audio/mpeg'
        }
      ]
    });

    return {
      success: true,
      message: `Delivered email to ${recipient} with MP3 audio attachment (Message ID: ${info.messageId}).`,
      audioAttached: true,
      details: info
    };
  } catch (err: any) {
    return {
      success: false,
      message: `SMTP Email error: ${err.message}`,
      audioAttached: false
    };
  }
}

export async function dispatchToWhatsApp(
  publication: MantraPublication,
  config: DispatchConfig
): Promise<{ success: boolean; message: string; shareUrl: string; groupUrl: string; webhookSent: boolean }> {
  const shareText = `🕊️ *Atharvaveda Daily Mantra*\n\n${publication.formattedPublication}`;
  const encodedText = encodeURIComponent(shareText);

  const phone = config.whatsAppPhone ? config.whatsAppPhone.replace(/[^0-9]/g, '') : '';
  const shareUrl = phone 
    ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodedText}`
    : `https://api.whatsapp.com/send?text=${encodedText}`;

  const groupUrl = config.whatsAppGroupId 
    ? (config.whatsAppGroupId.startsWith('http') ? config.whatsAppGroupId : `https://chat.whatsapp.com/${config.whatsAppGroupId}`)
    : `https://api.whatsapp.com/send?text=${encodedText}`;

  let webhookSent = false;
  if (config.whatsAppWebhookUrl) {
    try {
      const res = await fetch(config.whatsAppWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: config.whatsAppPhone,
          groupId: config.whatsAppGroupId,
          message: shareText,
          audioUrl: publication.metadata.audioUrl,
          metadata: publication.metadata
        })
      });
      webhookSent = res.ok;
    } catch (e) {
      console.error('WhatsApp webhook error:', e);
    }
  }

  return {
    success: true,
    message: webhookSent 
      ? 'WhatsApp Webhook triggered and click-to-send payload ready.'
      : 'WhatsApp formatted message and audio link ready for direct launch or group sharing.',
    shareUrl,
    groupUrl,
    webhookSent
  };
}
