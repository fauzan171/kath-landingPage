import { FileText, Download, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface ResourcesSectionProps {
  competition: any;
}

const ResourcesSection = ({ competition }: ResourcesSectionProps) => {
  const { language } = useLanguage();

  // Guide documents - only guides, no workshop schedule
  const guides = [
    {
      id: 'guide-1',
      title: language === 'id' ? 'Panduan Kompetisi CIBC 2026' : 'CIBC 2026 Competition Guide',
      description: language === 'id'
        ? 'Panduan lengkap mengikuti kompetisi termasuk aturan dan ketentuan'
        : 'Complete guide for participating in the competition including rules and regulations',
      type: 'PDF',
      icon: FileText,
    },
    {
      id: 'guide-2',
      title: language === 'id' ? 'Template Business Model Canvas' : 'Business Model Canvas Template',
      description: language === 'id'
        ? 'Template BMC yang dapat digunakan untuk submission'
        : 'BMC template that can be used for submission',
      type: 'PDF',
      icon: FileText,
    },
    {
      id: 'guide-3',
      title: language === 'id' ? 'Kriteria Penilaian' : 'Judging Criteria',
      description: language === 'id'
        ? 'Detail kriteria penilaian yang digunakan oleh juri'
        : 'Detailed judging criteria used by the judges',
      type: 'PDF',
      icon: FileText,
    },
    {
      id: 'guide-4',
      title: language === 'id' ? 'Panduan SDG Alignment' : 'SDG Alignment Guide',
      description: language === 'id'
        ? 'Panduan keselarasan proposal dengan Sustainable Development Goals'
        : 'Guide for aligning proposals with Sustainable Development Goals',
      type: 'PDF',
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#0F0F0F]/5 rounded-2xl lg:rounded-3xl p-5 lg:p-8 shadow-sm">
        <div className="mb-4 lg:mb-6">
          <h3 className="font-display font-bold text-lg lg:text-xl text-[#0F0F0F]">
            {language === 'id' ? 'Panduan & Dokumen' : 'Guides & Documents'}
          </h3>
          <p className="font-body text-sm text-[#0F0F0F]/60 mt-1">
            {language === 'id'
              ? 'Unduh panduan dan dokumen yang dibutuhkan untuk kompetisi'
              : 'Download guides and documents needed for the competition'}
          </p>
        </div>

        <div className="space-y-4">
          {guides.map((guide) => (
            <div
              key={guide.id}
              className="p-4 lg:p-5 bg-[#F9F8F6] rounded-2xl border border-transparent hover:border-[#0F0F0F]/10 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start gap-3 lg:gap-4">
                <div className="p-2.5 lg:p-3 bg-white rounded-xl shadow-sm border border-[#0F0F0F]/5 group-hover:border-[#FFB22C]/30 transition-colors flex-shrink-0">
                  <guide.icon className="w-5 h-5 lg:w-6 lg:h-6 text-[#FFB22C]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-body font-bold text-sm lg:text-base text-[#0F0F0F] group-hover:text-[#FFB22C] transition-colors">
                    {guide.title}
                  </h4>
                  <p className="font-body text-xs lg:text-sm text-[#0F0F0F]/60 mt-1">
                    {guide.description}
                  </p>
                  <span className="inline-block mt-2 text-[10px] lg:text-xs font-body font-bold text-[#0F0F0F]/40 uppercase tracking-wider">
                    {guide.type}
                  </span>
                </div>
                <button className="flex items-center gap-1.5 px-3 lg:px-4 py-2 bg-white rounded-xl text-xs lg:text-sm font-body font-bold text-[#0F0F0F]/70 hover:bg-[#FFB22C] hover:text-white border border-[#0F0F0F]/10 hover:border-[#FFB22C] transition-all flex-shrink-0 sm:opacity-0 sm:group-hover:opacity-100">
                  <Download className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                  <span className="hidden sm:inline">{language === 'id' ? 'Unduh' : 'Download'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-[#FFB22C]/10 rounded-2xl border border-[#FFB22C]/20">
          <p className="font-body text-sm text-[#0F0F0F]/70">
            <strong>{language === 'id' ? 'Info:' : 'Info:'}</strong>{' '}
            {language === 'id'
              ? 'Dokumen tambahan akan ditambahkan oleh panitia seiring berjalannya kompetisi.'
              : 'Additional documents will be added by the organizers as the competition progresses.'}
          </p>
        </div>
      </div>

      {/* External Links (if any from competition config) */}
      {competition?.config?.externalLinks && (
        <div className="bg-white border border-[#0F0F0F]/5 rounded-3xl p-6 lg:p-8 shadow-sm">
          <h3 className="font-display font-bold text-xl text-[#0F0F0F] mb-6">
            {language === 'id' ? 'Link Terkait' : 'Related Links'}
          </h3>
          <div className="space-y-3">
            {competition.config.externalLinks.map((link: any, index: number) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-[#F9F8F6] rounded-2xl hover:bg-[#FFB22C]/5 transition-colors group"
              >
                <span className="font-body font-bold text-[#0F0F0F] group-hover:text-[#FFB22C] transition-colors">
                  {link.title}
                </span>
                <ExternalLink className="w-4 h-4 text-[#0F0F0F]/40 group-hover:text-[#FFB22C] transition-colors" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcesSection;