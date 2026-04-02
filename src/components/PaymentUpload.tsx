/**
 * CIBC Power by KATH - Payment Upload Component
 *
 * Drag-and-drop file upload untuk bukti pembayaran
 * Validasi: PDF only, max 10MB
 */

import React, { useState, useCallback } from 'react';
import { Upload, CheckCircle, AlertCircle, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { uploadPaymentProof } from '@/services/cibc.service';

interface PaymentUploadProps {
  teamId: string;
  competitionId: string;
  onUploadSuccess?: (fileUrl: string) => void;
  existingPaymentUrl?: string;
  isEditable?: boolean;
}

const PaymentUpload: React.FC<PaymentUploadProps> = ({
  teamId,
  competitionId,
  onUploadSuccess,
  existingPaymentUrl,
  isEditable = true
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(existingPaymentUrl || null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Validasi file
  const validateFile = (file: File): string | null => {
    // Check file type - only image allowed
    if (!file.type.startsWith('image/')) {
      return 'File harus berupa gambar (JPG, PNG, dll)';
    }

    // Check file size - max 5MB
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return 'File tidak boleh lebih dari 5MB';
    }

    return null;
  };

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setError(null);

    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    const validationError = validateFile(droppedFile);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setFile(droppedFile);
    setPreviewUrl(URL.createObjectURL(droppedFile));
  }, []);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  // Upload file
  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const result = await uploadPaymentProof(file, teamId, competitionId);

      clearInterval(progressInterval);
      setUploadProgress(100);

      setUploadedUrl(result.fileUrl);
      setFile(null);

      toast.success('Bukti pembayaran berhasil diupload!');

      if (onUploadSuccess) {
        onUploadSuccess(result.fileUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload gagal');
      toast.error('Gagal mengupload bukti pembayaran');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Remove file
  const handleRemove = () => {
    setFile(null);
    setPreviewUrl(null);
    setError(null);
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (uploadedUrl && !isEditable) {
    // Show uploaded payment proof (non-editable)
    return (
      <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-green-800">Bukti Pembayaran Sudah Diupload</p>
            <a
              href={uploadedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-600 hover:underline"
            >
              Lihat gambar
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => e.preventDefault()}
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
          file
            ? 'border-[#FFB22C] bg-[#FFB22C]/5'
            : error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-200 bg-[#F4F6F8] hover:border-[#FFB22C] hover:bg-[#FFB22C]/5'
        } ${isUploading ? 'pointer-events-none opacity-70' : ''}`}
      >
        {/* Upload Icon */}
        <div className="flex flex-col items-center justify-center gap-4">
          {isUploading ? (
            <>
              <Loader2 className="w-12 h-12 text-[#FFB22C] animate-spin" />
              <p className="text-sm text-gray-600">Mengupload... {uploadProgress}%</p>
              {/* Progress Bar */}
              <div className="w-full max-w-xs h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FFB22C] transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </>
          ) : file ? (
            <>
              {/* Image Preview */}
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-48 rounded-xl border border-gray-200 shadow-sm"
                />
              )}
              <div className="text-center">
                <p className="font-semibold text-[#0F0F0F]">{file.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
              </div>
              <button
                onClick={handleRemove}
                className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
              >
                <X className="w-5 h-5 text-red-600" />
              </button>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400" />
              <div className="text-center">
                <p className="font-semibold text-[#0F0F0F]">
                  Drag & drop bukti pembayaran
                </p>
                <p className="text-sm text-gray-500">atau klik untuk memilih gambar</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 rounded-xl border border-red-200">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Requirements */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Upload className="w-4 h-4" />
        <span>Format: JPG, PNG, dll | Maksimal: 5MB</span>
      </div>

      {/* Upload Button */}
      {file && !isUploading && (
        <button
          onClick={handleUpload}
          className="w-full py-3.5 bg-[#FFB22C] hover:bg-[#FFB22C]/90 text-[#0F0F0F] font-body font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md shadow-[#FFB22C]/20"
        >
          <Upload className="w-4 h-4" />
          Upload Bukti Pembayaran
        </button>
      )}

      {/* Success State */}
      {uploadedUrl && isEditable && (
        <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-green-800">Bukti Pembayaran Berhasil Diupload</p>
                <a
                  href={uploadedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-600 hover:underline"
                >
                  Lihat gambar
                </a>
              </div>
            </div>
            {/* Optional: Allow re-upload */}
            <button
              onClick={() => setUploadedUrl(null)}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              Ganti gambar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentUpload;