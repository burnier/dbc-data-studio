import Link from 'next/link';

type Language = 'en' | 'de' | 'pt' | 'hu';
type LegalType = 'privacy' | 'terms' | 'refund';

interface Section {
  heading: string;
  body: string | string[]; // string = paragraph, string[] = bullet list
}

interface LegalContent {
  title: string;
  updated: string;
  backLabel: string;
  sections: Section[];
}

// ─── PRIVACY POLICY ──────────────────────────────────────────────────────────

const privacy: Record<Language, LegalContent> = {
  en: {
    title: 'Privacy Policy',
    updated: 'Last updated: February 2025',
    backLabel: '← Back',
    sections: [
      {
        heading: '1. Who we are',
        body: 'This website is operated by DBC Data Studio on behalf of Abigail, The Hungarian Oracle. Contact: contact@dbcdatastudio.com',
      },
      {
        heading: '2. Data we collect',
        body: [
          'Your first and last name',
          'Your email address',
          'Your question or intention for the reading',
          'Your chosen language and the cards drawn',
          'Payment information (processed by Stripe — we never see your card details)',
          'Anonymous usage data via Google Analytics and Vercel Analytics (requires your consent)',
        ],
      },
      {
        heading: '3. How we use your data',
        body: [
          'To deliver your card reading by email',
          'To process payment (via Stripe)',
          'To respond to questions or support requests',
          'To improve our service (anonymous analytics only)',
          'We do not sell your data, share it with third parties for marketing, or use it for automated profiling.',
        ],
      },
      {
        heading: '4. Legal basis (GDPR)',
        body: 'We process your data under Article 6(1)(b) GDPR (performance of a contract) for the reading service and Article 6(1)(a) GDPR (your consent) for analytics cookies.',
      },
      {
        heading: '5. Data retention',
        body: 'Your submission data is retained for up to 12 months after your reading is delivered, then deleted. You may request earlier deletion at any time.',
      },
      {
        heading: '6. Your rights',
        body: [
          'Access the personal data we hold about you',
          'Request correction or deletion of your data',
          'Withdraw consent for analytics at any time',
          'Lodge a complaint with your local supervisory authority',
          'To exercise these rights, email contact@dbcdatastudio.com.',
        ],
      },
      {
        heading: '7. Third-party processors',
        body: [
          'Stripe — payment processing (stripe.com/privacy)',
          'Resend — email delivery (resend.com/privacy)',
          'Vercel — hosting and analytics (vercel.com/legal/privacy-policy)',
          'Google Analytics — usage analytics (consent required)',
        ],
      },
    ],
  },
  de: {
    title: 'Datenschutzrichtlinie',
    updated: 'Zuletzt aktualisiert: Februar 2025',
    backLabel: '← Zurück',
    sections: [
      {
        heading: '1. Wer wir sind',
        body: 'Diese Website wird von DBC Data Studio im Auftrag von Abigail, dem Ungarischen Orakel, betrieben. Kontakt: contact@dbcdatastudio.com',
      },
      {
        heading: '2. Welche Daten wir erheben',
        body: [
          'Ihren Vor- und Nachnamen',
          'Ihre E-Mail-Adresse',
          'Ihre Frage oder Intention für die Kartenlegung',
          'Ihre gewählte Sprache und die gezogenen Karten',
          'Zahlungsinformationen (verarbeitet von Stripe — Ihre Kartendaten sind für uns nicht sichtbar)',
          'Anonyme Nutzungsdaten über Google Analytics und Vercel Analytics (erfordert Ihre Einwilligung)',
        ],
      },
      {
        heading: '3. Wie wir Ihre Daten verwenden',
        body: [
          'Um Ihre Kartenlegung per E-Mail zu liefern',
          'Um die Zahlung zu verarbeiten (über Stripe)',
          'Um auf Fragen oder Support-Anfragen zu antworten',
          'Um unseren Service zu verbessern (nur anonyme Analysen)',
          'Wir verkaufen Ihre Daten nicht, geben sie nicht an Dritte für Marketingzwecke weiter und verwenden sie nicht für automatisierte Profilerstellung.',
        ],
      },
      {
        heading: '4. Rechtsgrundlage (DSGVO)',
        body: 'Wir verarbeiten Ihre Daten gemäß Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) für den Legedienst und Art. 6 Abs. 1 lit. a DSGVO (Ihre Einwilligung) für Analyse-Cookies.',
      },
      {
        heading: '5. Datenspeicherung',
        body: 'Ihre Daten werden bis zu 12 Monate nach Lieferung Ihrer Legung gespeichert und dann gelöscht. Sie können jederzeit eine frühere Löschung beantragen.',
      },
      {
        heading: '6. Ihre Rechte',
        body: [
          'Auskunft über die zu Ihrer Person gespeicherten Daten',
          'Berichtigung oder Löschung Ihrer Daten',
          'Widerruf der Einwilligung in Analyse-Cookies jederzeit',
          'Beschwerde bei Ihrer zuständigen Datenschutzbehörde',
          'Zur Ausübung dieser Rechte wenden Sie sich bitte an: contact@dbcdatastudio.com',
        ],
      },
      {
        heading: '7. Drittanbieter',
        body: [
          'Stripe — Zahlungsabwicklung (stripe.com/privacy)',
          'Resend — E-Mail-Zustellung (resend.com/privacy)',
          'Vercel — Hosting und Analysen (vercel.com/legal/privacy-policy)',
          'Google Analytics — Nutzungsanalysen (Einwilligung erforderlich)',
        ],
      },
    ],
  },
  pt: {
    title: 'Política de Privacidade',
    updated: 'Última atualização: Fevereiro de 2025',
    backLabel: '← Voltar',
    sections: [
      {
        heading: '1. Quem somos',
        body: 'Este site é operado pela DBC Data Studio em nome de Abigail, o Oráculo Húngaro. Contato: contact@dbcdatastudio.com',
      },
      {
        heading: '2. Dados que coletamos',
        body: [
          'Seu nome e sobrenome',
          'Seu endereço de e-mail',
          'Sua pergunta ou intenção para a tiragem',
          'Seu idioma escolhido e as cartas tiradas',
          'Informações de pagamento (processadas pela Stripe — nunca vemos seus dados de cartão)',
          'Dados de uso anônimos via Google Analytics e Vercel Analytics (requer seu consentimento)',
        ],
      },
      {
        heading: '3. Como usamos seus dados',
        body: [
          'Para entregar sua tiragem de cartas por e-mail',
          'Para processar o pagamento (via Stripe)',
          'Para responder a perguntas ou solicitações de suporte',
          'Para melhorar nosso serviço (apenas análises anônimas)',
          'Não vendemos seus dados, não os compartilhamos com terceiros para marketing, nem os usamos para criação de perfis automatizados.',
        ],
      },
      {
        heading: '4. Base legal (LGPD)',
        body: 'Tratamos seus dados com base no Art. 7º, V da LGPD (execução de contrato) para o serviço de tiragem, e no Art. 7º, I (seu consentimento) para cookies de análise.',
      },
      {
        heading: '5. Retenção de dados',
        body: 'Seus dados são retidos por até 12 meses após a entrega da sua tiragem e depois excluídos. Você pode solicitar a exclusão antecipada a qualquer momento.',
      },
      {
        heading: '6. Seus direitos',
        body: [
          'Acessar os dados pessoais que mantemos sobre você',
          'Solicitar correção ou exclusão dos seus dados',
          'Retirar o consentimento para análises a qualquer momento',
          'Registrar uma reclamação junto à autoridade competente (ANPD)',
          'Para exercer esses direitos, envie um e-mail para contact@dbcdatastudio.com.',
        ],
      },
      {
        heading: '7. Processadores terceiros',
        body: [
          'Stripe — processamento de pagamentos (stripe.com/privacy)',
          'Resend — entrega de e-mails (resend.com/privacy)',
          'Vercel — hospedagem e análises (vercel.com/legal/privacy-policy)',
          'Google Analytics — análises de uso (consentimento necessário)',
        ],
      },
    ],
  },
  hu: {
    title: 'Adatvédelmi Irányelvek',
    updated: 'Utoljára frissítve: 2025. február',
    backLabel: '← Vissza',
    sections: [
      {
        heading: '1. Kik vagyunk',
        body: 'Ezt a weboldalt a DBC Data Studio üzemelteti Abigail, a Magyar Jós nevében. Kapcsolat: contact@dbcdatastudio.com',
      },
      {
        heading: '2. Milyen adatokat gyűjtünk',
        body: [
          'Az Ön utó- és vezetéknevét',
          'Az Ön e-mail-címét',
          'Az Ön kérdését vagy szándékát a kártyavetéshez',
          'A választott nyelvet és a húzott kártyákat',
          'Fizetési adatokat (a Stripe dolgozza fel — a kártyaadatokat mi soha nem látjuk)',
          'Névtelen használati adatokat a Google Analytics és a Vercel Analytics segítségével (hozzájárulást igényel)',
        ],
      },
      {
        heading: '3. Hogyan használjuk az adatait',
        body: [
          'Az Ön kártyavetésének e-mailben történő kézbesítéséhez',
          'A fizetés feldolgozásához (a Stripe-on keresztül)',
          'Kérdésekre és támogatási kérésekre való válaszadáshoz',
          'Szolgáltatásunk fejlesztéséhez (csak névtelen elemzések)',
          'Az Ön adatait nem adjuk el, nem osztjuk meg harmadik felekkel marketing célból, és nem használjuk automatizált profilalkotáshoz.',
        ],
      },
      {
        heading: '4. Jogalap (GDPR)',
        body: 'Az Ön adatait a GDPR 6. cikk (1) bekezdés b) pontja (szerződés teljesítése) alapján kezeljük a kártyavetési szolgáltatás esetén, és a 6. cikk (1) bekezdés a) pontja (hozzájárulás) alapján az elemzési sütik esetén.',
      },
      {
        heading: '5. Adatmegőrzés',
        body: 'Az Ön adatait a kártyavetés kézbesítésétől számított legfeljebb 12 hónapig őrizzük meg, majd töröljük. Bármikor kérheti a korábbi törlést.',
      },
      {
        heading: '6. Az Ön jogai',
        body: [
          'Hozzáférés az általunk tárolt személyes adataihoz',
          'Az adatok helyesbítésének vagy törlésének kérése',
          'Az elemzési sütikhez adott hozzájárulás visszavonása bármikor',
          'Panasz benyújtása az illetékes adatvédelmi hatósághoz (NAIH)',
          'E jogok gyakorlásához írjon a következő címre: contact@dbcdatastudio.com',
        ],
      },
      {
        heading: '7. Harmadik fél adatfeldolgozók',
        body: [
          'Stripe — fizetésfeldolgozás (stripe.com/privacy)',
          'Resend — e-mail kézbesítés (resend.com/privacy)',
          'Vercel — tárhely és elemzések (vercel.com/legal/privacy-policy)',
          'Google Analytics — használati elemzések (hozzájárulás szükséges)',
        ],
      },
    ],
  },
};

