import { AlertCircle } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface SubmissionSectionProps {
    team: any;
    submissions: any[];
}

const SubmissionSection = ({ team, submissions }: SubmissionSectionProps) => {
    const { language } = useLanguage();

    return (
        <div className="space-y-6">
            <div className="bg-white border border-[#0F0F0F]/5 rounded-3xl p-6 lg:p-8 shadow-sm">
                <h3 className="font-display font-bold text-xl text-[#0F0F0F] mb-6">
                    {language === 'id' ? 'Status Submission' : 'Submission Status'}
                </h3>

                {team ? (
                    submissions.length > 0 ? (
                        <div className="space-y-4">
                            {submissions.map((submission: any) => (
                                <div key={submission.id} className="p-5 bg-[#F9F8F6] rounded-2xl border border-[#0F0F0F]/5 hover:border-[#0F0F0F]/10 transition-colors">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={`px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider uppercase font-body ${submission.status === 'graded' ? 'bg-green-500/10 text-green-600' :
                                                submission.status === 'submitted' ? 'bg-blue-500/10 text-blue-600' :
                                                    'bg-[#FFB22C]/10 text-[#FFB22C]'
                                            }`}>
                                            {submission.status}
                                        </span>
                                        {submission.total_score !== undefined && (
                                            <span className="font-display font-bold text-[#FFB22C] text-lg sm:text-xl">{submission.total_score}/100</span>
                                        )}
                                    </div>
                                    {submission.file_name && (
                                        <p className="font-body font-bold text-[#0F0F0F] text-sm">{submission.file_name}</p>
                                    )}
                                    {submission.feedback && (
                                        <p className="font-body text-xs font-medium text-[#0F0F0F]/60 mt-2 leading-relaxed">{submission.feedback}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <AlertCircle className="w-14 h-14 text-[#0F0F0F]/20 mx-auto mb-4" />
                            <p className="font-body font-medium text-[#0F0F0F]/50">
                                {language === 'id' ? 'Belum ada submission' : 'No submissions yet'}
                            </p>
                            <button className="mt-6 px-8 py-3 bg-[#FFB22C] text-white rounded-xl font-body font-bold text-sm hover:bg-[#FFB22C]/90 shadow-md shadow-[#FFB22C]/20 transition-all">
                                {language === 'id' ? 'Buat Submission' : 'Create Submission'}
                            </button>
                        </div>
                    )
                ) : (
                    <div className="text-center py-10">
                        <AlertCircle className="w-14 h-14 text-[#0F0F0F]/20 mx-auto mb-4" />
                        <p className="font-body font-medium text-[#0F0F0F]/50">
                            {language === 'id' ? 'Daftar tim terlebih dahulu untuk mengirim submission' : 'Register a team first to submit'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubmissionSection;