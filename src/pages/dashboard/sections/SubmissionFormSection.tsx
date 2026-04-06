/**
 * CIBC Power by KATH - Submission Upload Form
 *
 * Two-step flow:
 * 1. Payment proof (image) - uploaded to team's payment_proof
 * 2. Task submission (PDF) - uploaded to submission's file_url
 *
 * Features:
 * - Deadline enforcement: cannot submit after deadline
 * - Resubmit: allowed when status is 'needs_revision'
 * - File validation: PDF only for tasks, image only for payment
 */

import React, { useState, useEffect } from 'react';
import {
  Upload, FileText, AlertCircle, CheckCircle, Clock,
  Loader2, Info, X, CreditCard, Image
} from 'lucide-react';
import { toast } from 'sonner';
import { submissionsService, tasksService, stagesService, paymentService } from '@/services/cibc.service';
import type { Task, Stage } from '@/services/cibc.service';
import { uploadFileToDrive } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';

// Use a simplified type for existing submissions
interface ExistingSubmission {
  id: string;
  task_id: string;
  team_id: string;
  status: string;
  file_url?: string;
  file_name?: string;
}

interface SubmissionFormSectionProps {
  teamId: string;
  competitionId: string;
  existingSubmissions: ExistingSubmission[];
  onSubmissionComplete: () => void;
  paymentStatus?: string;
  paymentProof?: string;
}

