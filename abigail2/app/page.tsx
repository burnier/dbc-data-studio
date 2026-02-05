'use client';

/**
 * Abigail Arts & Oracles v2 - Single Page Conversion Funnel
 * 
 * Serverless Monolith Architecture
 * All logic in Next.js 15 with Server Actions
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { submitRitual, selectCards, getScarcity } from '@/lib/actions';
import { CARDS, getCardImageName, getCard } from '@/lib/cards';

interface FormData {
  name: string;
  email: string;
  question: string;
  language: string;
}

// Social proof messages
const seekerMessages = [
  "A seeker from Vienna just found clarity...",
  "Someone from Berlin discovered their path...",
  "A seeker from Budapest received guidance...",
  "Someone from São Paulo found answers...",
  "A seeker from Munich unlocked their destiny...",
];

export default function HomePage() {
  const [step, setStep] = useState<'form' | 'shuffling' | 'cards' | 'result' | 'complete'>('form');
  const [submissionId, setSubmissionId] = useState<number | null>(null);
  const [selectedCardIds, setSelectedCardIds] = useState<number[]>([]);
  const [availableCardIds, setAvailableCardIds] = useState<number[]>([]);
  const [previewText, setPreviewText] = useState<string>('');
  const [cardNames, setCardNames] = useState<string[]>([]);
  const [scarcity, setScarcity] = useState<{ availableToday: number; totalLimit: number } | null>(null);
  const [shufflingProgress, setShufflingProgress] = useState(0);
  const [language, setLanguage] = useState<string>('en');
  const [currentTickerMessage, setCurrentTickerMessage] = useState(0);
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<FormData>({
    defaultValues: { language: 'en' }
  });

  // Fetch scarcity counter on mount and update periodically
  useEffect(() => {
    const fetchScarcity = async () => {
      try {
        const result = await getScarcity();
        setScarcity(result);
      } catch (error) {
        console.error('Failed to fetch scarcity:', error);
      }
    };
    
    fetchScarcity();
    const interval = setInterval(fetchScarcity, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Social proof ticker rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTickerMessage((prev) => (prev + 1) % seekerMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Shuffling animation
  useEffect(() => {
    if (step === 'shuffling') {
      const duration = 5000; // 5 seconds
      const interval = 100;
      const steps = duration / interval;
      let current = 0;
      
      const timer = setInterval(() => {
        current++;
        setShufflingProgress((current / steps) * 100);
        if (current >= steps) {
          clearInterval(timer);
          setStep('cards');
        }
      }, interval);
      
      return () => clearInterval(timer);
    }
  }, [step]);

  const onSubmit = async (data: FormData) => {
    try {
      setLanguage(data.language);
      const result = await submitRitual(data.name, data.email, data.question, data.language);
      
      setSubmissionId(result.submissionId);
      setAvailableCardIds(result.cardIds);
      setStep('shuffling');
    } catch (error) {
      console.error('Failed to submit ritual:', error);
      alert('Failed to start the ritual. Please try again.');
    }
  };

  const handleCardClick = async (cardId: number) => {
    if (!submissionId || selectedCardIds.length >= 3 || selectedCardIds.includes(cardId)) return;
    
    const newSelection = [...selectedCardIds, cardId];
    setSelectedCardIds(newSelection);
    
    if (newSelection.length === 3) {
      // All cards selected, get preview and reading
      try {
        const result = await selectCards(submissionId, newSelection);
        
        setPreviewText(result.previewText);
        setCardNames(result.cardNames);
        setStep('result');
      } catch (error) {
        console.error('Failed to get reading:', error);
        alert('Failed to generate reading. Please try again.');
      }
    }
  };

  const getCardMeaning = (cardId: number): string => {
    const card = getCard(cardId);
    if (!card) return '';
    return card.shortMeaning[language as keyof typeof card.shortMeaning] || card.shortMeaning.en;
  };

  return (
    <div className="min-h-screen bg-charcoal relative">
      {/* Scarcity Counter - Top Right */}
      {scarcity && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-gray-900/80 backdrop-blur-sm border border-purple-dark/50 rounded-lg">
          <div className="w-3 h-3 bg-green-500 rounded-full scarcity-dot"></div>
          <span className="text-sm">
            Abigail is in the studio. <span className="font-semibold text-purple-dark">{scarcity.availableToday}/{scarcity.totalLimit}</span> slots remaining today.
          </span>
        </div>
      )}

      {/* Language Toggle - Top Left */}
      <div className="fixed top-4 left-4 z-50">
        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            setValue('language', e.target.value);
          }}
          className="px-3 py-2 bg-gray-900/80 backdrop-blur-sm border border-bone-white/20 rounded-lg text-bone-white text-sm focus:outline-none focus:border-purple-dark"
        >
          <option value="en">🇺🇸 English</option>
          <option value="de">🇩🇪 Deutsch</option>
          <option value="pt">🇧🇷 Português</option>
          <option value="hu">🇭🇺 Magyar</option>
        </select>
      </div>

      {/* Section 1: The Hook (Hero) */}
      <section className="container mx-auto px-4 py-20 text-center min-h-screen flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <Image
              src="/abigail_logo2.png"
              alt="Abigail Arts & Oracles"
              width={250}
              height={250}
              className="mx-auto"
              priority
            />
          </div>
          <h1 className="text-6xl md:text-8xl font-serif mb-4 bg-purple-gradient bg-clip-text text-transparent">
            Abigail
          </h1>
          <p className="text-2xl md:text-3xl mb-2">Arts & Oracles</p>
          <p className="text-lg opacity-80">Discover Your Path Through the Cards</p>
        </motion.div>
      </section>

      {/* Section 2: The Ritual */}
      <section className="container mx-auto px-4 py-12 min-h-screen flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {step === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-md mx-auto w-full"
            >
              <h2 className="text-4xl font-serif text-center mb-8">The Ritual</h2>
              <p className="text-center mb-6 opacity-80">What does your heart seek to know?</p>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 bg-gray-900 border border-bone-white/20 rounded-lg text-bone-white placeholder-gray-500 focus:outline-none focus:border-purple-dark"
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
                </div>
                
                <div>
                  <input
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 bg-gray-900 border border-bone-white/20 rounded-lg text-bone-white placeholder-gray-500 focus:outline-none focus:border-purple-dark"
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
                </div>
                
                <div>
                  <textarea
                    {...register('question', { required: 'Question is required' })}
                    placeholder="Ask your question to the Oracle..."
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-900 border border-bone-white/20 rounded-lg text-bone-white placeholder-gray-500 focus:outline-none focus:border-purple-dark resize-none"
                  />
                  {errors.question && <p className="text-red-400 text-sm mt-1">{errors.question.message}</p>}
                </div>
                
                <input type="hidden" {...register('language')} value={language} />
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-purple-gradient text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? 'Consulting the Oracle...' : 'Consult Abigail'}
                </button>
              </form>
            </motion.div>
          )}

          {step === 'shuffling' && (
            <motion.div
              key="shuffling"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto text-center"
            >
              <h2 className="text-4xl font-serif mb-8">The Cards Are Shuffling</h2>
              <div className="relative">
                <Image
                  src="/back5.png"
                  alt="Shuffling cards"
                  width={700}
                  height={500}
                  className="mx-auto shuffling"
                  priority
                />
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-purple-gradient"
                    initial={{ width: 0 }}
                    animate={{ width: `${shufflingProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              </div>
              <p className="mt-6 text-lg opacity-80">The cards are revealing your destiny...</p>
            </motion.div>
          )}

          {step === 'cards' && submissionId && (
            <motion.div
              key="cards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-4xl font-serif text-center mb-8">Click to Pull Your Cards</h2>
              <p className="text-center mb-8 opacity-80">Select 3 cards to reveal your reading</p>
              
              <div className="grid grid-cols-6 md:grid-cols-9 gap-4">
                {Array.from({ length: 36 }).map((_, index) => {
                  const isSelected = selectedCardIds.includes(index);
                  const isAvailable = availableCardIds.includes(index);
                  const isClickable = selectedCardIds.length < 3 && isAvailable && !isSelected;
                  
                  return (
                    <motion.button
                      key={index}
                      onClick={() => isClickable && handleCardClick(index)}
                      disabled={!isClickable}
                      className={`aspect-[2/3] rounded-lg overflow-hidden border-2 transition-all ${
                        isSelected
                          ? 'border-purple-dark scale-110 z-10'
                          : isClickable
                          ? 'border-bone-white/20 hover:border-purple-dark cursor-pointer'
                          : 'border-gray-800 opacity-30 cursor-not-allowed'
                      }`}
                      whileHover={isClickable ? { scale: 1.05 } : {}}
                      whileTap={isClickable ? { scale: 0.95 } : {}}
                    >
                      {isSelected ? (
                        <Image
                          src={`/cards/${getCardImageName(index)}.jpg`}
                          alt={`Card ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Image
                          src="/back5.png"
                          alt="Card back"
                          fill
                          className="object-cover"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
              
              <p className="text-center mt-6 text-sm opacity-60">
                Selected: {selectedCardIds.length} / 3
              </p>
            </motion.div>
          )}

          {step === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-4xl font-serif text-center mb-8">Your Reading</h2>
              
              {/* Preview Text */}
              <div className="bg-gray-900/50 border border-purple-dark/50 rounded-lg p-8 mb-8">
                <p className="text-lg leading-relaxed">{previewText}</p>
              </div>

              {/* Cards with Meanings */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {selectedCardIds.map((cardId, index) => {
                  const card = getCard(cardId);
                  if (!card) return null;
                  
                  return (
                    <div key={cardId} className="bg-gray-900/50 border border-bone-white/20 rounded-lg p-4">
                      <div className="relative aspect-[2/3] mb-4 rounded overflow-hidden">
                        <Image
                          src={`/cards/${getCardImageName(cardId)}.jpg`}
                          alt={card.nameKey}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="font-semibold mb-2 capitalize">{card.nameKey}</h3>
                      <p className="text-sm opacity-80 leading-relaxed">{getCardMeaning(cardId)}</p>
                    </div>
                  );
                })}
              </div>

              <div className="text-center">
                <p className="text-sm opacity-60 mb-6">
                  ✉️ Your complete reading has been sent to your email.
                </p>
                <button
                  onClick={() => setStep('complete')}
                  className="px-6 py-3 bg-purple-gradient text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Section 3: The Human Proof (Bio) */}
      <section className="container mx-auto px-4 py-20 min-h-screen flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl font-serif text-center mb-12">About Abigail</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
              <Image
                src="/abigail_logo.png"
                alt="Abigail"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-4 text-lg leading-relaxed">
              <p>
                Abigail is a certified oracle card reader with over 15 years of experience
                in the ancient art of Gypsy card reading. Her practice combines traditional
                methods with intuitive interpretation.
              </p>
              <p>
                Trained in the classical European tradition, Abigail has helped thousands
                of seekers find clarity and guidance through her readings.
              </p>
              <p className="font-semibold text-purple-dark">
                Certified by the International Oracle Card Readers Association
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Section 4: The Bridge (Upsell) */}
      <section className="container mx-auto px-4 py-20 min-h-screen flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-serif mb-12">Unlock the Full Reading</h2>
          
          {/* Human vs Machine Comparison */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Digital Drawing</h3>
              <div className="aspect-video bg-gray-800 rounded flex items-center justify-center mb-4">
                <span className="text-gray-500">Digital Preview</span>
              </div>
              <p className="text-sm opacity-70">What you see now</p>
            </div>
            
            <div className="bg-purple-gradient/20 border-2 border-purple-dark rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Real Physical Spread</h3>
              <div className="aspect-video bg-gray-800 rounded flex items-center justify-center mb-4 relative overflow-hidden">
                <span className="text-gray-500">Physical Card Photo</span>
                {/* Placeholder for real photo - to be replaced with actual image */}
              </div>
              <p className="text-sm font-semibold">Hand-crafted by Abigail</p>
            </div>
          </div>

          {/* Physical Evidence Gallery */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Real Physical Spreads</h3>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-video bg-gray-800 rounded overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-gray-900/50 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Physical Spread {i}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm opacity-60 mt-2">Blurred for privacy - real spreads from Abigail's studio</p>
          </div>

          <div className="space-y-4">
            <ul className="text-left max-w-md mx-auto space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-purple-dark">✓</span>
                Deep-dive response from Abigail with professional, hand-written analysis
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-dark">✓</span>
                High-quality photo of your unique physical card spread
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-dark">✓</span>
                24/7 spiritual clarity and ongoing support
              </li>
            </ul>
            
            <button className="mt-8 px-8 py-4 bg-purple-gradient text-white rounded-lg text-xl font-semibold hover:opacity-90 transition-opacity">
              Request Full Reading (€19.90)
            </button>
            
            <p className="text-sm opacity-60 mt-4">
              100% satisfaction guarantee or your money back
            </p>
          </div>
        </motion.div>
      </section>

      {/* Social Proof Ticker */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-t border-bone-white/10 py-2 overflow-hidden">
        <div className="ticker whitespace-nowrap">
          <span className="text-sm opacity-80 mr-8">
            {seekerMessages[currentTickerMessage]}
          </span>
        </div>
      </div>
    </div>
  );
}

