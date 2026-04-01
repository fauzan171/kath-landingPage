import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const CountdownTimer = () => {
    const { language } = useLanguage();

    // Set target date (Demo purposes)
    const [timeLeft, setTimeLeft] = useState({
        days: 30,
        hours: 12,
        minutes: 45,
        seconds: 0
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

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