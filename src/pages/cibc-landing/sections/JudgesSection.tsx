/**
 * Judges Section - Judge/Panel Profile Section
 * Displays judge profiles for credibility
 */

import { useLanguage } from '@/contexts/LanguageContext';
import { COMPETITION_DATA } from '../data/cibcData';
import { Award, User } from 'lucide-react';
import { useState } from 'react';

// Avatar component with error fallback
const JudgeAvatar = ({ src, name }: { src: string; name: string }) => {
    const [imgError, setImgError] = useState(false);

    if (imgError || !src) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-amber-50">
                <User className="w-10 h-10 text-amber-400" />
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgError(true)}
        />
    );
};

export const JudgesSection = () => {
    const { language } = useLanguage();
    const judges = COMPETITION_DATA.judges;

    if (!judges || judges.length === 0) return null;

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Section Header */}
                <div className="text-center mb-12 md:mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-200 rounded-full mb-4">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
                            {language === 'id' ? 'Panel Juri' : 'Judging Panel'}
                        </span>
                    </div>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        {language === 'id' ? 'Juri Ahli Kami' : 'Our Expert Judges'}
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base">
                        {language === 'id'
                            ? 'Dinilai oleh para ahli industri dan akademisi terkemuka yang berpengalaman dalam bisnis dan inovasi.'
                            : 'Evaluated by leading industry experts and academics with extensive experience in business and innovation.'
                        }
                    </p>
                </div>

                {/* Judges Grid */}
                <div className="flex flex-col gap-4 md:gap-6">
                    {judges.map((judge, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-2xl border border-gray-100 p-4 md:p-6 flex items-center gap-4 md:gap-6 hover:shadow-xl hover:border-amber-200 transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Avatar - Left */}
                            <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-amber-300 transition-colors duration-300 bg-gray-100">
                                <JudgeAvatar src={judge.avatar} name={judge.name} />
                            </div>

                            {/* Info - Right */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 text-base md:text-lg mb-0.5">{judge.name}</h3>
                                <p className="text-amber-600 text-xs md:text-sm font-medium mb-0.5">
                                    {judge.title[language]}
                                </p>
                                <p className="text-gray-400 text-[11px] md:text-xs mb-2">{judge.institution}</p>

                                {/* Expertise Tags */}
                                <div className="flex flex-wrap gap-1.5">
                                    {judge.expertise[language].split(', ').map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] rounded-full border border-gray-100"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Note */}
                <p className="text-center text-xs text-gray-400 mt-8">
                    {language === 'id'
                        ? '* Panel juri dapat berubah. Juri tambahan akan diumumkan sebelum kompetisi dimulai.'
                        : '* Judging panel is subject to change. Additional judges will be announced before the competition begins.'
                    }
                </p>
            </div>
        </section>
    );
};
