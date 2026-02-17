'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
  language: 'en' | 'de' | 'pt' | 'hu';
}

export function CountdownTimer({ targetDate, language }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    expired: boolean;
  }>({ hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds, expired: false });
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const labels = {
    en: { hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds', expired: 'Offer Expired' },
    de: { hours: 'Stunden', minutes: 'Minuten', seconds: 'Sekunden', expired: 'Angebot abgelaufen' },
    pt: { hours: 'Horas', minutes: 'Minutos', seconds: 'Segundos', expired: 'Oferta Expirada' },
    hu: { hours: 'Óra', minutes: 'Perc', seconds: 'Másodperc', expired: 'Ajánlat lejárt' },
  };

  const t = labels[language];

  if (timeLeft.expired) {
    return (
      <div className="text-red-400 font-bold text-lg">
        ⏰ {t.expired}
      </div>
    );
  }

  return (
    <div className="flex gap-4 justify-center items-center">
      {/* Hours */}
      <div className="flex flex-col items-center">
        <div className="bg-purple-dark/50 border-2 border-purple-main rounded-lg p-3 min-w-[70px]">
          <div className="text-3xl md:text-4xl font-bold text-purple-light tabular-nums">
            {timeLeft.hours.toString().padStart(2, '0')}
          </div>
        </div>
        <div className="text-xs text-bone-white/60 mt-1 uppercase tracking-wide">{t.hours}</div>
      </div>

      <div className="text-2xl text-purple-light font-bold">:</div>

      {/* Minutes */}
      <div className="flex flex-col items-center">
        <div className="bg-purple-dark/50 border-2 border-purple-main rounded-lg p-3 min-w-[70px]">
          <div className="text-3xl md:text-4xl font-bold text-purple-light tabular-nums">
            {timeLeft.minutes.toString().padStart(2, '0')}
          </div>
        </div>
        <div className="text-xs text-bone-white/60 mt-1 uppercase tracking-wide">{t.minutes}</div>
      </div>

      <div className="text-2xl text-purple-light font-bold">:</div>

      {/* Seconds */}
      <div className="flex flex-col items-center">
        <div className="bg-purple-dark/50 border-2 border-purple-main rounded-lg p-3 min-w-[70px]">
          <div className="text-3xl md:text-4xl font-bold text-purple-light tabular-nums">
            {timeLeft.seconds.toString().padStart(2, '0')}
          </div>
        </div>
        <div className="text-xs text-bone-white/60 mt-1 uppercase tracking-wide">{t.seconds}</div>
      </div>
    </div>
  );
}

