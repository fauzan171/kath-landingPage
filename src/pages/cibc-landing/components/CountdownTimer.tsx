import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCountdownDeadline } from '@/hooks/useCountdownDeadline';

interface CountdownTimerProps {
    targetDate?: string | null;
}

/**
 * Countdown timer component for CIBC landing page.
 * Uses the shared useCountdownDeadline hook which has real-time
 * Supabase subscription - admin changes are reflected immediately.
 *
 * If `targetDate` prop is provided, it overrides the Supabase deadline
 * and computes countdown locally with interval.
 */
export const CountdownTimer = ({ targetDate: propTargetDate }: CountdownTimerProps) => {
    const { language } = useLanguage();
    const { timeLeft: fetchedTimeLeft } = useCountdownDeadline();

    const [localTimeLeft, setLocalTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    // When propTargetDate is provided, compute countdown locally with interval
    // Otherwise use the real-time fetched timeLeft from the hook
    useEffect(() => {
        if (!propTargetDate) return;

        const target = new Date(propTargetDate);

        const calculateTimeLeft = () => {
            const now = new Date();
            const diff = target.getTime() - now.getTime();

            if (diff > 0) {
                setLocalTimeLeft({
                    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((diff / 1000 / 60) % 60),
                    seconds: Math.floor((diff / 1000) % 60),
                });
            } else {
                setLocalTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [propTargetDate]);

    // Use prop override or the real-time fetched timeLeft
    const timeLeft = propTargetDate ? localTimeLeft : fetchedTimeLeft;

    const timeBlocks = [
        { label: language === 'id' ? 'Hari' : 'Days', value: timeLeft.days },
        { label: language === 'id' ? 'Jam' : 'Hours', value: timeLeft.hours },
        { label: language === 'id' ? 'Menit' : 'Mins', value: timeLeft.minutes },
        { label: language === 'id' ? 'Detik' : 'Secs', value: timeLeft.seconds },
    ];

    return (
        <div className="flex items-center justify-center gap-3 md:gap-6 w-full">
            {timeBlocks.map((block, index) => (
                <div 
                    key={index} 
                    className="relative flex flex-col items-center justify-center w-20 h-24 md:w-28 md:h-32 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] overflow-hidden group hover:bg-white/[0.08] transition-colors duration-500"
                >
                    {/* Efek kilauan halus di atas kotak */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    
                    <span className="font-display text-3xl md:text-5xl font-light text-white tracking-tight mb-1">
                        {String(block.value).padStart(2, '0')}
                    </span>
                    <span className="font-body text-[9px] md:text-xs text-white/50 uppercase tracking-[0.2em] font-medium">
                        {block.label}
                    </span>
                </div>
            ))}
        </div>
    );
};
