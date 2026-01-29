# Abigail Arts & Oracles - V1 Prototype

A mystical card reading landing page built with Next.js, featuring a dark whimsical theme and multi-language support.

## Features

- **Dark Whimsical Theme**: Charcoal backgrounds (#121212) with bone-white text
- **Multi-language Support**: English, German, Portuguese, and Hungarian
- **Interactive 3-Card Draw**: 36 face-down cards with flip animations
- **Lead Magnet Form**: React Hook Form with validation
- **AI Reading Logic**: Placeholder for future LLM integration (currently concatenates card meanings)
- **Premium Conversion**: Deep-Dive CTA section

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- i18next for internationalization
- React Hook Form

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
website/
├── app/
│   ├── layout.tsx          # Root layout with fonts and i18n provider
│   ├── page.tsx            # Main landing page
│   └── globals.css         # Dark whimsical theme styles
├── components/
│   ├── CardDraw.tsx        # Interactive 36-card draw component
│   ├── LeadMagnetForm.tsx  # Contact form with language selector
│   ├── ReadingResult.tsx  # Displays the reading results
│   ├── PremiumConversion.tsx # Premium CTA section
│   └── I18nProvider.tsx   # i18next provider wrapper
├── constants/
│   └── cardMeanings.ts     # All 36 card definitions with translations
├── lib/
│   ├── i18n.ts            # i18next configuration
│   └── generateReading.ts # AI reading generation (placeholder)
└── locales/
    ├── en.json            # English translations
    ├── de.json            # German translations
    ├── pt.json            # Portuguese translations
    └── hu.json            # Hungarian translations
```

## Workflow

1. User fills out the lead magnet form (Name, Email, Question, Language)
2. User selects 3 cards from the 36-card deck
3. Shuffling animation plays
4. AI reading is generated (currently concatenates card meanings)
5. Reading result is displayed
6. Premium conversion section appears below

## Next Steps (Future Enhancements)

- Integrate LLM API for more sophisticated readings
- Add actual card images from reference material
- Connect form submission to backend/email service
- Add Stripe checkout for Deep-Dive premium service
- Enhance animations and transitions
- Add more card meanings from reference material

## Reference Material

All original content and translations are located in `/abigail/ref_material/`
