import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const CTASection = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();

    return (
        <section className="py-16 md:py-20 bg-white relative overflow-hidden border-t border-gray-100">
            {/* Efek Cahaya / Glow Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FFB22C]/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#FFB22C]/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 text-center relative z-10">
                <h2 className="font-display text-4xl md:text-5xl font-bold text-[#0F0F0F] mb-6 tracking-tight">
                    {language === 'id' ? 'Siap Mengubah Dunia?' : 'Ready to Change the World?'}
                </h2>
                
                <p className="font-body text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                    {language === 'id'
                        ? 'Bergabunglah dengan ribuan inovator dari seluruh dunia dan tunjukkan solusi bisnis berkelanjutan Anda.'
                        : 'Join thousands of innovators from around the world and showcase your sustainable business solution.'}
                </p>
                
                <button
                    onClick={() => navigate('/cibc/register')}
                    className="group px-10 py-4 md:px-12 md:py-5 bg-[#FFB22C] text-white font-body font-bold text-sm md:text-base uppercase tracking-wider rounded-full inline-flex items-center gap-3 hover:bg-[#FFA000] transition-all duration-300 hover:shadow-xl hover:shadow-[#FFB22C]/30 hover:-translate-y-1"
                >
                    {language === 'id' ? 'Daftar Sekarang' : 'Register Now'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="mt-8 font-body text-sm text-gray-500">
                    {language === 'id' ? 'Sudah punya akun?' : 'Already have an account?'}{' '}
                    <Link to="/cibc/login" className="text-[#FFB22C] font-bold hover:text-[#FFA000] hover:underline transition-colors">
                        {language === 'id' ? 'Masuk' : 'Sign In'}
                    </Link>
                </p>
            </div>
        </section>
    );
};