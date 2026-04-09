import { useState } from 'react';
import {
  CheckCircle2, Clock, XCircle, AlertCircle,
  Plus, Eye, Upload, FileText, Star, Download,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { TeamData, SubmissionData, TaskData, StageData, CurrentUser } from '../CIBCDashboard';
import SubmissionFormSection from './SubmissionFormSection';

interface SubmissionSectionProps {
  team: TeamData | null;
  submissions: SubmissionData[];
  tasks: TaskData[];
  stages: StageData[];
  competition?: any;
  currentUser?: CurrentUser | null;
  onRefresh: () => void;
  paymentStatus?: string;
  paymentProof?: string;
}

const SubmissionSection = ({
  team,
  submissions,
  tasks,
  stages,
  competition,
  currentUser: _currentUser,
  onRefresh,
  paymentStatus: _paymentStatus,
  paymentProof: _paymentProof,
}: SubmissionSectionProps) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'upload' | 'status'>('upload');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'graded':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {language === 'id' ? 'Dinilai' : 'Graded'}
          </span>
        );
      case 'submitted':
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {language === 'id' ? 'Dikirim' : 'Submitted'}
          </span>
        );
      case 'under_review':
        return (
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
            {language === 'id' ? 'Sedang Direview' : 'Under Review'}
          </span>
        );
      case 'needs_revision':
        return (
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            {language === 'id' ? 'Perlu Revisi' : 'Needs Revision'}
          </span>
        );
      case 'draft':
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
            {language === 'id' ? 'Draft' : 'Draft'}
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold capitalize">
            {status}
          </span>
        );
    }
  };

  // Check if there are any submissions
  const hasSubmissions = submissions.length > 0;

  if (!team) {
    return (
      <div className="bg-white border border-[#0F0F0F]/5 rounded-3xl p-8 shadow-sm">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-[#0F0F0F]/20 mx-auto mb-4" />
          <h3 className="font-display font-bold text-xl text-[#0F0F0F] mb-2">
            {language === 'id' ? 'Belum Ada Tim' : 'No Team Yet'}
          </h3>
          <p className="font-body text-[#0F0F0F]/60">
            {language === 'id'
              ? 'Anda harus bergabung dengan tim terlebih dahulu untuk mengirim submission.'
              : 'You need to join a team first to submit.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="bg-white border border-[#0F0F0F]/5 rounded-3xl p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-xl text-[#0F0F0F]">
              {language === 'id' ? 'Submission' : 'Submission'}
            </h3>
            <p className="font-body text-sm text-[#0F0F0F]/60 mt-1">
              {language === 'id'
                ? 'Upload dokumen BMC dan lihat status submission Anda'
                : 'Upload BMC documents and view your submission status'}
            </p>
          </div>
          <div className="text-right">
            <p className="font-body text-xs text-[#0F0F0F]/40 uppercase tracking-wider">
              {language === 'id' ? 'Total Submission' : 'Total Submissions'}
            </p>
            <p className="font-display font-bold text-2xl text-[#0F0F0F]">{submissions.length}</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-body font-bold text-sm transition-all ${
              activeTab === 'upload'
                ? 'bg-[#FFB22C] text-[#0F0F0F] shadow-md shadow-[#FFB22C]/20'
                : 'bg-[#F9F8F6] text-[#0F0F0F]/60 hover:bg-gray-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            {language === 'id' ? 'Upload Baru' : 'New Upload'}
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-body font-bold text-sm transition-all ${
              activeTab === 'status'
                ? 'bg-[#FFB22C] text-[#0F0F0F] shadow-md shadow-[#FFB22C]/20'
                : 'bg-[#F9F8F6] text-[#0F0F0F]/60 hover:bg-gray-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            {language === 'id' ? 'Lihat Status' : 'View Status'}
            {hasSubmissions && (
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'upload' && competition && (
        <SubmissionFormSection
          teamId={team.id}
          competitionId={competition.id}
          existingSubmissions={submissions}
          onSubmissionComplete={onRefresh}
          paymentStatus={team?.payment_status}
          paymentProof={team?.payment_proof}
        />
      )}

      {activeTab === 'status' && (
        <>
          {/* No Submissions Yet */}
          {!hasSubmissions && (
            <div className="bg-white border border-[#0F0F0F]/5 rounded-3xl p-8 shadow-sm">
              <div className="text-center py-8">
                <Upload className="w-16 h-16 text-[#0F0F0F]/20 mx-auto mb-4" />
                <h3 className="font-display font-bold text-xl text-[#0F0F0F] mb-2">
                  {language === 'id' ? 'Belum Ada Submission' : 'No Submissions Yet'}
                </h3>
                <p className="font-body text-[#0F0F0F]/60 max-w-md mx-auto mb-4">
                  {language === 'id'
                    ? 'Anda belum mengirim submission. Klik tab "Upload Baru" untuk mengirim dokumen BMC.'
                    : 'You haven\'t submitted anything yet. Click "New Upload" tab to submit your BMC document.'}
                </p>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="px-6 py-3 bg-[#FFB22C] text-[#0F0F0F] rounded-xl font-body font-bold hover:bg-[#FFB22C]/90 transition-all"
                >
                  {language === 'id' ? 'Upload Submission' : 'Upload Submission'}
                </button>
              </div>
            </div>
          )}

          {/* Submissions List */}
          {hasSubmissions && (
            <div className="space-y-4">
              {submissions.map((submission) => {
                const task = tasks.find(t => t.id === submission.task_id);
                const stage = stages.find(s => s.id === task?.stage_id);

                return (
                  <div
                    key={submission.id}
                    className="bg-white border border-[#0F0F0F]/5 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        {/* Task & Stage Info */}
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusBadge(submission.status)}
                          {stage && (
                            <span className="text-xs text-[#0F0F0F]/40 font-body">
                              {language === 'id' && stage.name_id ? stage.name_id : stage.name}
                            </span>
                          )}
                        </div>

                        {/* Task Name */}
                        <h4 className="font-body font-bold text-[#0F0F0F] text-lg">
                          {task?.name || (language === 'id' ? 'Task Tidak Diketahui' : 'Unknown Task')}
                        </h4>

                        {/* File Name */}
                        {submission.file_name && (
                          <div className="flex items-center gap-2 mt-2">
                            <FileText className="w-4 h-4 text-[#0F0F0F]/40" />
                            <span className="font-body text-sm text-[#0F0F0F]/60">{submission.file_name}</span>
                          </div>
                        )}

                        {/* Submission Date */}
                        {submission.submitted_at && (
                          <p className="font-body text-xs text-[#0F0F0F]/40 mt-2">
                            {language === 'id' ? 'Dikirim:' : 'Submitted:'}{' '}
                            {new Date(submission.submitted_at).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        )}
                      </div>

                      {/* Score & Download */}
                      <div className="flex flex-col items-end gap-3">
                        {/* Score */}
                        {submission.status === 'graded' && submission.total_score !== undefined && (
                          <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-[#FFB22C]" />
                            <span className="font-display font-bold text-2xl text-[#FFB22C]">
                              {submission.total_score}/100
                            </span>
                          </div>
                        )}

                        {/* Download Button */}
                        {submission.file_url && (
                          <a
                            href={submission.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-[#F9F8F6] rounded-xl text-sm font-body font-bold text-[#0F0F0F]/70 hover:bg-[#FFB22C] hover:text-white transition-all"
                          >
                            <Download className="w-4 h-4" />
                            {language === 'id' ? 'Unduh File' : 'Download'}
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Feedback from Judge */}
                    {submission.status === 'graded' && submission.feedback && (
                      <div className="mt-4 p-4 bg-green-50 rounded-2xl border border-green-100">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Star className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-body text-xs font-bold text-green-700 uppercase tracking-wider mb-1">
                              {language === 'id' ? 'Feedback dari Juri' : 'Feedback from Judge'}
                            </p>
                            <p className="font-body text-sm text-green-800 leading-relaxed">
                              {submission.feedback}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Revision Request */}
                    {submission.status === 'needs_revision' && submission.feedback && (
                      <div className="mt-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <AlertCircle className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-body text-xs font-bold text-orange-700 uppercase tracking-wider mb-1">
                              {language === 'id' ? 'Permintaan Revisi' : 'Revision Request'}
                            </p>
                            <p className="font-body text-sm text-orange-800 leading-relaxed">
                              {submission.feedback}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Criteria Scores (if detailed grading) */}
                    {submission.status === 'graded' && (submission as any).criteria_scores && Object.keys((submission as any).criteria_scores).length > 0 && (
                      <div className="mt-4 p-4 bg-[#F9F8F6] rounded-2xl">
                        <p className="font-body text-xs font-bold text-[#0F0F0F]/40 uppercase tracking-wider mb-3">
                          {language === 'id' ? 'Rincian Penilaian' : 'Score Breakdown'}
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {Object.entries((submission as any).criteria_scores).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-2 bg-white rounded-lg">
                              <span className="font-body text-xs text-[#0F0F0F]/60 capitalize">{key}</span>
                              <span className="font-body font-bold text-sm text-[#0F0F0F]">{value as number}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Pending Tasks Info */}
          {hasSubmissions && (
            <div className="bg-[#FFB22C]/10 border border-[#FFB22C]/20 rounded-2xl p-5">
              <p className="font-body text-sm text-[#0F0F0F]/70">
                <strong>{language === 'id' ? 'Catatan:' : 'Note:'}</strong>{' '}
                {language === 'id'
                  ? 'Submission baru akan muncul setelah dinilai oleh juri. Silakan tunggu hasil penilaian.'
                  : 'New submissions will appear after being graded by judges. Please wait for the results.'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SubmissionSection;
