import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft, Upload, FileText, X, AlertCircle, CheckCircle2, Loader2, Save
} from '../icons';
import {
  supabaseCompetitionService,
  supabaseSubmissionService,
} from '../services/supabase.service';
import { supabase, uploadFileToR2 } from '../lib/supabase';
import type { Competition, Submission } from '../types';

// ============================================
// Constants
// ============================================

const ALLOWED_EXTENSIONS = ['.pdf', '.pptx'];
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_FILES = 5;

// BMC Blocks for structured submission
const BMC_BLOCKS = [
  { key: 'customer_segments', label: 'Customer Segments', labelId: 'Segmen Pelanggan', weight: 15, placeholder: 'Siapa target market Anda? Persona pelanggan utama...' },
  { key: 'value_proposition', label: 'Value Proposition', labelId: 'Proposisi Nilai', weight: 20, placeholder: 'Apa keunikan produk/jasa Anda? Bagaimana membedakan dari kompetitor...' },
  { key: 'channels', label: 'Channels', labelId: 'Saluran', weight: 10, placeholder: 'Bagaimana produk/jasa sampai ke pelanggan? Go-to-market strategy...' },
  { key: 'customer_relationships', label: 'Customer Relationships', labelId: 'Hubungan Pelanggan', weight: 5, placeholder: 'Bagaimana Anda membangun dan mempertahankan hubungan dengan pelanggan...' },
  { key: 'revenue_streams', label: 'Revenue Streams', labelId: 'Sumber Pendapatan', weight: 15, placeholder: 'Model monetisasi apa yang digunakan? Strategi pricing...' },
  { key: 'key_resources', label: 'Key Resources', labelId: 'Sumber Daya Utama', weight: 10, placeholder: 'Aset utama yang dibutuhkan (fisik, intelektual, manusia, finansial)...' },
  { key: 'key_activities', label: 'Key Activities', labelId: 'Aktivitas Utama', weight: 10, placeholder: 'Aktivitas bisnis paling penting yang harus dilakukan...' },
  { key: 'key_partnerships', label: 'Key Partnerships', labelId: 'Kemitraan Utama', weight: 5, placeholder: 'Strategi kemitraan, supplier, dan aliansi strategis...' },
  { key: 'cost_structure', label: 'Cost Structure', labelId: 'Struktur Biaya', weight: 10, placeholder: 'Komponen biaya utama, unit economics, break-even analysis...' },
] as const;

type BMCBlockKey = typeof BMC_BLOCKS[number]['key'];

// ============================================
// Component
// ============================================

const SubmissionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [competition, setCompetition] = useState<Competition | null>(null);
  const [existingSubmission, setExistingSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFileName, setUploadingFileName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Form state
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [bmcFields, setBmcFields] = useState<Record<BMCBlockKey, string>>(() => {
    const initial: Record<string, string> = {};
    BMC_BLOCKS.forEach(block => { initial[block.key] = ''; });
    return initial as Record<BMCBlockKey, string>;
  });
  const [submissionMode, setSubmissionMode] = useState<'structured' | 'freeform'>('structured');

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const validateFile = useCallback((file: File): string | null => {
    // Check file type by extension (more reliable than MIME type)
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return `"${file.name}" - Format file tidak didukung. Gunakan: ${ALLOWED_EXTENSIONS.join(', ')}`;
    }
    // Check file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `"${file.name}" - Ukuran file melebihi ${MAX_FILE_SIZE_MB}MB (${formatFileSize(file.size)})`;
    }
    return null;
  }, [formatFileSize]);

  const loadData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const comp = await supabaseCompetitionService.getById(id);
      if (comp) {
        setCompetition(comp);
      }
      // Try to load existing submission
      const sub = await supabaseSubmissionService.getByCompetition(id);
      if (sub) {
        setExistingSubmission(sub);
        setContent(sub.content || '');
        // Restore BMC fields if saved
        if (sub.field_values) {
          const restored: Record<string, string> = {};
          BMC_BLOCKS.forEach(block => {
            restored[block.key] = (sub.field_values as Record<string, unknown>)?.[block.key] as string || '';
          });
          setBmcFields(restored as Record<BMCBlockKey, string>);
        }
      }
    } catch (e) {
      console.error('Error loading submission data:', e);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ============================================
  // File Handling
  // ============================================

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const errors: string[] = [];
    const validFiles: File[] = [];

    for (const file of fileArray) {
      const err = validateFile(file);
      if (err) {
        errors.push(err);
      } else {
        validFiles.push(file);
      }
    }

    // Check total file count
    if (files.length + validFiles.length > MAX_FILES) {
      errors.push(`Maksimal ${MAX_FILES} file. Anda sudah punya ${files.length} file.`);
      validFiles.splice(MAX_FILES - files.length);
    }

    setFileErrors(errors);
    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
    }
  }, [files.length, validateFile]);

  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(e.target.files);
      // Reset input so the same file can be re-selected
      e.target.value = '';
    }
  };

  const handleFileRemove = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setFileErrors([]);
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      addFiles(e.dataTransfer.files);
    }
  };

  // ============================================
  // Helper: get current user's team ID
  // ============================================

  const getCurrentUserTeamId = useCallback(async (): Promise<string> => {
    const { supabaseAuthService } = await import('../services/supabase.service');
    const user = await supabaseAuthService.getCurrentUser();
    if (!user) throw new Error('Not authenticated. Silakan login kembali.');

    if (!supabase) throw new Error('Supabase is not configured');

    const { data: teamData } = await supabase
      .from('teams')
      .select('id')
      .contains('member_ids', [user.id])
      .eq('competition_id', id)
      .maybeSingle();

    if (!teamData?.id) throw new Error('No team found for this competition. Pastikan Anda sudah terdaftar dalam tim.');
    return teamData.id;
  }, [id]);

  // ============================================
  // Helper: build submission content and field values
  // ============================================

  const buildSubmissionData = useCallback(() => {
    const submissionContent = submissionMode === 'structured'
      ? BMC_BLOCKS.map(block => `## ${block.label}\n${bmcFields[block.key] || '(empty)'}`).join('\n\n')
      : content;

    const fieldValues = submissionMode === 'structured'
      ? { ...bmcFields, mode: 'structured' }
      : { mode: 'freeform' };

    return { submissionContent, fieldValues };
  }, [submissionMode, bmcFields, content]);

  // ============================================
  // Draft Save (no file upload)
  // ============================================

  const handleSaveDraft = async () => {
    if (!id) return;

    setError('');
    setSuccess('');
    setIsSavingDraft(true);

    try {
      const teamId = await getCurrentUserTeamId();
      const { submissionContent, fieldValues } = buildSubmissionData();

      if (existingSubmission) {
        await supabaseSubmissionService.update(existingSubmission.id, {
          content: submissionContent,
          status: 'draft',
        });
      } else {
        await supabaseSubmissionService.createWithContent(
          'default',
          teamId,
          id,
          submissionContent,
          { ...fieldValues, status: 'draft' }
        );
      }

      setSuccess('Draft berhasil disimpan.');
    } catch (e) {
      console.error('Error saving draft:', e);
      setError(e instanceof Error ? e.message : 'Gagal menyimpan draft. Silakan coba lagi.');
    } finally {
      setIsSavingDraft(false);
    }
  };

  // ============================================
  // Submit Handler (with file upload via Cloudflare R2)
  // ============================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setError('');
    setSuccess('');
    setIsSubmitting(true);
    setUploadProgress(0);
    setUploadingFileName('');

    try {
      const teamId = await getCurrentUserTeamId();
      const { submissionContent, fieldValues } = buildSubmissionData();

      // Upload files to Cloudflare R2 via Supabase Edge Function
      const uploadedFiles: Array<{
        fileUrl: string;
        storageKey: string;
        fileName: string;
        fileSize: number;
        fileType: string;
      }> = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const progress = Math.round(((i) / files.length) * 80);
        setUploadProgress(progress);
        setUploadingFileName(file.name);

        try {
          const result = await uploadFileToR2(file, 'default', teamId);
          uploadedFiles.push({
            fileUrl: result.fileUrl,
            storageKey: result.storageKey,
            fileName: result.fileName,
            fileSize: result.fileSize,
            fileType: file.type,
          });
        } catch (uploadError) {
          console.error(`[Submission] Failed to upload ${file.name}:`, uploadError);
          throw new Error(
            `Gagal mengupload "${file.name}". ` +
            (uploadError instanceof Error ? uploadError.message : 'Upload error. Silakan coba lagi.')
          );
        }
      }

      setUploadProgress(85);
      setUploadingFileName('');

      // Use the first uploaded file as the primary file for the submission record
      const primaryFile = uploadedFiles.length > 0 ? uploadedFiles[0] : null;

      // Store all uploaded files metadata in field_values for reference
      const allFilesMeta = uploadedFiles.length > 0
        ? {
            files: uploadedFiles.map(f => ({
              name: f.fileName,
              url: f.fileUrl,
              storageKey: f.storageKey,
              size: f.fileSize,
            })),
            file_count: uploadedFiles.length,
          }
        : undefined;

      if (existingSubmission) {
        // Update existing submission with file metadata in dedicated columns
        await supabaseSubmissionService.update(existingSubmission.id, {
          content: submissionContent,
          status: 'submitted',
          ...(primaryFile && {
            file_url: primaryFile.fileUrl,
            file_name: primaryFile.fileName,
            file_size: primaryFile.fileSize,
            drive_file_id: primaryFile.storageKey,
          }),
        });
      } else {
        // Create new submission with file metadata
        const { supabaseSubmissionService: svc } = await import('../services/supabase.service');

        if (primaryFile) {
          // If we have files, use the direct Supabase insert to set file columns
          // createWithContent only sets content + field_values, not file columns
          const { error } = await supabase!
            .from('submissions')
            .insert({
              task_id: 'default',
              team_id: teamId,
              competition_id: id,
              content: submissionContent,
              file_url: primaryFile.fileUrl,
              file_name: primaryFile.fileName,
              file_size: primaryFile.fileSize,
              drive_file_id: primaryFile.storageKey,
              status: 'submitted',
              submitted_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (error) throw error;
        } else {
          // Text-only submission
          await svc.createWithContent(
            'default',
            teamId,
            id,
            submissionContent,
            fieldValues
          );
        }
      }

      setUploadProgress(100);
      setShowConfirmation(true);
    } catch (e) {
      console.error('Error submitting:', e);
      setError(e instanceof Error ? e.message : 'Gagal mengirim submission. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================
  // Render Helpers
  // ============================================

  const hasContent = submissionMode === 'structured'
    ? Object.values(bmcFields).some(v => v.trim().length > 0)
    : content.trim().length > 0;

  const totalBmcWeight = BMC_BLOCKS.reduce((sum, b) => sum + b.weight, 0);
  const filledBlocks = BMC_BLOCKS.filter(b => bmcFields[b.key].trim().length > 0).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-kath-bg-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-kath-gold/30 border-t-kath-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="min-h-screen bg-kath-bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/[0.02] flex items-center justify-center">
            <FileText className="w-8 h-8 text-white/20" />
          </div>
          <h2 className="font-display text-xl text-white mb-2">Competition not found</h2>
          <button
            onClick={() => navigate('/my-competitions')}
            className="text-kath-gold hover:text-kath-gold-light font-body text-sm"
          >
            Back to My Competitions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kath-bg-dark">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-kath-bg-dark/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/competition/${id}`)}
                className="flex items-center gap-2 text-white/60 hover:text-kath-gold transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-body text-sm">Back</span>
              </button>
              <div className="h-6 w-px bg-white/10" />
              <h1 className="font-display text-xl text-white truncate max-w-[200px] sm:max-w-md">
                Submit - {competition.name}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          {success && !showConfirmation && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <p className="font-body text-emerald-400">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="font-body text-red-400">{error}</p>
            </div>
          )}

          {/* Competition Info */}
          <div className="mb-8 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
            <h2 className="font-display text-lg text-white mb-2">{competition.name}</h2>
            <p className="font-body text-white/60 text-sm mb-4">{competition.description}</p>
            {competition.competition_end && (
              <div className="flex items-center gap-2 text-white/50">
                <span className="font-body text-sm">
                  Deadline: {new Date(competition.competition_end).toLocaleDateString('id-ID')}
                </span>
              </div>
            )}
          </div>

          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mode Selector */}
            <div className="flex gap-2 p-1 bg-white/[0.03] rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => setSubmissionMode('structured')}
                className={`flex-1 py-2.5 px-4 rounded-lg font-body text-sm font-medium transition-all ${
                  submissionMode === 'structured'
                    ? 'bg-kath-gold text-kath-bg-dark'
                    : 'text-white/50 hover:text-white/70'
                }`}
              >
                BMC Canvas (9 Blok)
              </button>
              <button
                type="button"
                onClick={() => setSubmissionMode('freeform')}
                className={`flex-1 py-2.5 px-4 rounded-lg font-body text-sm font-medium transition-all ${
                  submissionMode === 'freeform'
                    ? 'bg-kath-gold text-kath-bg-dark'
                    : 'text-white/50 hover:text-white/70'
                }`}
              >
                Free Text
              </button>
            </div>

            {/* Structured BMC Form */}
            {submissionMode === 'structured' && (
              <div className="space-y-4">
                {/* Progress indicator */}
                <div className="flex items-center justify-between text-xs text-white/40 font-body mb-2">
                  <span>{filledBlocks}/{BMC_BLOCKS.length} blok terisi</span>
                  <span>Total bobot: {totalBmcWeight}%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-kath-gold/60 rounded-full transition-all duration-500"
                    style={{ width: `${(filledBlocks / BMC_BLOCKS.length) * 100}%` }}
                  />
                </div>

                {BMC_BLOCKS.map((block) => (
                  <div key={block.key} className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-body text-white/70 text-sm font-medium">
                        {block.label}
                        <span className="text-white/30 ml-1">({block.labelId})</span>
                      </label>
                      <span className="text-xs text-kath-gold/60 font-body font-medium">{block.weight}%</span>
                    </div>
                    <textarea
                      value={bmcFields[block.key]}
                      onChange={(e) => setBmcFields(prev => ({ ...prev, [block.key]: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/[0.02] border border-white/10 rounded-xl font-body text-white placeholder-white/20 focus:outline-none focus:border-kath-gold/50 focus:ring-1 focus:ring-kath-gold/20 resize-none text-sm"
                      placeholder={block.placeholder}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Free Text Content */}
            {submissionMode === 'freeform' && (
              <div>
                <label className="block font-body text-white/70 text-sm mb-2">
                  Submission Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 bg-white/[0.02] border border-white/10 rounded-xl font-body text-white placeholder-white/30 focus:outline-none focus:border-kath-gold/50 focus:ring-1 focus:ring-kath-gold/20 resize-none"
                  placeholder="Describe your submission..."
                />
              </div>
            )}

            {/* File Upload */}
            <div>
              <label className="block font-body text-white/70 text-sm mb-2">
                Attachments
                <span className="text-white/30 ml-1">(Maks. {MAX_FILES} file, {MAX_FILE_SIZE_MB}MB/file)</span>
              </label>

              {/* Drag & Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-kath-gold bg-kath-gold/5'
                    : 'border-white/10 hover:border-kath-gold/30'
                }`}
              >
                <Upload className="w-8 h-8 text-white/30 mx-auto mb-3" />
                <p className="font-body text-white/50 mb-1">
                  {isDragging ? 'Lepaskan file di sini...' : 'Drag and drop files here or click to browse'}
                </p>
                <p className="font-body text-white/30 text-xs">
                  Format: {ALLOWED_EXTENSIONS.join(', ')} | Maks. {MAX_FILE_SIZE_MB}MB per file
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={ALLOWED_EXTENSIONS.join(',')}
                  onChange={handleFileAdd}
                  className="hidden"
                />
              </div>

              {/* File Errors */}
              {fileErrors.length > 0 && (
                <div className="mt-3 space-y-1">
                  {fileErrors.map((err, i) => (
                    <p key={i} className="text-red-400 text-xs font-body flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      {err}
                    </p>
                  ))}
                </div>
              )}

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-kath-gold" />
                        <div>
                          <p className="font-body text-white text-sm">{file.name}</p>
                          <p className="font-body text-white/40 text-xs">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleFileRemove(index)}
                        className="p-1 text-white/40 hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {isSubmitting && uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-body text-white/50">
                  <span>{uploadingFileName ? `Uploading ${uploadingFileName}...` : 'Processing...'}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-kath-gold rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {/* Save Draft Button */}
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSavingDraft || isSubmitting || !hasContent}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-white/5 hover:bg-white/10 text-white/70 font-body font-semibold rounded-xl transition-all border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingDraft ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Draft
                  </>
                )}
              </button>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isSavingDraft || (!hasContent && files.length === 0)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-kath-gold hover:bg-kath-gold-light text-kath-bg-dark font-body font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : existingSubmission ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Update Submission
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Submit
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal Content */}
          <div className="relative w-full max-w-md bg-kath-bg-dark border border-white/10 rounded-2xl p-8 text-center">
            {/* Success Icon */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>

            <h3 className="font-display text-xl text-white mb-2">
              Submission Berhasil!
            </h3>
            <p className="font-body text-white/60 text-sm mb-2">
              {files.length > 0
                ? `${files.length} file berhasil diupload ke Cloud Storage.`
                : 'Submission berhasil disimpan.'
              }
            </p>
            <p className="font-body text-white/40 text-xs mb-6">
              Anda masih bisa mengedit submission sebelum deadline.
            </p>

            {/* Uploaded Files Summary */}
            {files.length > 0 && (
              <div className="mb-6 p-3 bg-white/[0.02] border border-white/5 rounded-xl text-left">
                <p className="font-body text-white/50 text-xs mb-2">Uploaded files:</p>
                {files.map((file, i) => (
                  <div key={i} className="flex items-center gap-2 py-1">
                    <FileText className="w-4 h-4 text-kath-gold flex-shrink-0" />
                    <span className="font-body text-white/70 text-xs truncate">{file.name}</span>
                    <span className="font-body text-white/30 text-xs ml-auto flex-shrink-0">{formatFileSize(file.size)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  loadData(); // Reload to get updated submission
                }}
                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white/70 font-body text-sm font-medium rounded-xl border border-white/10 transition-all"
              >
                Edit Submission
              </button>
              <button
                onClick={() => navigate(`/competition/${id}`)}
                className="flex-1 px-4 py-3 bg-kath-gold hover:bg-kath-gold-light text-kath-bg-dark font-body text-sm font-semibold rounded-xl transition-all"
              >
                Kembali ke Kompetisi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionForm;
