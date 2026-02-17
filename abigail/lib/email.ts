/**
 * Email service using Resend.
 * Sends beautifully formatted reading emails.
 */
import { Resend } from "resend";
import { getCardImageName } from "./cards";
import { readFileSync } from "fs";
import { join } from "path";
import { EMAIL_CONFIG, type Language } from "./constants";

const resend = process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'placeholder'
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Build email sender address from configuration
const EMAIL_FROM = process.env.EMAIL_FROM || 
  `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromName.toLowerCase()}@${EMAIL_CONFIG.fromDomain}>`;

interface SendReadingEmailParams {
  toEmail: string;
  toName: string;
  readingText: string;
  cardNames: string[];
  cardIds: number[];
  language: string;
  thirdCardName?: string; // For personalized P.S. cliffhanger
  submissionId: number; // For Stripe checkout link
}

export async function sendReadingEmail({
  toEmail,
  toName,
  readingText,
  cardNames,
  cardIds,
  language,
  thirdCardName,
  submissionId,
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
      upsellBenefits: "Get a personalized photo of your physical card spread, 3x longer analysis, and actionable guidance for only $29.00.",
      upsellButton: "Unlock Full Reading →",
      upsellLink: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${language}?upgrade=${submissionId}`,
      footerCopyright: "Abigail | The Hungarian Oracle. All rights reserved.",
      abigailNoteTitle: "A Note from Abigail:",
      abigailNoteIntro: "This preliminary reading was prepared by my apprentice to give you a glimpse of each card's energy.",
      abigailNoteMain: `However, the true power of a reading lies in the hidden connections and patterns that emerge when I physically lay out your cards. These deeper insights require my personal attention and can only be revealed through a complete spread.`,
      abigailNoteIncludes: "Your personalized reading includes:",
      abigailNoteBenefit1: "✓ Full 36-card spread (not just 3!)",
      abigailNoteBenefit2: "✓ Photo of your actual card layout",
      abigailNoteBenefit3: "✓ Deep analysis only I can provide",
      abigailNoteUrgency: "I have reserved 24 hours for you to request this.",
      abigailNoteSignature: "— Abigail, Certified Hungarian Oracle",
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
      upsellBenefits: "Erhalten Sie ein personalisiertes Foto Ihrer physischen Kartenlegung, 3x längere Analyse und umsetzbare Anleitung für nur €24,90.",
      upsellButton: "Vollständige Lesung Freischalten →",
      upsellLink: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${language}?upgrade=${submissionId}`,
      footerCopyright: "Abigail | Das Ungarische Orakel. Alle Rechte vorbehalten.",
      abigailNoteTitle: "Eine Notiz von Abigail:",
      abigailNoteIntro: "Diese vorläufige Lesung wurde von meinem Lehrling vorbereitet, um Ihnen einen Einblick in die Energie jeder Karte zu geben.",
      abigailNoteMain: `Die wahre Kraft einer Lesung liegt jedoch in den verborgenen Verbindungen und Mustern, die entstehen, wenn ich Ihre Karten physisch auslege. Diese tieferen Einsichten erfordern meine persönliche Aufmerksamkeit und können nur durch eine vollständige Legung enthüllt werden.`,
      abigailNoteIncludes: "Ihre personalisierte Lesung umfasst:",
      abigailNoteBenefit1: "✓ Vollständige 36-Karten-Legung (nicht nur 3!)",
      abigailNoteBenefit2: "✓ Foto Ihrer tatsächlichen Kartenlegung",
      abigailNoteBenefit3: "✓ Tiefgehende Analyse, die nur ich bieten kann",
      abigailNoteUrgency: "Ich habe 24 Stunden für Sie reserviert, um dies anzufordern.",
      abigailNoteSignature: "— Abigail, Zertifizierte Ungarische Orakel",
    },
    pt: {
      emailTitle: "Abigail | A Oráculo Húngara",
      emailTagline: "Sabedoria Autêntica das Cartas Ciganas Húngaras",
      emailSubject: `Aprendiz de Abigail: Sua Leitura Está Pronta, ${toName}`,
      greeting: `Querido/a ${toName},`,
      intro: "Abigail está atualmente consultando seu baralho físico na tradição dos mestres húngaros. Seu mapa preliminar de 3 cartas está abaixo:",
      cardsTitle: "Suas Três Cartas Sagradas:",
      closing: "Que a sabedoria das cartas guie seu caminho,\nAbigail",
      ps: "P.S. Quer insights mais profundos?",
      upsellText: "Desbloqueie a Leitura Premium de Abigail",
      upsellBenefits: "Obtenha uma foto personalizada do seu espalhamento físico de cartas, análise 3x mais longa e orientação acionável por apenas R$ 129,00.",
      upsellButton: "Desbloquear Leitura Completa →",
      upsellLink: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${language}?upgrade=${submissionId}`,
      footerCopyright: "Abigail | A Oráculo Húngara. Todos os direitos reservados.",
      abigailNoteTitle: "Uma Nota de Abigail:",
      abigailNoteIntro: "Esta leitura preliminar foi preparada pelo meu aprendiz para lhe dar um vislumbre da energia de cada carta.",
      abigailNoteMain: `No entanto, o verdadeiro poder de uma leitura reside nas conexões ocultas e padrões que emergem quando disponho fisicamente suas cartas. Essas percepções mais profundas requerem minha atenção pessoal e só podem ser reveladas através de um espalhamento completo.`,
      abigailNoteIncludes: "Sua leitura personalizada inclui:",
      abigailNoteBenefit1: "✓ Espalhamento completo de 36 cartas (não apenas 3!)",
      abigailNoteBenefit2: "✓ Foto do seu espalhamento real",
      abigailNoteBenefit3: "✓ Análise profunda que só eu posso fornecer",
      abigailNoteUrgency: "Reservei 24 horas para você solicitar isto.",
      abigailNoteSignature: "— Abigail, Oráculo Húngara Certificada",
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
      upsellBenefits: "Kapjon személyre szabott fotót fizikai kártyavetéséről, 3x hosszabb elemzést és gyakorlati útmutatást csak 8.900 Ft-ért.",
      upsellButton: "Teljes Olvasat Feloldása →",
      upsellLink: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${language}?upgrade=${submissionId}`,
      footerCopyright: "Abigail | A Magyar Jósnő. Minden jog fenntartva.",
      abigailNoteTitle: "Jegyzet Abigailtől:",
      abigailNoteIntro: "Ezt az előzetes olvasatot a tanítványom készítette, hogy bepillantást nyújtson minden kártya energiájába.",
      abigailNoteMain: `Az olvasat valódi ereje azonban a rejtett kapcsolatokban és mintákban rejlik, amelyek akkor jelennek meg, amikor fizikailag kirakom kártyáit. Ezek a mélyebb betekintések személyes figyelmemet igénylik, és csak egy teljes vetésen keresztül tárhatók fel.`,
      abigailNoteIncludes: "Személyre szabott olvasata tartalmazza:",
      abigailNoteBenefit1: "✓ Teljes 36 kártyás vetés (nem csak 3!)",
      abigailNoteBenefit2: "✓ Fotó a valódi kártyaelrendezésről",
      abigailNoteBenefit3: "✓ Mélyreható elemzés, amit csak én tudok nyújtani",
      abigailNoteUrgency: "24 órát foglaltam le Önnek, hogy ezt kérje.",
      abigailNoteSignature: "— Abigail, Hitelesített Magyar Jósnő",
    },
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  // Use public URLs for images (Vercel deployment-friendly)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const attachments: any[] = []; // No attachments, use public URLs instead

  console.log(`🌐 Using public card image URLs from: ${baseUrl}`);

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
        .signature { margin-top: 30px; font-style: italic; }
        .abigail-note { margin-top: 30px; background: linear-gradient(135deg, #f8f4ff 0%, #fff 100%); border: 2px solid #674BA9; padding: 25px; border-radius: 12px; }
        .abigail-note h3 { color: #674BA9; font-size: 20px; margin: 0 0 15px; font-weight: 600; }
        .abigail-note p { margin: 12px 0; font-size: 15px; line-height: 1.7; color: #2c2c2c; }
        .abigail-note .benefits { margin: 15px 0; padding-left: 0; }
        .abigail-note .benefits li { list-style: none; margin: 8px 0; font-size: 15px; color: #674BA9; font-weight: 500; }
        .abigail-note .urgency { margin-top: 15px; padding: 12px; background: #fff9e6; border-left: 4px solid #FFD700; border-radius: 6px; font-weight: 600; color: #b8860b; }
        .abigail-note .signature-line { text-align: right; font-style: italic; color: #674BA9; margin-top: 20px; font-weight: 600; }
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
            
            <!-- Mobile-first stacked card layout -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 20px auto; width: 100%; max-width: 600px;">
              ${cardIds.map((cardId, index) => {
                const imageName = getCardImageName(cardId);
                const imageUrl = `${baseUrl}/cards/${imageName}.jpg`;
                return `
                <tr>
                  <td align="center" style="padding: 10px 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="background: #e6d9f2; border-radius: 8px; padding: 15px; width: 100%; max-width: 280px;">
                      <tr>
                        <td align="center">
                          <img src="${imageUrl}" alt="${cardNames[index]}" style="width: 100%; max-width: 250px; height: auto; border-radius: 8px; margin-bottom: 10px; display: block;" />
                          <div style="color: #674BA9; font-weight: 600; font-size: 16px; text-align: center; text-transform: capitalize; padding: 5px;">${cardNames[index]}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              `;
              }).join('')}
            </table>
          </div>
          
          <div class="reading">
            <p style="white-space: pre-wrap;">${readingText.replace(/---/g, '<hr style="margin: 20px 0; border: none; border-top: 1px solid #e6d9f2;" />')}</p>
          </div>
          
          <div class="signature">
            <p>${t.closing}</p>
          </div>
          
          ${thirdCardName ? `
          <div class="abigail-note">
            <h3>${t.abigailNoteTitle}</h3>
            <p>${t.abigailNoteIntro}</p>
            <p style="font-weight: 600; color: #674BA9;">${t.abigailNoteMain}</p>
            
            <p style="margin-top: 20px; margin-bottom: 8px; font-weight: 600;">${t.abigailNoteIncludes}</p>
            <ul class="benefits">
              <li>${t.abigailNoteBenefit1}</li>
              <li>${t.abigailNoteBenefit2}</li>
              <li>${t.abigailNoteBenefit3}</li>
            </ul>
            
            <div class="urgency">${t.abigailNoteUrgency}</div>
            
            <p class="signature-line">${t.abigailNoteSignature}</p>
          </div>
          ` : ''}
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
      from: EMAIL_FROM,
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

/**
 * Send premium reading fulfillment email
 */
interface SendPremiumReadingEmailParams {
  toEmail: string;
  toName: string;
  readingText: string;
  photoPath: string | null;
  language: string;
}

export async function sendPremiumReadingEmail({
  toEmail,
  toName,
  readingText,
  photoPath,
  language,
}: SendPremiumReadingEmailParams): Promise<boolean> {
  if (!resend) {
    console.log(`\n📧 [EMAIL DEV MODE] Would send PREMIUM email to: ${toEmail}`);
    console.log(`📝 Subject: Your Complete Reading from Abigail`);
    console.log(`📖 Reading length: ${readingText.length} characters`);
    console.log(`🖼️  Photo: ${photoPath || 'None'}`);
    console.log(`\n⚠️  To send real emails, add a valid RESEND_API_KEY to .env.local\n`);
    return false;
  }

  const translations = {
    en: {
      subject: `${toName}, Your Complete Reading from Abigail ✨`,
      title: "Abigail | The Hungarian Oracle",
      greeting: `Dear ${toName},`,
      intro: "Thank you for trusting me with your journey. Here is your complete, personalized reading:",
      photoTitle: "Your Physical Card Spread",
      readingTitle: "Your Complete Reading",
      signature: "With warmth and insight,",
      signatureName: "Abigail",
      signatureTitle: "Certified Hungarian Gypsy Card Practitioner",
      footer: "© 2024 Abigail | The Hungarian Oracle. All rights reserved.",
    },
    de: {
      subject: `${toName}, Ihre vollständige Deutung von Abigail ✨`,
      title: "Abigail | Das ungarische Orakel",
      greeting: `Liebe/r ${toName},`,
      intro: "Vielen Dank, dass Sie mir Ihre Reise anvertraut haben. Hier ist Ihre vollständige, persönliche Deutung:",
      photoTitle: "Ihre physische Kartenlegung",
      readingTitle: "Ihre vollständige Deutung",
      signature: "Mit Wärme und Einsicht,",
      signatureName: "Abigail",
      signatureTitle: "Zertifizierte ungarische Zigeunerkarten-Praktikerin",
      footer: "© 2024 Abigail | Das ungarische Orakel. Alle Rechte vorbehalten.",
    },
    pt: {
      subject: `${toName}, Sua Leitura Completa de Abigail ✨`,
      title: "Abigail | O Oráculo Húngaro",
      greeting: `Querido(a) ${toName},`,
      intro: "Obrigada por confiar em mim com sua jornada. Aqui está sua leitura completa e personalizada:",
      photoTitle: "Seu Espalhamento Físico de Cartas",
      readingTitle: "Sua Leitura Completa",
      signature: "Com carinho e clareza,",
      signatureName: "Abigail",
      signatureTitle: "Praticante Certificada de Cartas Ciganas Húngaras",
      footer: "© 2024 Abigail | O Oráculo Húngaro. Todos os direitos reservados.",
    },
    hu: {
      subject: `${toName}, Az Ön teljes olvasása Abigailtől ✨`,
      title: "Abigail | A Magyar Jós",
      greeting: `Kedves ${toName}!`,
      intro: "Köszönöm, hogy rám bízta az útját. Itt van az Ön teljes, személyre szabott olvasása:",
      photoTitle: "Az Ön fizikai kártyavetése",
      readingTitle: "Az Ön teljes olvasása",
      signature: "Melegséggel és betekintéssel,",
      signatureName: "Abigail",
      signatureTitle: "Okleveles magyar cigánykártya-gyakorló",
      footer: "© 2024 Abigail | A Magyar Jós. Minden jog fenntartva.",
    },
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  // Prepare photo attachment if provided
  let photoAttachment = null;
  let photoEmbedHtml = '';
  
  if (photoPath) {
    try {
      // Photo is in /tmp from the fulfill API
      const photoBuffer = readFileSync(photoPath);
      const photoExt = photoPath.split('.').pop() || 'jpg';
      
      photoAttachment = {
        filename: `spread-photo.${photoExt}`,
        content: photoBuffer,
        cid: 'spread-photo',
      };

      photoEmbedHtml = `
        <div style="margin: 30px 0; text-align: center;">
          <h3 style="color: #D8B4FE; font-family: serif; font-size: 18px; margin-bottom: 15px;">
            ${t.photoTitle}
          </h3>
          <img src="cid:spread-photo" alt="Your card spread" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 12px rgba(138, 43, 226, 0.3);" />
        </div>
      `;
    } catch (error) {
      console.error('Failed to load photo for email:', error);
      console.error('Photo path:', photoPath);
    }
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background-color: #1a1625;
          color: #F5F5DC;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: linear-gradient(135deg, #2D1B69 0%, #1a1625 100%);
          border: 2px solid rgba(138, 43, 226, 0.3);
          border-radius: 16px;
        }
        .header {
          text-align: center;
          padding: 40px 20px 20px;
          border-bottom: 1px solid rgba(216, 180, 254, 0.2);
        }
        .header h1 {
          color: #D8B4FE;
          font-size: 28px;
          margin: 0 0 10px;
          font-family: serif;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 18px;
          color: #D8B4FE;
          margin-bottom: 20px;
        }
        .reading-box {
          background: rgba(138, 43, 226, 0.1);
          border-left: 4px solid #8A2BE2;
          padding: 25px;
          margin: 25px 0;
          border-radius: 8px;
          line-height: 1.8;
          font-size: 16px;
          white-space: pre-wrap;
          color: #F5F5DC;
        }
        .signature {
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid rgba(216, 180, 254, 0.2);
          font-style: italic;
          color: #D8B4FE;
        }
        .footer {
          text-align: center;
          padding: 30px;
          font-size: 12px;
          color: rgba(245, 245, 220, 0.5);
          border-top: 1px solid rgba(216, 180, 254, 0.2);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✨ ${t.title} ✨</h1>
        </div>
        
        <div class="content">
          <p class="greeting">${t.greeting}</p>
          <p style="color: #F5F5DC;">${t.intro}</p>
          
          ${photoEmbedHtml}
          
          <h3 style="color: #D8B4FE; font-family: serif; margin-top: 30px;">
            ${t.readingTitle}
          </h3>
          <div class="reading-box">
            ${readingText}
          </div>
          
          <div class="signature">
            <p style="margin: 5px 0;">${t.signature}</p>
            <p style="margin: 5px 0; font-size: 18px; color: #F5F5DC;"><strong>${t.signatureName}</strong></p>
            <p style="margin: 5px 0; font-size: 14px; color: rgba(245, 245, 220, 0.7);">${t.signatureTitle}</p>
          </div>
        </div>
        
        <div class="footer">
          <p>${t.footer}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const emailData: any = {
      from: EMAIL_FROM,
      to: toEmail,
      subject: t.subject,
      html: htmlContent,
    };

    if (photoAttachment) {
      emailData.attachments = [{
        filename: photoAttachment.filename,
        content: photoAttachment.content,
        content_id: photoAttachment.cid,
        disposition: 'inline',
      }];
    }

    await resend.emails.send(emailData);
    console.log(`✅ Premium email sent successfully to ${toEmail}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending premium email:", error);
    return false;
  }
}