// ─── TERMS OF SERVICE ────────────────────────────────────────────────────────

const terms: Record<Language, LegalContent> = {
  en: {
    title: 'Terms of Service',
    updated: 'Last updated: February 2025',
    backLabel: '← Back',
    sections: [
      { heading: '1. Service description', body: 'Abigail, The Hungarian Oracle provides card reading services for entertainment and spiritual guidance purposes only. Readings are not a substitute for professional medical, legal, financial, or psychological advice. The service is provided by DBC Data Studio (contact@dbcdatastudio.com).' },
      { heading: '2. Free reading', body: 'The initial 3-card reading provided free of charge is generated with AI assistance as a preview. It is intended as a glimpse of your cards\' energy, not a comprehensive reading.' },
      { heading: '3. Premium reading', body: 'The paid 36-card ritual reading is performed manually by Abigail. Delivery is within 24 hours of confirmed payment. You will receive your reading and a photo of your physical card spread by email.' },
      { heading: '4. Payment', body: 'Payments are processed securely by Stripe. By completing a purchase you agree to Stripe\'s terms. All prices are inclusive of applicable taxes where required.' },
      { heading: '5. Refunds', body: 'Please refer to our Refund Policy for full details. Refunds may be granted within 24 hours of purchase if the reading has not yet been started. Once delivered, no refunds are issued.' },
      { heading: '6. Disclaimer', body: 'Card readings are provided for spiritual and entertainment purposes. We make no guarantee of accuracy or outcomes. Results are subjective and should not be relied upon for major life decisions.' },
      { heading: '7. Governing law', body: 'These terms are governed by the laws of the European Union and the country of residence of the service provider.' },
      { heading: '8. Contact', body: 'contact@dbcdatastudio.com' },
    ],
  },
  de: {
    title: 'Nutzungsbedingungen',
    updated: 'Zuletzt aktualisiert: Februar 2025',
    backLabel: '← Zurück',
    sections: [
      { heading: '1. Leistungsbeschreibung', body: 'Abigail, das Ungarische Orakel, bietet Kartenlegungen ausschließlich zu Unterhaltungs- und spirituellen Beratungszwecken an. Kartenlegungen ersetzen keine professionelle medizinische, rechtliche, finanzielle oder psychologische Beratung. Der Dienst wird von DBC Data Studio (contact@dbcdatastudio.com) bereitgestellt.' },
      { heading: '2. Kostenlose Legung', body: 'Die anfängliche 3-Karten-Legung ist kostenlos und wird mit KI-Unterstützung als Vorschau erstellt. Sie soll einen ersten Einblick in die Energie Ihrer Karten geben und ist keine umfassende Legung.' },
      { heading: '3. Premium-Legung', body: 'Die kostenpflichtige 36-Karten-Ritual-Legung wird von Abigail manuell durchgeführt. Die Lieferung erfolgt innerhalb von 24 Stunden nach Zahlungsbestätigung per E-Mail.' },
      { heading: '4. Zahlung', body: 'Zahlungen werden sicher über Stripe abgewickelt. Mit dem Kauf erklären Sie sich mit den Stripe-Nutzungsbedingungen einverstanden. Alle Preise verstehen sich inklusive gesetzlicher Mehrwertsteuer.' },
      { heading: '5. Rückerstattungen', body: 'Bitte lesen Sie unsere Rückerstattungsrichtlinie. Rückerstattungen können innerhalb von 24 Stunden nach dem Kauf gewährt werden, sofern die Legung noch nicht begonnen wurde. Nach der Lieferung sind keine Rückerstattungen möglich.' },
      { heading: '6. Haftungsausschluss', body: 'Kartenlegungen dienen spirituellen und Unterhaltungszwecken. Wir geben keine Garantie für Genauigkeit oder Ergebnisse. Die Ergebnisse sind subjektiv und sollten nicht als Grundlage für wichtige Lebensentscheidungen herangezogen werden.' },
      { heading: '7. Anwendbares Recht', body: 'Diese Bedingungen unterliegen dem Recht der Europäischen Union und dem Recht des Landes, in dem der Dienstleister seinen Sitz hat.' },
      { heading: '8. Kontakt', body: 'contact@dbcdatastudio.com' },
    ],
  },
  pt: {
    title: 'Termos de Serviço',
    updated: 'Última atualização: Fevereiro de 2025',
    backLabel: '← Voltar',
    sections: [
      { heading: '1. Descrição do serviço', body: 'Abigail, o Oráculo Húngaro, oferece serviços de tiragem de cartas apenas para fins de entretenimento e orientação espiritual. As tiragens não substituem aconselhamento médico, jurídico, financeiro ou psicológico profissional. O serviço é fornecido pela DBC Data Studio (contact@dbcdatastudio.com).' },
      { heading: '2. Tiragem gratuita', body: 'A tiragem inicial de 3 cartas é fornecida gratuitamente com auxílio de IA como prévia. Destina-se a oferecer um vislumbre da energia das suas cartas, não sendo uma tiragem completa.' },
      { heading: '3. Tiragem premium', body: 'A tiragem ritual de 36 cartas paga é realizada manualmente por Abigail. A entrega ocorre em até 24 horas após a confirmação do pagamento, por e-mail.' },
      { heading: '4. Pagamento', body: 'Os pagamentos são processados com segurança pela Stripe. Ao concluir uma compra, você concorda com os termos da Stripe. Todos os preços incluem os impostos aplicáveis.' },
      { heading: '5. Reembolsos', body: 'Consulte nossa Política de Reembolso. Reembolsos podem ser concedidos em até 24 horas após a compra, desde que a tiragem não tenha sido iniciada. Após a entrega, não são concedidos reembolsos.' },
      { heading: '6. Aviso legal', body: 'As tiragens de cartas são fornecidas para fins espirituais e de entretenimento. Não garantimos precisão ou resultados. Os resultados são subjetivos e não devem ser usados como base para decisões importantes de vida.' },
      { heading: '7. Lei aplicável', body: 'Estes termos são regidos pela legislação brasileira (LGPD e CDC) e pelas leis do país de residência do prestador de serviços.' },
      { heading: '8. Contato', body: 'contact@dbcdatastudio.com' },
    ],
  },
  hu: {
    title: 'Szolgáltatási Feltételek',
    updated: 'Utoljára frissítve: 2025. február',
    backLabel: '← Vissza',
    sections: [
      { heading: '1. A szolgáltatás leírása', body: 'Abigail, a Magyar Jós kártyavetési szolgáltatásokat kizárólag szórakoztatási és spirituális útmutatási célokra nyújt. A kártyavetés nem helyettesíti a szakmai orvosi, jogi, pénzügyi vagy pszichológiai tanácsadást. A szolgáltatást a DBC Data Studio nyújtja (contact@dbcdatastudio.com).' },
      { heading: '2. Ingyenes kártyavetés', body: 'A kezdeti, ingyenesen biztosított 3 lapos kártyavetés mesterséges intelligencia segítségével készül előzetesként. Célja a kártyák energiájának első bepillantása, nem egy teljes kártyavetés.' },
      { heading: '3. Prémium kártyavetés', body: 'A fizetős 36 lapos rituálé kártyavetést Abigail manuálisan végzi el. A kézbesítés a fizetés megerősítésétől számított 24 órán belül történik, e-mailben.' },
      { heading: '4. Fizetés', body: 'A kifizetések biztonságosan, a Stripe-on keresztül történnek. A vásárlás elvégzésével Ön elfogadja a Stripe feltételeit. Minden ár tartalmazza az alkalmazandó adókat.' },
      { heading: '5. Visszatérítések', body: 'Kérjük, olvassa el visszatérítési szabályzatunkat. A visszatérítés a vásárlástól számított 24 órán belül kérhető, amennyiben a kártyavetés még nem kezdődött el. A kézbesítés után visszatérítés nem lehetséges.' },
      { heading: '6. Felelősségkizárás', body: 'A kártyavetések spirituális és szórakoztatási célokat szolgálnak. Nem garantálunk pontosságot vagy eredményeket. Az eredmények szubjektívek, és nem szabad fontos életdöntések alapjául felhasználni őket.' },
      { heading: '7. Irányadó jog', body: 'Jelen feltételekre az Európai Unió joga és a szolgáltató székhelye szerinti ország joga az irányadó.' },
      { heading: '8. Kapcsolat', body: 'contact@dbcdatastudio.com' },
    ],
  },
};

// ─── REFUND POLICY ───────────────────────────────────────────────────────────

const refund: Record<Language, LegalContent> = {
  en: {
    title: 'Refund Policy',
    updated: 'Last updated: February 2025',
    backLabel: '← Back',
    sections: [
      { heading: 'Our commitment', body: 'We want you to be fully satisfied with your reading. If something is wrong, please contact us and we will do our best to make it right.' },
      { heading: 'Refund window', body: 'You may request a full refund within 24 hours of purchase, provided your reading has not yet been started. Email contact@dbcdatastudio.com with your order details.' },
      { heading: 'After delivery', body: 'Because the premium reading is a personally performed, bespoke service, refunds are generally not available once the reading has been delivered. If you believe there was an error or you did not receive your reading, contact us and we will investigate promptly.' },
      { heading: 'Non-delivery', body: 'If you do not receive your reading within 48 hours of payment (excluding weekends and public holidays), you are entitled to a full refund. Please check your spam folder first.' },
      { heading: 'How refunds are processed', body: 'Approved refunds are returned to your original payment method within 5–10 business days, depending on your bank or card issuer.' },
      { heading: 'Contact', body: 'contact@dbcdatastudio.com — we aim to respond within 24 hours.' },
    ],
  },
  de: {
    title: 'Rückerstattungsrichtlinie',
    updated: 'Zuletzt aktualisiert: Februar 2025',
    backLabel: '← Zurück',
    sections: [
      { heading: 'Unser Versprechen', body: 'Wir möchten, dass Sie mit Ihrer Legung vollständig zufrieden sind. Wenn etwas nicht stimmt, kontaktieren Sie uns bitte und wir werden unser Bestes tun, um die Situation zu lösen.' },
      { heading: 'Rückerstattungsfrist', body: 'Sie können innerhalb von 24 Stunden nach dem Kauf eine vollständige Rückerstattung beantragen, sofern Ihre Legung noch nicht begonnen wurde. Senden Sie eine E-Mail an contact@dbcdatastudio.com mit Ihren Bestelldetails.' },
      { heading: 'Nach der Lieferung', body: 'Da es sich bei der Premium-Legung um einen persönlich durchgeführten, individuellen Service handelt, sind Rückerstattungen nach der Lieferung grundsätzlich nicht möglich. Wenn Sie der Meinung sind, dass ein Fehler vorliegt oder Sie Ihre Legung nicht erhalten haben, kontaktieren Sie uns und wir werden die Situation umgehend klären.' },
      { heading: 'Nicht-Lieferung', body: 'Wenn Sie Ihre Legung nicht innerhalb von 48 Stunden nach der Zahlung erhalten haben (Wochenenden und Feiertage ausgenommen), haben Sie Anspruch auf eine vollständige Rückerstattung. Bitte überprüfen Sie zuerst Ihren Spam-Ordner.' },
      { heading: 'Wie Rückerstattungen bearbeitet werden', body: 'Genehmigte Rückerstattungen werden innerhalb von 5–10 Werktagen auf Ihre ursprüngliche Zahlungsart zurückgebucht, abhängig von Ihrer Bank oder Ihrem Kartenherausgeber.' },
      { heading: 'Kontakt', body: 'contact@dbcdatastudio.com — wir bemühen uns, innerhalb von 24 Stunden zu antworten.' },
    ],
  },
  pt: {
    title: 'Política de Reembolso',
    updated: 'Última atualização: Fevereiro de 2025',
    backLabel: '← Voltar',
    sections: [
      { heading: 'Nosso compromisso', body: 'Queremos que você fique totalmente satisfeito(a) com sua tiragem. Se algo não estiver correto, entre em contato conosco e faremos o possível para resolver.' },
      { heading: 'Prazo para reembolso', body: 'Você pode solicitar um reembolso total em até 24 horas após a compra, desde que sua tiragem ainda não tenha sido iniciada. Envie um e-mail para contact@dbcdatastudio.com com os detalhes do seu pedido.' },
      { heading: 'Após a entrega', body: 'Como a tiragem premium é um serviço personalizado e realizado manualmente, reembolsos geralmente não estão disponíveis após a entrega. Se acreditar que houve um erro ou que não recebeu sua tiragem, entre em contato e investigaremos prontamente.' },
      { heading: 'Não entrega', body: 'Se você não receber sua tiragem em até 48 horas após o pagamento (excluindo fins de semana e feriados), tem direito a um reembolso total. Por favor, verifique a pasta de spam primeiro.' },
      { heading: 'Como os reembolsos são processados', body: 'Os reembolsos aprovados são devolvidos ao método de pagamento original em 5 a 10 dias úteis, dependendo do seu banco ou operadora de cartão.' },
      { heading: 'Contato', body: 'contact@dbcdatastudio.com — buscamos responder em até 24 horas.' },
    ],
  },
  hu: {
    title: 'Visszatérítési Szabályzat',
    updated: 'Utoljára frissítve: 2025. február',
    backLabel: '← Vissza',
    sections: [
      { heading: 'Elkötelezettségünk', body: 'Azt szeretnénk, ha teljesen elégedett lenne a kártyavetésével. Ha valami nem megfelelő, kérjük, lépjen kapcsolatba velünk, és mindent megteszünk a helyzet megoldása érdekében.' },
      { heading: 'Visszatérítési időszak', body: 'A vásárlástól számított 24 órán belül teljes visszatérítést kérhet, feltéve, hogy a kártyavetés még nem kezdődött el. Küldjön e-mailt a contact@dbcdatastudio.com címre a rendelési adataival.' },
      { heading: 'Kézbesítés után', body: 'Mivel a prémium kártyavetés személyesen elvégzett, egyedi szolgáltatás, a kézbesítés után általában nem lehetséges visszatérítés. Ha úgy véli, hogy hiba történt, vagy nem kapta meg a kártyavetését, lépjen kapcsolatba velünk, és haladéktalanul kivizsgáljuk az ügyet.' },
      { heading: 'Nem kézbesítés', body: 'Ha a fizetéstől számított 48 órán belül nem kapja meg a kártyavetését (hétvégéket és munkaszüneti napokat kivéve), teljes visszatérítésre jogosult. Kérjük, előbb ellenőrizze a spam mappáját.' },
      { heading: 'A visszatérítés folyamata', body: 'A jóváhagyott visszatérítések 5–10 munkanapon belül kerülnek visszautalásra az eredeti fizetési módra, a bank vagy a kártyakibocsátó függvényében.' },
      { heading: 'Kapcsolat', body: 'contact@dbcdatastudio.com — igyekszünk 24 órán belül válaszolni.' },
    ],
  },
};

