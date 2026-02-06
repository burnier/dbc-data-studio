/**
 * Email service using Resend.
 * Sends beautifully formatted reading emails.
 */
import { Resend } from "resend";
import { getCardImageName } from "./cards";
import { readFileSync } from "fs";
import { join } from "path";

const resend = process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'placeholder'
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface SendReadingEmailParams {
  toEmail: string;
  toName: string;
  readingText: string;
  cardNames: string[];
  cardIds: number[];
  language: string;
}

export async function sendReadingEmail({
  toEmail,
  toName,
  readingText,
  cardNames,
  cardIds,
  language,
}: SendReadingEmailParams): Promise<boolean> {
  if (!resend) {
    // Development mode - log instead of sending
    console.log(`\n📧 [EMAIL DEV MODE] Would send email to: ${toEmail}`);
    console.log(`📝 Subject: Abigail's Apprentice: Your Reading is Ready, ${toName}`);
    console.log(`🃏 Cards: ${cardNames.join(', ')}`);
    console.log(`🖼️  Card Images: ${cardIds.map(id => getCardImageName(id)).join(', ')}`);
    console.log(`📖 Reading preview: ${readingText.substring(0, 150)}...`);
    console.log(`\n⚠️  To send real emails, add a valid RESEND_API_KEY to .env.local`);
    console.log(`⚠️  Card images will show once deployed (localhost images won't load in email)\n`);
    return false; // Return false so the database shows email_sent = 0
  }

  // Email content based on language
  const translations = {
    en: {
      emailTitle: "Abigail | The Hungarian Oracle",
      emailTagline: "Authentic Hungarian Gypsy Card Wisdom",
      emailSubject: `Abigail's Apprentice: Your Reading is Ready, ${toName}`,
      greeting: `Dear ${toName},`,
      intro: "Abigail is currently consulting her physical deck in the tradition of the Hungarian masters. Your preliminary 3-card map is below:",
      cardsTitle: "Your Three Sacred Cards:",
      closing: "May the wisdom of the cards guide your path,\nAbigail",
      ps: "P.S. Want deeper insights?",
      upsellText: "Unlock Abigail's Premium Reading",
      upsellBenefits: "Get a personalized photo of your physical card spread, 3x longer analysis, and actionable guidance for only €19.90.",
      upsellButton: "Unlock Full Reading →",
      upsellLink: `https://abigailartsoracles.com/${language}/premium`,
      footerCopyright: "Abigail | The Hungarian Oracle. All rights reserved.",
    },
    de: {
      emailTitle: "Abigail | Das Ungarische Orakel",
      emailTagline: "Authentische ungarische Zigeunerkarten-Weisheit",
      emailSubject: `Abigails Lehrling: Ihre Lesung ist bereit, ${toName}`,
      greeting: `Liebe/r ${toName},`,
      intro: "Abigail konsultiert derzeit ihr physisches Deck in der Tradition der ungarischen Meister. Ihre vorläufige 3-Karten-Karte ist unten:",
      cardsTitle: "Ihre Drei Heiligen Karten:",
      closing: "Möge die Weisheit der Karten Ihren Weg leiten,\nAbigail",
      ps: "P.S. Tiefere Einblicke gewünscht?",
      upsellText: "Schalten Sie Abigails Premium-Lesung frei",
      upsellBenefits: "Erhalten Sie ein personalisiertes Foto Ihrer physischen Kartenlegung, 3x längere Analyse und umsetzbare Anleitung für nur €19,90.",
      upsellButton: "Vollständige Lesung Freischalten →",
      upsellLink: `https://abigailartsoracles.com/${language}/premium`,
      footerCopyright: "Abigail | Das Ungarische Orakel. Alle Rechte vorbehalten.",
    },
    pt: {
      emailTitle: "Abigail | A Oráculo Húngara",
      emailTagline: "Sabedoria Autêntica das Cartas Ciganas Húngaras",
      emailSubject: `Aprendiz de Abigail: Sua Leitura Está Pronta, ${toName}`,
      greeting: `Quer/a ${toName},`,
      intro: "Abigail está atualmente consultando seu baralho físico na tradição dos mestres húngaros. Seu mapa preliminar de 3 cartas está abaixo:",
      cardsTitle: "Suas Três Cartas Sagradas:",
      closing: "Que a sabedoria das cartas guie seu caminho,\nAbigail",
      ps: "P.S. Quer insights mais profundos?",
      upsellText: "Desbloqueie a Leitura Premium de Abigail",
      upsellBenefits: "Obtenha uma foto personalizada do seu espalhamento físico de cartas, análise 3x mais longa e orientação acionável por apenas R$ 59,90.",
      upsellButton: "Desbloquear Leitura Completa →",
      upsellLink: `https://abigailartsoracles.com/${language}/premium`,
      footerCopyright: "Abigail | A Oráculo Húngara. Todos os direitos reservados.",
    },
    hu: {
      emailTitle: "Abigail | A Magyar Jósnő",
      emailTagline: "Hiteles Magyar Cigánykártya Bölcsesség",
      emailSubject: `Abigail Tanítványa: Az Olvasata Kész, ${toName}`,
      greeting: `Kedves ${toName},`,
      intro: "Abigail jelenleg a fizikai pakliját konzultálja a magyar mesterek hagyománya szerint. Az előzetes 3 kártyás térképe lent található:",
      cardsTitle: "Három Szent Kártyája:",
      closing: "Vezérelje útját a kártyák bölcsessége,\nAbigail",
      ps: "P.S. Mélyebb betekintést szeretne?",
      upsellText: "Oldja Fel Abigail Prémium Olvasatát",
      upsellBenefits: "Kapjon személyre szabott fotót fizikai kártyavetéséről, 3x hosszabb elemzést és gyakorlati útmutatást csak 6990 Ft-ért.",
      upsellButton: "Teljes Olvasat Feloldása →",
      upsellLink: `https://abigailartsoracles.com/${language}/premium`,
      footerCopyright: "Abigail | A Magyar Jósnő. Minden jog fenntartva.",
    },
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  // Prepare inline attachments for card images
  const attachments = cardIds.map((cardId) => {
    const imageName = getCardImageName(cardId);
    const imagePath = join(process.cwd(), 'public', 'cards', `${imageName}.jpg`);

    try {
      const imageBuffer = readFileSync(imagePath);
      return {
        filename: `${imageName}.jpg`,
        content: imageBuffer.toString('base64'),
        encoding: 'base64',
        cid: `card-${cardId}`, // Content ID for inline reference
        disposition: 'inline',
      };
    } catch (error) {
      console.warn(`⚠️  Could not load image: ${imagePath}`, error);
      return null;
    }
  }).filter((att): att is NonNullable<typeof att> => att !== null); // Type-safe null filter

  console.log(`📎 Attaching ${attachments.length} card images to email`);

  // Card image base URL - use CID references for inline attachments
  const cardImageBaseUrl = 'cid:card-';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Georgia', serif; line-height: 1.6; color: #2c2c2c; background: #e6d9f2; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #b38cd9 0%, #674BA9 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 32px; }
        .content { padding: 30px; }
        .greeting { font-size: 18px; margin-bottom: 20px; }
        .intro { font-size: 16px; margin-bottom: 25px; color: #674BA9; font-weight: 600; }
        .reading { background: #f9f9f9; padding: 25px; margin: 25px 0; border-left: 5px solid #674BA9; border-radius: 8px; font-size: 16px; line-height: 1.8; }
        .cards-section { margin: 30px 0; }
        .cards-title { color: #674BA9; font-size: 20px; font-weight: 600; margin-bottom: 15px; text-align: center; }
        .cards { display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; margin: 20px 0; }
        .card-item { background: #e6d9f2; padding: 15px; border-radius: 8px; text-align: center; min-width: 150px; max-width: 200px; }
        .card-image { width: 100%; height: auto; border-radius: 8px; margin-bottom: 10px; }
        .card-name { color: #674BA9; font-weight: 600; font-size: 16px; margin-bottom: 5px; text-transform: capitalize; }
        .signature { margin-top: 30px; font-style: italic; }
        .upsell { margin-top: 40px; background: linear-gradient(135deg, #674BA9 0%, #b38cd9 100%); padding: 30px; border-radius: 12px; text-align: center; color: white; }
        .upsell h3 { margin: 0 0 15px; font-size: 24px; }
        .upsell p { margin: 15px 0; line-height: 1.6; }
        .upsell-btn { display: inline-block; background: #FFD700; color: #1a1a2e; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 18px; margin-top: 15px; transition: transform 0.2s; }
        .upsell-btn:hover { transform: scale(1.05); }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; background: #f9f9f9; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✨ ${t.emailTitle} ✨</h1>
          <p style="margin: 10px 0 0; font-size: 14px; opacity: 0.9;">${t.emailTagline}</p>
        </div>
        <div class="content">
          <p class="greeting">${t.greeting}</p>
          <p class="intro">${t.intro}</p>
          
          <div class="cards-section">
            <p class="cards-title">${t.cardsTitle}</p>
            <div class="cards">
              ${cardIds.map((cardId, index) => `
                <div class="card-item">
                  <img src="cid:card-${cardId}" alt="${cardNames[index]}" class="card-image" />
                  <div class="card-name">${cardNames[index]}</div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="reading">
            <p style="white-space: pre-wrap;">${readingText.replace(/---/g, '<hr style="margin: 20px 0; border: none; border-top: 1px solid #e6d9f2;" />')}</p>
          </div>
          
          <div class="signature">
            <p>${t.closing}</p>
          </div>
        </div>
        
        <div class="upsell">
          <p style="font-size: 14px; margin-bottom: 10px;">${t.ps}</p>
          <h3>${t.upsellText}</h3>
          <p>${t.upsellBenefits}</p>
          <a href="${t.upsellLink}" class="upsell-btn">${t.upsellButton}</a>
        </div>
        
        <div class="footer">
          <p>© 2024 ${t.footerCopyright}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const emailData = {
      from: process.env.EMAIL_FROM || "Abigail Arts & Oracles <abigail@guidance.dbcdatastudio.com>",
      to: toEmail,
      subject: t.emailSubject,
      html: htmlContent,
      attachments: attachments.map(att => ({
        filename: att.filename,
        content: att.content,
        content_id: att.cid,
        disposition: 'inline',
      })),
    };

    await resend.emails.send(emailData as any);
    console.log(`✅ Email sent successfully to ${toEmail}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return false;
  }
}


