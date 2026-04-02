/**
 * CIBC Power by KATH - Submission Upload Form
 *
 * Form for participants to upload BMC PDF submissions
 */

import React, { useState, useEffect } from 'react';
import {
  Upload, FileText, AlertCircle, CheckCircle, Clock,
  Loader2, Info, X
} from 'lucide-react';
import { toast } from 'sonner';
import { submissionsService, tasksService, stagesService } from '@/services/cibc.service';
import type { Task, Stage, Submission } from '@/services/cibc.service';
import { uploadFileToDrive } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';

interface SubmissionFormSectionProps {
  teamId: string;
  competitionId: string;
  existingSubmissions: Submission[];
  onSubmissionComplete: () => void;
}

const SubmissionFormSection: React.FC<SubmissionFormSectionProps> = ({
  teamId,
  competitionId,
  existingSubmissions,
  onSubmissionComplete
}) => {
  const { language } = useLanguage();
  const [stages, setStages] = useState<Stage[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchTasks();
  }, [competitionId]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const stagesData = await stagesService.getVisible(competitionId);
      setStages(stagesData);

      // Fetch tasks for each stage
      const allTasks: Task[] = [];
      for (const stage of stagesData) {
        const stageTasks = await tasksService.getPublished(stage.id);
        allTasks.push(...stageTasks);
      }
      setTasks(allTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const validateFile = (file: File): string | null => {
    // Check file type - PDF only
    if (file.type !== 'application/pdf') {
      return language === 'id' ? 'File harus berformat PDF' : 'File must be PDF format';
    }

    // Check file size - max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return language === 'id' ? 'File maksimal 10MB' : 'File max 10MB';
    }

    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const error = validateFile(selectedFile);
    if (error) {
      toast.error(error);
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (!selectedTask || !file) {
      toast.error(language === 'id' ? 'Pilih task dan upload file' : 'Select task and upload file');
      return;
    }

    // Check if already submitted
    const existingSubmission = existingSubmissions.find(s => s.task_id === selectedTask.id);
    if (existingSubmission && existingSubmission.status !== 'needs_revision') {
      toast.error(language === 'id' ? 'Task ini sudah pernah di-submit' : 'This task has already been submitted');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Upload file to Google Drive via n8n
      const uploadResult = await uploadFileToDrive(file, selectedTask.id, teamId);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Check if late
      const isLate = selectedTask.deadline ? new Date() > new Date(selectedTask.deadline) : false;

      // Create submission record
      await submissionsService.upsert({
        task_id: selectedTask.id,
        team_id: teamId,
        file_url: uploadResult.fileUrl,
        file_name: uploadResult.fileName,
        file_size: uploadResult.fileSize,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        is_late: isLate
      });

      toast.success(
        language === 'id' ? 'Submission berhasil dikirim!' : 'Submission sent successfully!',
        {
          description: isLate
            ? (language === 'id' ? 'Submission terlambat dari deadline' : 'Submission is past deadline')
            : undefined
        }
      );

      setFile(null);
      setSelectedTask(null);
      onSubmissionComplete();
    } catch (error) {
      console.error('Error submitting:', error);
      toast.error(language === 'id' ? 'Gagal mengirim submission' : 'Failed to submit');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const getTaskStatus = (taskId: string): { status: string; submission?: Submission } => {
    const submission = existingSubmissions.find(s => s.task_id === taskId);
    return {
      status: submission?.status || 'not_submitted',
      submission
    };
  };

  const availableTasks = tasks.filter(task => {
    const { status } = getTaskStatus(task.id);
    return status === 'not_submitted' || status === 'needs_revision';
  });

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center">
        <Loader2 className="w-8 h-8 text-[#FFB22C] animate-spin mx-auto mb-4" />
        <p className="text-gray-500">{language === 'id' ? 'Memuat tasks...' : 'Loading tasks...'}</p>
      </div>
    );
  }

  if (availableTasks.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <div className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="font-display font-bold text-xl text-[#0F0F0F] mb-2">
            {language === 'id' ? 'Semua Task Selesai' : 'All Tasks Completed'}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {language === 'id'
              ? 'Anda sudah mengirim submission untuk semua task yang tersedia.'
              : 'You have submitted for all available tasks.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-xl text-[#0F0F0F]">
              {language === 'id' ? 'Upload Submission' : 'Upload Submission'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {language === 'id'
                ? 'Upload dokumen BMC Anda untuk setiap task'
                : 'Upload your BMC documents for each task'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              {language === 'id' ? 'Tersedia' : 'Available'}
            </p>
            <p className="font-display font-bold text-2xl text-[#FFB22C]">{availableTasks.length}</p>
          </div>
        </div>
      </div>

      {/* Task Selection */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <label className="block font-semibold text-sm text-[#0F0F0F] mb-3">
          {language === 'id' ? 'Pilih Task' : 'Select Task'}
        </label>

        <div className="space-y-3">
          {availableTasks.map((task) => {
            const stage = stages.find(s => s.id === task.stage_id);
            const { status } = getTaskStatus(task.id);
            const isLate = task.deadline ? new Date() > new Date(task.deadline) : false;

            return (
              <label
                key={task.id}
                className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedTask?.id === task.id
                    ? 'border-[#FFB22C] bg-[#FFB22C]/5'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="task"
                    checked={selectedTask?.id === task.id}
                    onChange={() => setSelectedTask(task)}
                    className="mt-1 w-4 h-4 text-[#FFB22C] focus:ring-[#FFB22C]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-[#0F0F0F]">{task.name}</h4>
                      {status === 'needs_revision' && (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">
                          {language === 'id' ? 'Perlu Revisi' : 'Needs Revision'}
                        </span>
                      )}
                      {isLate && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">
                          {language === 'id' ? 'Terlambat' : 'Late'}
                        </span>
                      )}
                    </div>
                    {stage && (
                      <p className="text-sm text-gray-500">
                        {language === 'id' && stage.name_id ? stage.name_id : stage.name}
                      </p>
                    )}
                    {task.deadline && (
                      <p className="text-xs text-gray-400 mt-1">
                        <Clock className="w-3 h-3 inline mr-1" />
                        Deadline: {new Date(task.deadline).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* File Upload */}
      {selectedTask && (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4">
          <label className="block font-semibold text-sm text-[#0F0F0F] mb-3">
            {language === 'id' ? 'Upload File PDF' : 'Upload PDF File'}
          </label>

          {/* Task Instructions */}
          {selectedTask.description && (
            <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                <p className="text-sm text-blue-700">{selectedTask.description}</p>
              </div>
            </div>
          )}

          {/* Drop Zone */}
          <div
            onDrop={(e) => {
              e.preventDefault();
              const droppedFile = e.dataTransfer.files[0];
              if (droppedFile) {
                const error = validateFile(droppedFile);
                if (error) {
                  toast.error(error);
                } else {
                  setFile(droppedFile);
                }
              }
            }}
            onDragOver={(e) => e.preventDefault()}
            className={`relative border-2 border-dashed rounded-2xl p-8 transition-all ${
              file
                ? 'border-[#FFB22C] bg-[#FFB22C]/5'
                : 'border-gray-200 bg-[#F9F8F6] hover:border-[#FFB22C]'
            } ${uploading ? 'pointer-events-none opacity-70' : ''}`}
          >
            {uploading ? (
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-[#FFB22C] animate-spin mx-auto mb-4" />
                <p className="text-sm text-gray-600">
                  {language === 'id' ? 'Mengupload...' : 'Uploading...'} {uploadProgress}%
                </p>
                <div className="w-full max-w-xs h-2 bg-gray-200 rounded-full overflow-hidden mx-auto mt-3">
                  <div
                    className="h-full bg-[#FFB22C] transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : file ? (
              <div className="text-center">
                <FileText className="w-12 h-12 text-[#FFB22C] mx-auto mb-3" />
                <p className="font-semibold text-[#0F0F0F]">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button
                  onClick={() => setFile(null)}
                  className="mt-3 text-sm text-red-500 hover:text-red-600 flex items-center gap-1 mx-auto"
                >
                  <X className="w-4 h-4" />
                  {language === 'id' ? 'Hapus file' : 'Remove file'}
                </button>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="font-semibold text-[#0F0F0F]">
                  {language === 'id' ? 'Drag & drop atau klik untuk upload' : 'Drag & drop or click to upload'}
                </p>
                <p className="text-sm text-gray-500 mt-1">PDF, max 10MB</p>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          {file && !uploading && (
            <button
              onClick={handleSubmit}
              className="w-full mt-4 py-3.5 bg-[#FFB22C] hover:bg-[#FFB22C]/90 text-[#0F0F0F] font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-[#FFB22C]/20"
            >
              <Upload className="w-4 h-4" />
              {language === 'id' ? 'Kirim Submission' : 'Submit'}
            </button>
          )}
        </div>
      )}

      {/* Info Note */}
      <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-700">
            <p className="font-semibold mb-1">{language === 'id' ? 'Catatan Penting:' : 'Important Note:'}</p>
            <ul className="list-disc list-inside space-y-1">
              <li>{language === 'id' ? 'Format file harus PDF' : 'File must be in PDF format'}</li>
              <li>{language === 'id' ? 'Ukuran file maksimal 10MB' : 'Maximum file size is 10MB'}</li>
              <li>{language === 'id' ? 'Submission setelah deadline akan ditandai sebagai terlambat' : 'Submissions after deadline will be marked as late'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionFormSection;