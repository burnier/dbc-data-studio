'use client';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  question: string;
  language: string;
}

interface LeadMagnetFormProps {
  onSubmit: (data: FormData) => void;
  isSubmitting?: boolean;
}

export default function LeadMagnetForm({ onSubmit, isSubmitting = false }: LeadMagnetFormProps) {
  const { t, i18n } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      language: i18n.language || 'en',
    },
  });

  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

  const handleLanguageChange = (lang: string) => {
    setCurrentLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const onFormSubmit = (data: FormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="w-full max-w-2xl mx-auto space-y-6">
      {/* Language Selector */}
      <div className="flex justify-center gap-4 mb-6">
        {(['en', 'de', 'pt', 'hu'] as const).map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => handleLanguageChange(lang)}
            className={`
              px-4 py-2 rounded-lg border transition-all
              ${currentLanguage === lang
                ? 'bg-bone-white/20 border-bone-white text-bone-white'
                : 'border-bone-white/30 text-bone-white/60 hover:border-bone-white/50'
              }
            `}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          {t('form.name')}
        </label>
        <input
          {...register('name', { required: true })}
          type="text"
          id="name"
          className="w-full px-4 py-3 bg-gray-900/50 border border-bone-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-bone-white/50 text-bone-white"
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-400">This field is required</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          {t('form.email')}
        </label>
        <input
          {...register('email', { 
            required: true,
            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
          })}
          type="email"
          id="email"
          className="w-full px-4 py-3 bg-gray-900/50 border border-bone-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-bone-white/50 text-bone-white"
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-400">
            {errors.email.type === 'required' ? 'This field is required' : 'Invalid email address'}
          </p>
        )}
      </div>

      {/* Question Field */}
      <div>
        <label htmlFor="question" className="block text-sm font-medium mb-2">
          {t('form.question')}
        </label>
        <textarea
          {...register('question', { required: true })}
          id="question"
          rows={4}
          placeholder={t('form.questionPlaceholder')}
          className="w-full px-4 py-3 bg-gray-900/50 border border-bone-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-bone-white/50 text-bone-white resize-none"
          disabled={isSubmitting}
        />
        {errors.question && (
          <p className="mt-1 text-sm text-red-400">This field is required</p>
        )}
      </div>

      {/* Hidden Language Field */}
      <input
        {...register('language')}
        type="hidden"
        value={currentLanguage}
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`
          w-full py-4 px-6 rounded-lg font-medium text-lg transition-all
          ${isSubmitting
            ? 'bg-gray-700 cursor-not-allowed opacity-50'
            : 'bg-amber-900/30 hover:bg-amber-800/40 border border-amber-500/30 hover:border-amber-500/50'
          }
        `}
      >
        {isSubmitting ? t('form.submitting') : t('form.submit')}
      </button>
    </form>
  );
}