// ─── SHARED RENDERER ─────────────────────────────────────────────────────────

const allContent: Record<LegalType, Record<Language, LegalContent>> = { privacy, terms, refund };

interface LegalPageProps {
  language: Language;
  type: LegalType;
}

export default function LegalPage({ language, type }: LegalPageProps) {
  const content = allContent[type][language];
  const backPath = `/${language}`;

  return (
    <main className="min-h-screen bg-charcoal text-bone-white py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <a href={backPath} className="text-purple-main text-sm hover:underline">
          {content.backLabel}
        </a>
        <h1 className="font-serif text-3xl font-bold mt-6 mb-2">{content.title}</h1>
        <p className="text-sm text-bone-white/50 mb-10">{content.updated}</p>

        <section className="space-y-8 text-bone-white/80 leading-relaxed">
          {content.sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-lg font-semibold text-bone-white mb-2">{section.heading}</h2>
              {Array.isArray(section.body) ? (
                <ul className="list-disc list-inside space-y-1">
                  {section.body.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>{section.body}</p>
              )}
            </div>
          ))}
        </section>

        <div className="mt-12 pt-8 border-t border-bone-white/10 text-xs text-bone-white/30 flex flex-wrap gap-4">
          {type !== 'privacy' && (
            <Link href={`/${language}/privacy`} className="hover:text-bone-white/60 transition-colors">
              {allContent.privacy[language].title}
            </Link>
          )}
          {type !== 'terms' && (
            <Link href={`/${language}/terms`} className="hover:text-bone-white/60 transition-colors">
              {allContent.terms[language].title}
            </Link>
          )}
          {type !== 'refund' && (
            <Link href={`/${language}/refund`} className="hover:text-bone-white/60 transition-colors">
              {allContent.refund[language].title}
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