const SubmissionFormSection: React.FC<SubmissionFormSectionProps> = ({
  teamId,
  competitionId,
  existingSubmissions,
  onSubmissionComplete,
  paymentStatus,
  paymentProof,
}) => {
  const { language } = useLanguage();
  const [stages, setStages] = useState<Stage[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Payment proof state
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [uploadingPayment, setUploadingPayment] = useState(false);
  const [paymentPreview, setPaymentPreview] = useState<string | null>(paymentProof || null);
  const [currentPaymentStatus, setCurrentPaymentStatus] = useState(paymentStatus || 'none');

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

  // ============================================
  // Payment Proof Upload
  // ============================================

  const validatePaymentFile = (file: File): string | null => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return language === 'id' ? 'Bukti pembayaran harus berupa gambar (JPG/PNG)' : 'Payment proof must be an image (JPG/PNG)';
    }
    if (file.size > 5 * 1024 * 1024) {
      return language === 'id' ? 'Ukuran file maksimal 5MB' : 'File max 5MB';
    }
    return null;
  };

  const handlePaymentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const error = validatePaymentFile(selectedFile);
    if (error) {
      toast.error(error);
      return;
    }

    setPaymentFile(selectedFile);
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPaymentPreview(e.target?.result as string);
    reader.readAsDataURL(selectedFile);
  };

  const handlePaymentSubmit = async () => {
    if (!paymentFile) {
      toast.error(language === 'id' ? 'Pilih bukti pembayaran' : 'Select payment proof');
      return;
    }

    setUploadingPayment(true);
    try {
      const result = await paymentService.uploadProof(paymentFile, teamId, competitionId);
      await paymentService.updateTeamPayment(teamId, result.fileUrl, result.driveFileId);

      setCurrentPaymentStatus('pending');
      toast.success(language === 'id' ? 'Bukti pembayaran berhasil diupload!' : 'Payment proof uploaded!');
      onSubmissionComplete();
    } catch (error) {
      console.error('Error uploading payment:', error);
      toast.error(language === 'id' ? 'Gagal mengupload bukti pembayaran' : 'Failed to upload payment proof');
    } finally {
      setUploadingPayment(false);
    }
  };

  // ============================================
  // Task Submission (PDF)
  // ============================================

  const validateFile = (file: File): string | null => {
    if (file.type !== 'application/pdf') {
      return language === 'id' ? 'File harus berformat PDF' : 'File must be PDF format';
    }
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

  const isDeadlinePassed = (task: Task): boolean => {
    if (!task.deadline) return false;
    return new Date() > new Date(task.deadline);
  };

  const handleSubmit = async () => {
    if (!selectedTask || !file) {
      toast.error(language === 'id' ? 'Pilih task dan upload file' : 'Select task and upload file');
      return;
    }

    // DEADLINE CHECK: Block submission after deadline
    if (isDeadlinePassed(selectedTask)) {
      toast.error(language === 'id'
        ? 'Deadline sudah lewat! Anda tidak bisa submit lagi.'
        : 'Deadline has passed! You cannot submit anymore.');
      return;
    }

    // Check if already submitted (only allow resubmit for needs_revision)
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

      // Check if late (submitted before deadline but close)
      const isLate = selectedTask.deadline ? new Date() > new Date(selectedTask.deadline) : false;

      if (existingSubmission && existingSubmission.status === 'needs_revision') {
        // Resubmit: update existing submission
        await submissionsService.update(existingSubmission.id, {
          file_url: uploadResult.fileUrl,
          file_name: uploadResult.fileName,
          file_size: uploadResult.fileSize,
          status: 'submitted',
        });
        // Also update submitted_at timestamp
        await submissionsService.submit(existingSubmission.id);
      } else {
        // New submission
        await submissionsService.upsert({
          task_id: selectedTask.id,
          team_id: teamId,
          competition_id: competitionId,
          file_url: uploadResult.fileUrl,
          file_name: uploadResult.fileName,
          file_size: uploadResult.fileSize,
          status: 'submitted',
          submitted_at: new Date().toISOString(),
          is_late: isLate
        });
      }

      toast.success(
        existingSubmission?.status === 'needs_revision'
          ? (language === 'id' ? 'Submission berhasil dikirim ulang!' : 'Resubmission sent successfully!')
          : (language === 'id' ? 'Submission berhasil dikirim!' : 'Submission sent successfully!'),
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

  const getTaskStatus = (taskId: string): { status: string; submission?: ExistingSubmission } => {
    const submission = existingSubmissions.find(s => s.task_id === taskId);
    return {
      status: submission?.status || 'not_submitted',
      submission
    };
  };

  // Available tasks: not submitted OR needs_revision AND deadline not passed
  const availableTasks = tasks.filter(task => {
    const { status } = getTaskStatus(task.id);
    if (status !== 'not_submitted' && status !== 'needs_revision') return false;
    // Don't show tasks past deadline (unless needs_revision - they can still resubmit)
    if (status === 'not_submitted' && isDeadlinePassed(task)) return false;
    return true;
  });

  // Tasks past deadline (for display)
  const closedTasks = tasks.filter(task => {
    const { status } = getTaskStatus(task.id);
    return status === 'not_submitted' && isDeadlinePassed(task);
  });

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center">
        <Loader2 className="w-8 h-8 text-[#FFB22C] animate-spin mx-auto mb-4" />
        <p className="text-gray-500">{language === 'id' ? 'Memuat tasks...' : 'Loading tasks...'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ============================================ */}
      {/* SECTION 1: Payment Proof Upload */}
      {/* ============================================ */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-[#0F0F0F]">
              {language === 'id' ? 'Bukti Pembayaran' : 'Payment Proof'}
            </h3>
            <p className="text-sm text-gray-500">
              {language === 'id'
                ? 'Upload bukti transfer pembayaran (format gambar)'
                : 'Upload payment transfer proof (image format)'}
            </p>
          </div>
        </div>

        {/* Payment Status */}
        {currentPaymentStatus === 'verified' && (
          <div className="p-4 bg-green-50 rounded-xl border border-green-100 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-semibold text-green-700">
                {language === 'id' ? 'Pembayaran Terverifikasi' : 'Payment Verified'}
              </p>
              <p className="text-sm text-green-600">
                {language === 'id' ? 'Bukti pembayaran Anda sudah diverifikasi.' : 'Your payment proof has been verified.'}
              </p>
            </div>
          </div>
        )}

        {currentPaymentStatus === 'pending' && (
          <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100 flex items-center gap-3">
            <Clock className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="font-semibold text-yellow-700">
                {language === 'id' ? 'Menunggu Verifikasi' : 'Pending Verification'}
              </p>
              <p className="text-sm text-yellow-600">
                {language === 'id' ? 'Bukti pembayaran sedang diverifikasi admin.' : 'Payment proof is being verified by admin.'}
              </p>
            </div>
          </div>
        )}

        {currentPaymentStatus === 'rejected' && (
          <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-semibold text-red-700">
                {language === 'id' ? 'Pembayaran Ditolak' : 'Payment Rejected'}
              </p>
              <p className="text-sm text-red-600">
                {language === 'id' ? 'Silakan upload ulang bukti pembayaran.' : 'Please re-upload your payment proof.'}
              </p>
            </div>
          </div>
        )}

        {/* Show upload form if not verified */}
        {currentPaymentStatus !== 'verified' && (
          <div className="mt-4">
            {/* Preview existing/uploaded payment */}
            {paymentPreview && (
              <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-2 font-medium">
                  {language === 'id' ? 'Bukti Pembayaran:' : 'Payment Proof:'}
                </p>
                <img
                  src={paymentPreview}
                  alt="Payment proof"
                  className="max-h-48 rounded-lg object-contain mx-auto"
                />
              </div>
            )}

            {/* Upload new payment proof */}
            <div
              onDrop={(e) => {
                e.preventDefault();
                const droppedFile = e.dataTransfer.files[0];
                if (droppedFile) {
                  const error = validatePaymentFile(droppedFile);
                  if (error) {
                    toast.error(error);
                  } else {
                    setPaymentFile(droppedFile);
                    const reader = new FileReader();
                    reader.onload = (ev) => setPaymentPreview(ev.target?.result as string);
                    reader.readAsDataURL(droppedFile);
                  }
                }
              }}
              onDragOver={(e) => e.preventDefault()}
              className={`relative border-2 border-dashed rounded-2xl p-6 transition-all ${
                paymentFile
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-200 bg-[#F9F8F6] hover:border-green-400'
              } ${uploadingPayment ? 'pointer-events-none opacity-70' : ''}`}
            >
              {uploadingPayment ? (
                <div className="text-center">
                  <Loader2 className="w-10 h-10 text-green-500 animate-spin mx-auto mb-3" />
                  <p className="text-sm text-gray-600">{language === 'id' ? 'Mengupload...' : 'Uploading...'}</p>
                </div>
              ) : paymentFile ? (
                <div className="text-center">
                  <Image className="w-10 h-10 text-green-500 mx-auto mb-2" />
                  <p className="font-semibold text-[#0F0F0F]">{paymentFile.name}</p>
                  <p className="text-sm text-gray-500">{(paymentFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  <button
                    onClick={() => { setPaymentFile(null); setPaymentPreview(paymentProof || null); }}
                    className="mt-2 text-sm text-red-500 hover:text-red-600 flex items-center gap-1 mx-auto"
                  >
                    <X className="w-4 h-4" />
                    {language === 'id' ? 'Ganti file' : 'Change file'}
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="font-semibold text-[#0F0F0F]">
                    {language === 'id' ? 'Upload bukti pembayaran' : 'Upload payment proof'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">JPG/PNG, max 5MB</p>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    onChange={handlePaymentFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Submit payment button */}
            {paymentFile && !uploadingPayment && (
              <button
                onClick={handlePaymentSubmit}
                className="w-full mt-4 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <CreditCard className="w-4 h-4" />
                {language === 'id' ? 'Kirim Bukti Pembayaran' : 'Submit Payment Proof'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* SECTION 2: Task Submission (PDF) */}
      {/* ============================================ */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-bold text-xl text-[#0F0F0F]">
              {language === 'id' ? 'Pengumpulan Tugas' : 'Task Submission'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {language === 'id'
                ? 'Upload dokumen BMC Anda (PDF) untuk setiap task'
                : 'Upload your BMC document (PDF) for each task'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              {language === 'id' ? 'Tersedia' : 'Available'}
            </p>
            <p className="font-display font-bold text-2xl text-[#FFB22C]">{availableTasks.length}</p>
          </div>
        </div>

        {availableTasks.length === 0 && closedTasks.length === 0 && (
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
        )}

        {/* Task Selection */}
        {availableTasks.length > 0 && (
          <div className="space-y-3 mb-6">
            <label className="block font-semibold text-sm text-[#0F0F0F]">
              {language === 'id' ? 'Pilih Task' : 'Select Task'}
            </label>

            {availableTasks.map((task) => {
              const stage = stages.find(s => s.id === task.stage_id);
              const { status } = getTaskStatus(task.id);

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
                          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                            {language === 'id' ? 'Perlu Revisi' : 'Needs Revision'}
                          </span>
                        )}
                      </div>
                      {stage && (
                        <p className="text-sm text-gray-500">
                          {language === 'id' && stage.name_id ? stage.name_id : stage.name}
                        </p>
                      )}
                      {task.deadline && (
                        <p className={`text-xs mt-1 ${
                          isDeadlinePassed(task) ? 'text-red-500 font-medium' : 'text-gray-400'
                        }`}>
                          <Clock className="w-3 h-3 inline mr-1" />
                          {isDeadlinePassed(task)
                            ? (language === 'id' ? 'Deadline sudah lewat' : 'Deadline passed')
                            : `Deadline: ${new Date(task.deadline).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}`
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        )}

        {/* Closed Tasks (past deadline) */}
        {closedTasks.length > 0 && (
          <div className="mb-6">
            <p className="text-xs text-red-500 font-medium uppercase tracking-wider mb-2">
              {language === 'id' ? 'Deadline Terlewat' : 'Missed Deadlines'}
            </p>
            {closedTasks.map((task) => (
              <div key={task.id} className="p-3 rounded-xl border border-red-100 bg-red-50/50 mb-2 opacity-60">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <h4 className="font-medium text-[#0F0F0F] text-sm">{task.name}</h4>
                  <span className="text-xs text-red-500">
                    {language === 'id' ? 'Deadline sudah lewat' : 'Deadline passed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* File Upload */}
        {selectedTask && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
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
                {getTaskStatus(selectedTask.id).status === 'needs_revision'
                  ? (language === 'id' ? 'Kirim Ulang Submission' : 'Resubmit')
                  : (language === 'id' ? 'Kirim Submission' : 'Submit')
                }
              </button>
            )}
          </div>
        )}
      </div>

      {/* Info Note */}
      <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-700">
            <p className="font-semibold mb-1">{language === 'id' ? 'Catatan Penting:' : 'Important Note:'}</p>
            <ul className="list-disc list-inside space-y-1">
              <li>{language === 'id' ? 'Bukti pembayaran: format gambar (JPG/PNG), maks 5MB' : 'Payment proof: image format (JPG/PNG), max 5MB'}</li>
              <li>{language === 'id' ? 'Tugas: format PDF, maks 10MB' : 'Task: PDF format, max 10MB'}</li>
              <li>{language === 'id' ? 'Submission setelah deadline tidak bisa dikirim' : 'Submissions after deadline cannot be submitted'}</li>
              <li>{language === 'id' ? 'Jika diminta revisi, Anda bisa submit ulang sebelum deadline' : 'If revision is requested, you can resubmit before deadline'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionFormSection;
