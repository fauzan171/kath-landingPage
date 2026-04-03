import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Send,
  File,
  Trash2
} from '../icons';
import {
  getCompetitionById,
  getSubmissionByCompetition,
  createSubmission,
  updateSubmission,
  addNotification,
  type Competition,
  type Submission
} from '../services/mockData';

interface FileUpload {
  id: string;
  name: string;
  size: string;
  type: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

const SubmissionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [existingSubmission, setExistingSubmission] = useState<Submission | null>(null);
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const comp = getCompetitionById(id);
      if (comp) {
        setCompetition(comp);
        const existing = getSubmissionByCompetition(id);
        if (existing) {
          setExistingSubmission(existing);
          setDescription(existing.description ?? '');
          setFiles((existing.files ?? []).map(f => ({
            id: f.id ?? `file_${Date.now()}`,
            name: f.name,
            size: typeof f.size === 'number' ? formatFileSize(f.size) : '0 Bytes',
            type: f.type ?? 'unknown',
            progress: 100,
            status: 'completed' as const
          })));
        }
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [id]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    Array.from(selectedFiles).forEach((file) => {
      // Check file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setError(`File ${file.name} terlalu besar. Maksimal 50MB.`);
        return;
      }

      const newFile: FileUpload = {
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type,
        progress: 0,
        status: 'uploading',
      };

      setFiles((prev) => [...prev, newFile]);

      // Simulate upload progress
      simulateUpload(newFile.id);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, progress: 100, status: 'completed' } : f
          )
        );
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, progress } : f))
        );
      }
    }, 200);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (files.length === 0) {
      setError('Please upload at least one file');
      return;
    }

    if (!description.trim()) {
      setError('Please provide a description');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const submissionData: Partial<Submission> = {
      competition_id: id!,
      task_id: 'task_test',
      team_id: 'team_test',
      description,
      status: 'submitted',
    };

    if (existingSubmission) {
      updateSubmission(existingSubmission.id, submissionData);
    } else {
      createSubmission(submissionData);
    }

    setIsSubmitting(false);
    setIsSuccess(true);

    addNotification({
      type: 'success',
      title: existingSubmission ? 'Submission Updated' : 'Submission Successful',
      message: `Your submission for ${competition?.name} has been ${existingSubmission ? 'updated' : 'received'}!`,
      read: false,
    });

    setTimeout(() => {
      navigate(`/competition/${id}`);
    }, 2000);
  };

  if (!competition) {
    return (
      <div className="min-h-screen bg-kath-bg-dark flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-kath-gold animate-spin mx-auto mb-4" />
          <p className="font-body text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-kath-bg-dark flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="font-display text-2xl text-white mb-2">
            {existingSubmission ? 'Submission Updated!' : 'Submission Successful!'}
          </h2>
          <p className="font-body text-white/60 mb-6">
            Your submission for {competition.name} has been {existingSubmission ? 'updated' : 'received'} successfully.
          </p>
          <button
            onClick={() => navigate(`/competition/${id}`)}
            className="px-6 py-3 bg-kath-gold hover:bg-kath-gold-light text-kath-bg-dark font-body font-medium rounded-full transition-all"
          >
            View Submission
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kath-bg-dark">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-kath-bg-dark/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <h1 className="font-display text-xl text-white">
                {existingSubmission ? 'Edit Submission' : 'Submit Entry'}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Competition Info */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-kath-gold/20 flex items-center justify-center">
                <FileText className="w-7 h-7 text-kath-gold" />
              </div>
              <div>
                <p className="font-body text-white/50 text-sm">Submitting for</p>
                <h2 className="font-display text-lg text-white">{competition.name}</h2>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
              <h3 className="font-display text-lg text-white mb-4">Upload Files</h3>
              
              {/* Upload Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/10 hover:border-kath-gold/50 rounded-xl p-8 text-center cursor-pointer transition-all"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-kath-gold/10 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-kath-gold" />
                </div>
                <p className="font-body text-white mb-2">Click to upload files</p>
                <p className="font-body text-white/50 text-sm">
                  PDF, ZIP, DOCX up to 50MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.zip,.doc,.docx,.jpg,.jpeg,.png"
                />
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-6 space-y-3">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-xl"
                    >
                      <div className="w-10 h-10 rounded-lg bg-kath-gold/10 flex items-center justify-center">
                        <File className="w-5 h-5 text-kath-gold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-white text-sm truncate">{file.name}</p>
                        <p className="font-body text-white/40 text-xs">{file.size}</p>
                        {file.status === 'uploading' && (
                          <div className="mt-2">
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-kath-gold rounded-full transition-all"
                                style={{ width: `${file.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
              <h3 className="font-display text-lg text-white mb-4">Description</h3>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl font-body text-white placeholder-white/50 focus:outline-none focus:border-kath-gold/50 resize-none"
                placeholder="Describe your submission, concept, and any additional information..."
              />
              <p className="mt-2 font-body text-white/30 text-xs text-right">
                {description.length}/1000 characters
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="font-body text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Requirements Checklist */}
            {competition.requirements && competition.requirements.length > 0 && (
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <h3 className="font-display text-lg text-white mb-4">Requirements Checklist</h3>
                <ul className="space-y-3">
                  {competition.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded border border-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      </div>
                      <span className="font-body text-white/70 text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => navigate(`/competition/${id}`)}
                className="flex-1 px-6 py-3 border border-white/10 text-white/70 hover:bg-white/5 rounded-xl font-body font-medium transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-kath-gold hover:bg-kath-gold-light disabled:bg-kath-gold/50 text-kath-bg-dark font-body font-medium rounded-xl transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {existingSubmission ? 'Update Submission' : 'Submit Entry'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SubmissionForm;
