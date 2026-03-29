import { Calendar } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

const ResourcesSection = () => {
    const { language } = useLanguage();

    return (
        <div className="space-y-6">
            <div className="bg-white border border-[#0F0F0F]/5 rounded-3xl p-6 lg:p-8 shadow-sm">
                <h3 className="font-display font-bold text-xl text-[#0F0F0F] mb-6">
                    {language === 'id' ? 'Panduan & Template' : 'Guides & Templates'}
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                    {[
                        { title: 'BMC Template', desc: language === 'id' ? 'Template Business Model Canvas' : 'Business Model Canvas Template' },
                        { title: 'Pitch Deck Guide', desc: language === 'id' ? 'Panduan membuat pitch deck' : 'Pitch deck creation guide' },
                        { title: 'Judging Criteria', desc: language === 'id' ? 'Kriteria penilaian kompetisi' : 'Competition judging criteria' },
                        { title: 'SDG Guidelines', desc: language === 'id' ? 'Panduan keselarasan SDG' : 'SDG alignment guidelines' },
                    ].map((resource, index) => (
                        <div key={index} className="p-5 bg-[#F9F8F6] rounded-2xl border border-transparent hover:border-[#0F0F0F]/10 hover:shadow-sm transition-all cursor-pointer group">
                            <h4 className="font-body font-bold text-[#0F0F0F] mb-1 group-hover:text-[#FFB22C] transition-colors">{resource.title}</h4>
                            <p className="font-body text-sm font-medium text-[#0F0F0F]/60">{resource.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Workshop Schedule */}
            <div className="bg-white border border-[#0F0F0F]/5 rounded-3xl p-6 lg:p-8 shadow-sm">
                <h3 className="font-display font-bold text-xl text-[#0F0F0F] mb-6">
                    {language === 'id' ? 'Jadwal Workshop' : 'Workshop Schedule'}
                </h3>

                <div className="space-y-4">
                    {[
                        { title: 'BMC Fundamentals', date: '15 Jan 2026', time: '14:00 WIB' },
                        { title: 'Pitch Perfect', date: '22 Jan 2026', time: '14:00 WIB' },
                        { title: 'Sustainability in Business', date: '29 Jan 2026', time: '14:00 WIB' },
                    ].map((workshop, index) => (
                        <div key={index} className="flex items-center justify-between p-5 bg-[#F9F8F6] rounded-2xl border border-[#0F0F0F]/5 transition-colors hover:border-[#0F0F0F]/10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm border border-[#0F0F0F]/5">
                                    <Calendar className="w-5 h-5 text-[#FFB22C]" />
                                </div>
                                <div>
                                    <p className="font-body font-bold text-[#0F0F0F]">{workshop.title}</p>
                                    <p className="font-body text-xs font-semibold text-[#0F0F0F]/50 mt-0.5">{workshop.date} • {workshop.time}</p>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-[#FFB22C]/10 text-[#FFB22C] font-body font-bold text-sm rounded-xl hover:bg-[#FFB22C] hover:text-white transition-all">
                                {language === 'id' ? 'Daftar' : 'Register'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResourcesSection;