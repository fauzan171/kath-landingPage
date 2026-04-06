import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Twitter } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { COMPETITION_DATA } from '../data/cibcData';

export const Footer = () => {
    const { language } = useLanguage();

    return (
        <footer className="py-10 bg-[#F9F8F6] border-t border-gray-200">
            <div className="container mx-auto px-6 max-w-7xl">
                
                {/* Logo & Social Icons Row */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
                    
                    {/* Brand Info - Ukuran yang Lebih Proporsional */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2.5 max-w-[280px]">
                        {/* 1. Logo Utama (Ukuran Dikecilkan Sedikit) */}
                        <div className="w-full flex justify-center md:justify-start relative">
                            <img
                                src="/CIBC-logo-white.png"
                                alt="CIBC Power Logo"
                                // h-16 md:h-20 diturunkan ke h-12 md:h-14 agar lebih compact
                                className="h-12 md:h-14 w-auto object-contain transition-all duration-300 transform-gpu"
                                style={{
                                    filter: 'brightness(0)',
                                    opacity: 0.8
                                }}
                            />
                        </div>
                        
                        {/* 2. Teks 'KATH' (Ukuran Dibuat Lebih Kecil) */}
                        {/* <p className="font-body text-[10px] md:text-xs text-gray-500 font-medium leading-relaxed tracking-wider">
                            by KATH Event Organizer
                        </p> */}
                    </div>

                    {/* Social Media Links */}
                    <div className="flex items-center gap-3">
                        {[
                            { icon: Instagram, href: `https://instagram.com/${COMPETITION_DATA.contact.instagram.replace('@', '')}` },
                            { icon: Linkedin, href: `https://linkedin.com/company/${COMPETITION_DATA.contact.linkedin.toLowerCase().replace(' ', '-')}` },
                            { icon: Twitter, href: `https://twitter.com/${COMPETITION_DATA.contact.twitter.replace('@', '')}` },
                        ].map((social, index) => (
                            <a
                                key={index}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#FFB22C] hover:border-[#FFB22C]/50 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <social.icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Divider Line */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6" />

                {/* Copyright & Legal Links */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                    <p className="font-body text-xs text-gray-500 font-medium">
                        © 2026 CIBC Power by KATH Event Organizer. {language === 'id' ? 'Hak cipta dilindungi.' : 'All rights reserved.'}
                    </p>
                    
                    <div className="flex items-center gap-5">
                        <Link to="/cibc/terms" className="font-body text-xs text-gray-500 font-medium hover:text-[#FFB22C] transition-colors">
                            {language === 'id' ? 'Syarat & Ketentuan' : 'Terms & Conditions'}
                        </Link>
                        <span className="text-gray-300 text-xs">•</span>
                        <Link to="/cibc/leaderboard" className="font-body text-xs text-gray-500 font-medium hover:text-[#FFB22C] transition-colors">
                            {language === 'id' ? 'Papan Peringkat' : 'Leaderboard'}
                        </Link>
                    </div>
                </div>

            </div>
        </footer>
    );
};