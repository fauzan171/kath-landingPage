/**
 * CIBC Power by KATH - Registration Page
 *
 * Multi-step registration for Team Leaders only
 * Steps: Account -> Personal -> Team & Sub-Theme -> Team Members -> Documents -> Payment -> Review & Submit
 * Color Theme: Light Cream (#F9F8F6) & Dark Text (#0F0F0F) & Gold (#FFB22C)
 */

import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ChevronLeft, Check, Mail, User,
  GraduationCap, Users, Target, CreditCard, Upload,
  Info, AlertCircle, FileText, Building2, BookOpen,
  MessageCircle, ExternalLink, Phone,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '../../contexts/LanguageContext';
import { isSupabaseConfigured } from '@/config/environment';
import { supabase } from '@/lib/supabase';
import { uploadFileToR2 } from '@/lib/supabase';
import { supabaseAuthService } from '@/services/supabase.service';
import { competitionService, teamsService, paymentService } from '@/services/cibc.service';
import { useCSRFToken } from '@/components/CSRFProtectedForm';
import { registrationRateLimiter } from '@/utils/security';

// Password strength validation regex
const passwordRegex = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
};

// Custom password validation
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .refine(val => passwordRegex.uppercase.test(val), {
    message: 'Password must contain at least one uppercase letter',
  })
  .refine(val => passwordRegex.lowercase.test(val), {
    message: 'Password must contain at least one lowercase letter',
  })
  .refine(val => passwordRegex.number.test(val), {
    message: 'Password must contain at least one number',
  });

// Validation Schemas
const step1Schema = z.object({
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const step2Schema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  institution: z.string().min(1, 'Institution name is required'),
  studentId: z.string().min(1, 'Student ID is required'),
  major: z.string().optional(),
  phone: z.string().min(10, 'Invalid phone number'),
});

const step3Schema = z.object({
  subTheme: z.enum(['Energy', 'Health', 'Food', 'Finance', 'Beauty', 'Manufacture']),
  teamName: z.string().min(2, 'Team name is required'),
});

const step4Schema = z.object({
  member1FullName: z.string().min(2, 'Name must be at least 2 characters'),
  member1Institution: z.string().min(1, 'Institution is required'),
  member1StudentId: z.string().min(1, 'Student ID is required'),
  member2FullName: z.string().min(2, 'Name must be at least 2 characters'),
  member2Institution: z.string().min(1, 'Institution is required'),
  member2StudentId: z.string().min(1, 'Student ID is required'),
});

// step5Schema not used - files validated manually in nextStep

const step6Schema = z.object({
  paymentFile: z.any().optional(),
  agreeToPayment: z.boolean().refine(val => val === true, {
    message: 'You must confirm payment submission',
  }),
});

// Sub-theme options with labels and icons
const SUB_THEMES = [
  { value: 'Energy' as const, label: 'Energy', labelId: 'Energi', emoji: '⚡' },
  { value: 'Health' as const, label: 'Health', labelId: 'Kesehatan', emoji: '🏥' },
  { value: 'Food' as const, label: 'Food', labelId: 'Pangan', emoji: '🍽️' },
  { value: 'Finance' as const, label: 'Finance', labelId: 'Keuangan', emoji: '💰' },
  { value: 'Beauty' as const, label: 'Beauty', labelId: 'Kecantikan', emoji: '✨' },
  { value: 'Manufacture' as const, label: 'Manufacture', labelId: 'Manufaktur', emoji: '🏭' },
];

const TOTAL_STEPS = 7;

const CIBCRegister = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token: csrfToken } = useCSRFToken();

  // File states
  const [studentCardsFile, setStudentCardsFile] = useState<File | null>(null);
  const [instagramProofFile, setInstagramProofFile] = useState<File | null>(null);
  const [twibbonProofFile, setTwibbonProofFile] = useState<File | null>(null);
  const [bmcFile, setBmcFile] = useState<File | null>(null);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Form for each step
  const step1Form = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: { email: '', password: '', confirmPassword: '', agreeToTerms: false },
  });

  const step2Form = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: { fullName: '', institution: '', studentId: '', major: '', phone: '' },
  });

  const step3Form = useForm({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      subTheme: undefined as unknown as 'Energy' | 'Health' | 'Food' | 'Finance' | 'Beauty' | 'Manufacture',
      teamName: '',
    },
  });

  const step4Form = useForm({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      member1FullName: '',
      member1Institution: '',
      member1StudentId: '',
      member2FullName: '',
      member2Institution: '',
      member2StudentId: '',
    },
  });

  // step5Form not needed - files are validated manually in nextStep

  const step6Form = useForm({
    resolver: zodResolver(step6Schema),
    defaultValues: {
      paymentFile: null,
      agreeToPayment: false,
    },
  });

  // Step navigation
  const nextStep = useCallback(async () => {
    let isValid = false;

    switch (currentStep) {
      case 1: isValid = await step1Form.trigger(); break;
      case 2: isValid = await step2Form.trigger(); break;
      case 3: isValid = await step3Form.trigger(); break;
      case 4: isValid = await step4Form.trigger(); break;
      case 5: {
        // Validate files manually
        if (!studentCardsFile || !instagramProofFile || !twibbonProofFile || !bmcFile) {
          toast.error(language === 'id' ? 'Semua dokumen wajib diupload' : 'All documents are required');
          return;
        }
        isValid = true;
        break;
      }
      case 6: isValid = await step6Form.trigger(); break;
    }

    if (isValid && currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep, step1Form, step2Form, step3Form, step4Form, step6Form, studentCardsFile, instagramProofFile, twibbonProofFile, bmcFile, language]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  // File validation helpers are used inline in FileUploadZone component

  // Final submission
  const onSubmit = async () => {
    // Rate limiting check
    const step1Data = step1Form.getValues();
    const rateLimitResult = registrationRateLimiter.checkLimit(step1Data.email);
    if (!rateLimitResult.allowed) {
      const retryMinutes = Math.ceil((rateLimitResult.retryAfter || 300000) / 60000);
      toast.error(language === 'id' ? 'Terlalu banyak percobaan' : 'Too many attempts', {
        description: language === 'id'
          ? `Silakan coba lagi dalam ${retryMinutes} menit.`
          : `Please try again in ${retryMinutes} minute(s).`,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Verify CSRF token is present
      if (!csrfToken) {
        toast.error(language === 'id' ? 'Validasi keamanan gagal' : 'Security validation failed');
        setIsSubmitting(false);
        return;
      }
      const s1 = step1Form.getValues();
      const s2 = step2Form.getValues();
      const s3 = step3Form.getValues();
      const s4 = step4Form.getValues();
      const s6 = step6Form.getValues();

      // Validate payment confirmation
      if (!s6.agreeToPayment) {
        toast.error(language === 'id' ? 'Harap konfirmasi pembayaran' : 'Please confirm payment');
        setIsSubmitting(false);
        return;
      }

      if (isSupabaseConfigured() && supabase) {
        // 1. Sign up user - trigger will auto-create public.users entry
        const { user } = await supabaseAuthService.signUp(
          s1.email, s1.password, { name: s2.fullName, category: 'student' }
        );
        if (!user) throw new Error('Failed to create user account');

        const competition = await competitionService.getActive();
        if (!competition) throw new Error('Competition not found');

        // 2. Update user with additional data
        const { error: userError } = await supabase.from('users').update({
          phone: s2.phone,
          institution: s2.institution,
          category: 'student',
        }).eq('id', user.id);
        if (userError) console.error('Error updating user record:', userError);

        // 3. Create team with name, sub_theme, institution
        const team = await teamsService.create({
          competition_id: competition.id,
          name: s3.teamName,
          category: 'student',
          institution: s2.institution,
          status: 'pending',
          payment_status: 'pending',
        });

        // Update team with sub_theme
        const { error: teamUpdateError } = await supabase
          .from('teams')
          .update({ sub_theme: s3.subTheme })
          .eq('id', team.id);
        if (teamUpdateError) console.error('Error updating team sub_theme:', teamUpdateError);

        // 4. Add leader as team member
        const { error: leaderError } = await supabase
          .from('team_members')
          .insert({
            team_id: team.id,
            user_id: user.id,
            full_name: s2.fullName,
            email: s1.email,
            phone: s2.phone,
            institution: s2.institution,
            student_id: s2.studentId,
            major: s2.major || null,
            role: 'leader',
            is_active: true,
          });
        if (leaderError) console.error('Error adding leader as team member:', leaderError);

        // 5. Add member 1 and member 2 as team members
        const members = [
          {
            team_id: team.id,
            full_name: s4.member1FullName,
            institution: s4.member1Institution,
            student_id: s4.member1StudentId,
            role: 'member',
            is_active: true,
          },
          {
            team_id: team.id,
            full_name: s4.member2FullName,
            institution: s4.member2Institution,
            student_id: s4.member2StudentId,
            role: 'member',
            is_active: true,
          },
        ];
        const { error: membersError } = await supabase
          .from('team_members')
          .insert(members);
        if (membersError) console.error('Error adding team members:', membersError);

        // 6. Upload all documents (step5 files) to R2
        try {
          const docPrefix = `registration-docs/${team.id}`;
          const [studentCardsResult, instagramResult, twibbonResult, bmcResult] = await Promise.all([
            uploadFileToR2(studentCardsFile!, `${docPrefix}/student-cards`, team.id),
            uploadFileToR2(instagramProofFile!, `${docPrefix}/instagram-proof`, team.id),
            uploadFileToR2(twibbonProofFile!, `${docPrefix}/twibbon-proof`, team.id),
            uploadFileToR2(bmcFile!, `${docPrefix}/bmc`, team.id),
          ]);

          // Update team record with document URLs
          const { error: docsUpdateError } = await supabase
            .from('teams')
            .update({
              student_cards_url: studentCardsResult.fileUrl,
              instagram_proof_url: instagramResult.fileUrl,
              twibbon_proof_url: twibbonResult.fileUrl,
              bmc_url: bmcResult.fileUrl,
            })
            .eq('id', team.id);
          if (docsUpdateError) console.error('Error updating team documents:', docsUpdateError);
        } catch (docError) {
          console.error('Document upload error:', docError);
          toast.warning(
            language === 'id' ? 'Beberapa dokumen gagal diupload' : 'Some documents failed to upload',
            { description: language === 'id' ? 'Registrasi tetap tersimpan. Anda dapat mengupload ulang di dashboard.' : 'Registration saved. You can re-upload in dashboard.' }
          );
        }

        // 7. Upload payment proof and update team payment_status
        if (paymentFile) {
          try {
            const paymentResult = await paymentService.uploadProof(
              paymentFile,
              team.id,
              competition.id
            );
            await paymentService.updateTeamPayment(
              team.id,
              paymentResult.fileUrl,
              paymentResult.storageKey
            );
            toast.success(language === 'id' ? 'Bukti pembayaran berhasil diupload' : 'Payment proof uploaded');
          } catch (uploadError) {
            console.error('Payment upload error:', uploadError);
            toast.warning(
              language === 'id' ? 'Gagal upload bukti pembayaran, tapi registrasi berhasil' : 'Payment upload failed, but registration successful',
              { description: language === 'id' ? 'Anda dapat upload bukti pembayaran di dashboard' : 'You can upload payment proof in dashboard' }
            );
          }
        }

        // Sign out the user - they need admin approval first
        await supabaseAuthService.signOut();

        toast.success(
          language === 'id' ? 'Registrasi berhasil!' : 'Registration successful!',
          {
            description: language === 'id'
              ? 'Akun Anda sedang menunggu persetujuan admin. Konfirmasi akan dikirim via WhatsApp.'
              : 'Your account is pending admin approval. Confirmation will be sent via WhatsApp.'
          }
        );

        // Redirect to pending approval page
        navigate('/cibc/pending-approval');
      } else {
        // Supabase not configured - cannot register
        toast.error(language === 'id' ? 'Konfigurasi server belum selesai' : 'Server not configured', {
          description: language === 'id'
            ? 'Registrasi tidak tersedia saat ini. Hubungi panitia.'
            : 'Registration is not available right now. Please contact the organizer.'
        });
        setIsSubmitting(false);
        return;
      }
    } catch (error) {
      // Don't log full error details
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Check if user already exists - redirect to login
      if (errorMessage.includes('sudah terdaftar') || errorMessage.includes('already')) {
        toast.error(
          language === 'id' ? 'Email sudah terdaftar!' : 'Email already registered!',
          {
            description: language === 'id'
              ? 'Silakan login dengan akun Anda.'
              : 'Please login with your existing account.',
            action: {
              label: language === 'id' ? 'Login' : 'Login',
              onClick: () => navigate('/cibc/login'),
            },
          }
        );
      } else {
        toast.error(language === 'id' ? 'Registrasi gagal. Silakan coba lagi.' : 'Registration failed. Please try again.', { description: errorMessage });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step labels
  const steps = [
    { number: 1, label: language === 'id' ? 'Akun' : 'Account', icon: Mail },
    { number: 2, label: language === 'id' ? 'Personal' : 'Personal', icon: User },
    { number: 3, label: language === 'id' ? 'Tim' : 'Team', icon: Users },
    { number: 4, label: language === 'id' ? 'Anggota' : 'Members', icon: GraduationCap },
    { number: 5, label: language === 'id' ? 'Dokumen' : 'Documents', icon: FileText },
    { number: 6, label: language === 'id' ? 'Bayar' : 'Payment', icon: CreditCard },
    { number: 7, label: language === 'id' ? 'Review' : 'Review', icon: Check },
  ];

  // Reusable file upload component
  const FileUploadZone = ({
    label,
    file,
    onFileSet,
    accept = '.pdf',
    maxSizeMB = 10,
    required = true,
    hint,
  }: {
    label: string;
    file: File | null;
    onFileSet: (f: File | null) => void;
    accept?: string;
    maxSizeMB?: number;
    required?: boolean;
    hint?: string;
  }) => (
    <div className="mb-5">
      <label className="block font-semibold text-sm text-[#0F0F0F] mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}
      <div
        onDrop={(e) => {
          e.preventDefault();
          const droppedFile = e.dataTransfer.files[0];
          if (droppedFile) {
            if (accept === '.pdf' && droppedFile.type !== 'application/pdf') {
              toast.error(language === 'id' ? 'Format file harus PDF' : 'File must be PDF');
              return;
            }
            if (droppedFile.size > maxSizeMB * 1024 * 1024) {
              toast.error(language === 'id' ? `File maksimal ${maxSizeMB}MB` : `File max ${maxSizeMB}MB`);
              return;
            }
            onFileSet(droppedFile);
            toast.success(language === 'id' ? 'File berhasil dipilih' : 'File selected');
          }
        }}
        onDragOver={(e) => e.preventDefault()}
        className={`relative border-2 border-dashed rounded-2xl p-5 transition-all ${
          file ? 'border-[#FFB22C] bg-[#FFB22C]/5' : 'border-gray-200 bg-[#F4F6F8] hover:border-[#FFB22C]'
        }`}
      >
        <input
          type="file"
          accept={accept}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              if (accept === '.pdf' && f.type !== 'application/pdf') {
                toast.error(language === 'id' ? 'Format file harus PDF' : 'File must be PDF');
                return;
              }
              if (f.size > maxSizeMB * 1024 * 1024) {
                toast.error(language === 'id' ? `File maksimal ${maxSizeMB}MB` : `File max ${maxSizeMB}MB`);
                return;
              }
              onFileSet(f);
            }
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center gap-2">
          <Upload className="w-7 h-7 text-gray-400" />
          {file ? (
            <div className="text-center">
              <p className="font-semibold text-[#0F0F0F] text-sm">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
              <button
                onClick={(e) => { e.stopPropagation(); onFileSet(null); }}
                className="mt-1 text-xs text-red-500 hover:underline"
              >
                {language === 'id' ? 'Hapus file' : 'Remove file'}
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="font-semibold text-[#0F0F0F] text-sm">
                {language === 'id' ? 'Drag & drop atau klik untuk upload' : 'Drag & drop or click to upload'}
              </p>
              <p className="text-xs text-gray-500">PDF, max {maxSizeMB}MB</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white relative py-6 sm:py-10 px-4 sm:px-6 lg:px-8 font-body flex flex-col justify-center overflow-hidden">

      {/* Main Card Container */}
      <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl sm:rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-4 sm:p-10 lg:p-12 relative z-10 border border-gray-100">

        {/* Header Grid: Back | Title | Sign In */}
        <div className="grid grid-cols-3 items-start mb-6 sm:mb-10">
          <div className="flex justify-start">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-gray-500 hover:text-[#0F0F0F] transition-colors"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">{language === 'id' ? 'Kembali' : 'Back'}</span>
            </button>
          </div>
          <div className="flex justify-center text-center">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-[#0F0F0F]">
              {language === 'id' ? 'Pendaftaran' : 'Sign up'}
            </h1>
          </div>
          <div className="flex justify-end text-right">
            <p className="text-xs sm:text-sm font-medium text-gray-500">
              <span className="hidden sm:inline">{language === 'id' ? 'Sudah punya akun? ' : 'Already a Member? '}</span>
              <button
                onClick={() => navigate('/cibc/login')}
                className="font-bold text-[#FFB22C] hover:text-[#FFB22C]/80 transition-colors"
              >
                {language === 'id' ? 'Masuk' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>

        {/* Progress Tracker (Horizontal Line with Circles) */}
        <div className="relative max-w-4xl mx-auto mb-8 sm:mb-14 px-2 sm:px-10">
          {/* Background Line */}
          <div className="absolute top-[14px] sm:top-[18px] left-[5%] right-[5%] h-[2px] bg-[#F4F6F8] -z-10" />
          {/* Active Line */}
          <div
            className="absolute top-[14px] sm:top-[18px] left-[5%] h-[2px] bg-[#FFB22C] transition-all duration-500 -z-10"
            style={{ width: `${((currentStep - 1) / (TOTAL_STEPS - 1)) * 90}%` }}
          />

          <div className="flex justify-between">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center w-10 sm:w-16">
                <div
                  className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${currentStep >= step.number
                    ? 'bg-[#FFB22C] text-white shadow-md shadow-[#FFB22C]/30'
                    : 'bg-[#F4F6F8] text-gray-400'
                    }`}
                >
                  {currentStep > step.number ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : step.number}
                </div>
                <span className={`mt-1 sm:mt-2 text-[9px] sm:text-xs font-semibold text-center ${currentStep >= step.number ? 'text-[#0F0F0F]' : 'text-gray-400'
                  }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Form Wrapper */}
        <div className="max-w-4xl mx-auto">

          {/* ===== STEP 1: Account ===== */}
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-lg sm:text-xl font-bold text-[#0F0F0F] mb-4 sm:mb-6 border-b border-gray-100 pb-4">
                {language === 'id' ? 'Detail Akun' : 'Account Details'}
              </h2>

              <div className="bg-[#F9F8F6] rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 border border-gray-200">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#FFB22C] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-[#0F0F0F] text-sm mb-1">
                      {language === 'id' ? 'Yang Perlu Disiapkan' : 'What You\'ll Need'}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {language === 'id'
                        ? 'Siapkan alamat email yang valid dan buat password yang kuat untuk akun Anda.'
                        : 'Prepare a valid email address and create a strong password for your account.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-sm text-[#0F0F0F] mb-2">Email</label>
                  <input
                    type="email"
                    {...step1Form.register('email')}
                    className="w-full bg-[#F4F6F8] px-4 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm"
                    placeholder={language === 'id' ? 'Masukkan alamat email' : 'Enter Email Address'}
                  />
                  <p className="mt-1.5 text-xs text-gray-400">
                    {language === 'id'
                      ? 'Gunakan email aktif yang bisa diakses untuk verifikasi'
                      : 'Use an active email address that you can access for verification'}
                  </p>
                  {step1Form.formState.errors.email && (
                    <p className="mt-1 text-xs text-red-500">{step1Form.formState.errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className="block font-semibold text-sm text-[#0F0F0F] mb-2">
                    {language === 'id' ? 'Password' : 'Password'}
                  </label>
                  <input
                    type="password"
                    {...step1Form.register('password')}
                    className="w-full bg-[#F4F6F8] px-4 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm"
                    placeholder={language === 'id' ? 'Buat Password' : 'Create Password'}
                  />
                  <p className="mt-1.5 text-xs text-gray-400">
                    {language === 'id'
                      ? 'Minimal 8 karakter, huruf besar, huruf kecil, dan angka'
                      : 'Min 8 characters, uppercase, lowercase, and a number'}
                  </p>
                  {step1Form.formState.errors.password && (
                    <p className="mt-1 text-xs text-red-500">{step1Form.formState.errors.password.message}</p>
                  )}
                </div>
                <div>
                  <label className="block font-semibold text-sm text-[#0F0F0F] mb-2">
                    {language === 'id' ? 'Konfirmasi Password' : 'Confirm Password'}
                  </label>
                  <input
                    type="password"
                    {...step1Form.register('confirmPassword')}
                    className="w-full bg-[#F4F6F8] px-4 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm"
                    placeholder={language === 'id' ? 'Ketik ulang password' : 'Confirm Password'}
                  />
                  {step1Form.formState.errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">{step1Form.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
                <div className="sm:col-span-2 flex items-start gap-3 mt-2">
                  <input
                    type="checkbox"
                    {...step1Form.register('agreeToTerms')}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-[#FFB22C] focus:ring-[#FFB22C] cursor-pointer"
                  />
                  <label className="text-sm text-gray-500 cursor-pointer">
                    {language === 'id'
                      ? 'Saya menyetujui syarat dan ketentuan kompetisi.'
                      : 'I agree to the terms and conditions.'}
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ===== STEP 2: Personal Info (Leader) ===== */}
          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-lg sm:text-xl font-bold text-[#0F0F0F] mb-4 sm:mb-6 border-b border-gray-100 pb-4">
                {language === 'id' ? 'Informasi Personal (Ketua Tim)' : 'Personal Info (Team Leader)'}
              </h2>

              <div className="bg-[#F9F8F6] rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 border border-gray-200">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-[#FFB22C] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-[#0F0F0F] text-sm mb-1">
                      {language === 'id' ? 'Data Ketua Tim' : 'Team Leader Details'}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {language === 'id'
                        ? 'Lengkapi data diri ketua tim. Pastikan sesuai dengan kartu mahasiswa.'
                        : 'Fill in the team leader\'s personal details. Ensure it matches your student ID card.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-sm text-[#0F0F0F] mb-2">
                    {language === 'id' ? 'Nama Lengkap' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    {...step2Form.register('fullName')}
                    className="w-full bg-[#F4F6F8] px-4 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm"
                    placeholder={language === 'id' ? 'Masukkan nama lengkap' : 'Enter Full Name'}
                  />
                  <p className="mt-1.5 text-xs text-gray-400">
                    {language === 'id' ? 'Sesuai KTP/Kartu Mahasiswa' : 'As per your ID card/Student card'}
                  </p>
                  {step2Form.formState.errors.fullName && (
                    <p className="mt-1 text-xs text-red-500">{step2Form.formState.errors.fullName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block font-semibold text-sm text-[#0F0F0F] mb-2">
                    {language === 'id' ? 'Institusi / Universitas' : 'Institution / University'}
                  </label>
                  <input
                    type="text"
                    {...step2Form.register('institution')}
                    className="w-full bg-[#F4F6F8] px-4 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm"
                    placeholder={language === 'id' ? 'Contoh: Institut Teknologi Bandung' : 'e.g. Institut Teknologi Bandung'}
                  />
                  {step2Form.formState.errors.institution && (
                    <p className="mt-1 text-xs text-red-500">{step2Form.formState.errors.institution.message}</p>
                  )}
                </div>
                <div>
                  <label className="block font-semibold text-sm text-[#0F0F0F] mb-2">
                    {language === 'id' ? 'NIM / Student ID' : 'Student ID Number'}
                  </label>
                  <input
                    type="text"
                    {...step2Form.register('studentId')}
                    className="w-full bg-[#F4F6F8] px-4 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm"
                    placeholder={language === 'id' ? 'Masukkan NIM' : 'Enter Student ID'}
                  />
                  {step2Form.formState.errors.studentId && (
                    <p className="mt-1 text-xs text-red-500">{step2Form.formState.errors.studentId.message}</p>
                  )}
                </div>
                <div>
                  <label className="block font-semibold text-sm text-[#0F0F0F] mb-2">
                    {language === 'id' ? 'Jurusan / Program Studi' : 'Major / Study Program'}
                  </label>
                  <input
                    type="text"
                    {...step2Form.register('major')}
                    className="w-full bg-[#F4F6F8] px-4 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm"
                    placeholder={language === 'id' ? 'Contoh: Teknik Informatika' : 'e.g. Computer Science'}
                  />
                  <p className="mt-1.5 text-xs text-gray-400">
                    {language === 'id' ? 'Opsional' : 'Optional'}
                  </p>
                </div>
                <div>
                  <label className="block font-semibold text-sm text-[#0F0F0F] mb-2">
                    {language === 'id' ? 'Nomor Telepon' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    {...step2Form.register('phone')}
                    className="w-full bg-[#F4F6F8] px-4 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm"
                    placeholder={language === 'id' ? '+62 812 xxxx xxxx' : '+62 812 xxxx xxxx'}
                  />
                  {step2Form.formState.errors.phone && (
                    <p className="mt-1 text-xs text-red-500">{step2Form.formState.errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===== STEP 3: Team & Sub-Theme ===== */}
          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-lg sm:text-xl font-bold text-[#0F0F0F] mb-4 sm:mb-6 border-b border-gray-100 pb-4">
                {language === 'id' ? 'Tim & Sub-Tema' : 'Team & Sub-Theme'}
              </h2>

              {/* Category Info */}
              <div className="bg-amber-50 rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 border border-amber-200">
                <div className="flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-amber-800 text-sm mb-1">
                      {language === 'id' ? 'Kategori: Mahasiswa (D3/D4/S1)' : 'Category: Student (Diploma/Undergraduate)'}
                    </h3>
                    <p className="text-xs sm:text-sm text-amber-700">
                      {language === 'id'
                        ? 'Peserta harus merupakan mahasiswa aktif D3, D4, atau S1.'
                        : 'Participants must be active diploma or undergraduate students.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sub-Theme Selection */}
              <div className="mb-6 sm:mb-8">
                <label className="block font-semibold text-sm text-[#0F0F0F] mb-3">
                  {language === 'id' ? 'Pilih Sub-Tema' : 'Select Sub-Theme'} <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {SUB_THEMES.map((theme) => {
                    const isSelected = step3Form.watch('subTheme') === theme.value;
                    return (
                      <button
                        key={theme.value}
                        type="button"
                        onClick={() => step3Form.setValue('subTheme', theme.value, { shouldValidate: true })}
                        className={`p-4 rounded-xl border-2 transition-all text-center ${
                          isSelected
                            ? 'border-[#FFB22C] bg-[#FFB22C]/10 shadow-md shadow-[#FFB22C]/20'
                            : 'border-gray-200 bg-[#F4F6F8] hover:border-[#FFB22C]/50'
                        }`}
                      >
                        <div className="text-2xl mb-1">{theme.emoji}</div>
                        <p className={`text-sm font-semibold ${isSelected ? 'text-[#FFB22C]' : 'text-[#0F0F0F]'}`}>
                          {language === 'id' ? theme.labelId : theme.label}
                        </p>
                      </button>
                    );
                  })}
                </div>
                {step3Form.formState.errors.subTheme && (
                  <p className="mt-2 text-xs text-red-500">{step3Form.formState.errors.subTheme.message}</p>
                )}
              </div>

              {/* Team Name */}
              <div>
                <label className="block font-semibold text-sm text-[#0F0F0F] mb-2">
                  {language === 'id' ? 'Nama Tim' : 'Team Name'}
                </label>
                <input
                  type="text"
                  {...step3Form.register('teamName')}
                  className="w-full bg-[#F4F6F8] px-4 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm"
                  placeholder={language === 'id' ? 'Masukkan Nama Tim' : 'Enter Team Name'}
                />
                <p className="mt-1.5 text-xs text-gray-400">
                  {language === 'id'
                    ? 'Nama tim yang unik dan kreatif (tidak dapat diubah setelah submit)'
                    : 'A unique and creative team name (cannot be changed after submission)'}
                </p>
                {step3Form.formState.errors.teamName && (
                  <p className="mt-1 text-xs text-red-500">{step3Form.formState.errors.teamName.message}</p>
                )}
              </div>
            </div>
          )}

          {/* ===== STEP 4: Team Members ===== */}
          {currentStep === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-lg sm:text-xl font-bold text-[#0F0F0F] mb-4 sm:mb-6 border-b border-gray-100 pb-4">
                {language === 'id' ? 'Anggota Tim' : 'Team Members'}
              </h2>

              <div className="bg-blue-50 rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 border border-blue-200">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-800 text-sm mb-1">
                      {language === 'id' ? 'Anggota Tim (2 orang)' : 'Team Members (2 people)'}
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-700">
                      {language === 'id'
                        ? 'Tambahkan 2 anggota tim. Anggota boleh dari jurusan berbeda dalam universitas yang sama.'
                        : 'Add 2 team members. Members can be from different majors within the same university.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Member 1 */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-full bg-[#FFB22C] text-white flex items-center justify-center text-xs font-bold">1</div>
                  <h3 className="font-semibold text-[#0F0F0F] text-sm">
                    {language === 'id' ? 'Anggota 1' : 'Member 1'}
                  </h3>
                </div>
                <div className="grid sm:grid-cols-3 gap-4 pl-9">
                  <div>
                    <label className="block font-semibold text-xs text-[#0F0F0F] mb-1.5">
                      {language === 'id' ? 'Nama Lengkap' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      {...step4Form.register('member1FullName')}
                      className="w-full bg-[#F4F6F8] px-4 py-3 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm"
                      placeholder={language === 'id' ? 'Nama lengkap' : 'Full name'}
                    />
                    {step4Form.formState.errors.member1FullName && (
                      <p className="mt-1 text-xs text-red-500">{step4Form.formState.errors.member1FullName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-semibold text-xs text-[#0F0F0F] mb-1.5">
                      {language === 'id' ? 'Institusi' : 'Institution'}
                    </label>
                    <input
                      type="text"
                      {...step4Form.register('member1Institution')}
                      className="w-full bg-[#F4F6F8] px-4 py-3 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm"
                      placeholder={language === 'id' ? 'Nama institusi' : 'Institution name'}
                    />
                    {step4Form.formState.errors.member1Institution && (
                      <p className="mt-1 text-xs text-red-500">{step4Form.formState.errors.member1Institution.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-semibold text-xs text-[#0F0F0F] mb-1.5">
                      {language === 'id' ? 'NIM / Student ID' : 'Student ID'}
                    </label>
                    <input
                      type="text"
                      {...step4Form.register('member1StudentId')}
                      className="w-full bg-[#F4F6F8] px-4 py-3 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm"
                      placeholder={language === 'id' ? 'NIM' : 'Student ID'}
                    />
                    {step4Form.formState.errors.member1StudentId && (
                      <p className="mt-1 text-xs text-red-500">{step4Form.formState.errors.member1StudentId.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Member 2 */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-full bg-[#FFB22C] text-white flex items-center justify-center text-xs font-bold">2</div>
                  <h3 className="font-semibold text-[#0F0F0F] text-sm">
                    {language === 'id' ? 'Anggota 2' : 'Member 2'}
                  </h3>
                </div>
                <div className="grid sm:grid-cols-3 gap-4 pl-9">
                  <div>
                    <label className="block font-semibold text-xs text-[#0F0F0F] mb-1.5">
                      {language === 'id' ? 'Nama Lengkap' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      {...step4Form.register('member2FullName')}
                      className="w-full bg-[#F4F6F8] px-4 py-3 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm"
                      placeholder={language === 'id' ? 'Nama lengkap' : 'Full name'}
                    />
                    {step4Form.formState.errors.member2FullName && (
                      <p className="mt-1 text-xs text-red-500">{step4Form.formState.errors.member2FullName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-semibold text-xs text-[#0F0F0F] mb-1.5">
                      {language === 'id' ? 'Institusi' : 'Institution'}
                    </label>
                    <input
                      type="text"
                      {...step4Form.register('member2Institution')}
                      className="w-full bg-[#F4F6F8] px-4 py-3 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm"
                      placeholder={language === 'id' ? 'Nama institusi' : 'Institution name'}
                    />
                    {step4Form.formState.errors.member2Institution && (
                      <p className="mt-1 text-xs text-red-500">{step4Form.formState.errors.member2Institution.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-semibold text-xs text-[#0F0F0F] mb-1.5">
                      {language === 'id' ? 'NIM / Student ID' : 'Student ID'}
                    </label>
                    <input
                      type="text"
                      {...step4Form.register('member2StudentId')}
                      className="w-full bg-[#F4F6F8] px-4 py-3 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm"
                      placeholder={language === 'id' ? 'NIM' : 'Student ID'}
                    />
                    {step4Form.formState.errors.member2StudentId && (
                      <p className="mt-1 text-xs text-red-500">{step4Form.formState.errors.member2StudentId.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== STEP 5: Documents ===== */}
          {currentStep === 5 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-lg sm:text-xl font-bold text-[#0F0F0F] mb-4 sm:mb-6 border-b border-gray-100 pb-4">
                {language === 'id' ? 'Dokumen Pendukung' : 'Supporting Documents'}
              </h2>

              <div className="bg-[#F9F8F6] rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 border border-gray-200">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-[#FFB22C] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-[#0F0F0F] text-sm mb-1">
                      {language === 'id' ? 'Dokumen Wajib' : 'Required Documents'}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {language === 'id'
                        ? 'Upload semua dokumen yang diperlukan dalam format PDF.'
                        : 'Upload all required documents in PDF format.'}
                    </p>
                  </div>
                </div>
              </div>

              <FileUploadZone
                label={language === 'id' ? 'Kartu Mahasiswa (Gabungan 3 anggota)' : 'Student ID Cards (All 3 members combined)'}
                file={studentCardsFile}
                onFileSet={setStudentCardsFile}
                accept=".pdf"
                maxSizeMB={10}
                hint={language === 'id'
                  ? 'Gabungkan foto/scan KTM seluruh anggota (ketua + 2 anggota) menjadi 1 file PDF. Maks 10MB.'
                  : 'Combine all members\' student ID cards into 1 PDF file. Max 10MB.'}
              />

              <FileUploadZone
                label={language === 'id' ? 'Bukti Follow Instagram' : 'Instagram Follow Proof'}
                file={instagramProofFile}
                onFileSet={setInstagramProofFile}
                accept=".pdf"
                maxSizeMB={10}
                hint={language === 'id'
                  ? 'Screenshot bukti follow @kath.eventorganizer & @innovatewith.cibc. Maks 10MB.'
                  : 'Screenshot proof of following @kath.eventorganizer & @innovatewith.cibc. Max 10MB.'}
              />

              <FileUploadZone
                label={language === 'id' ? 'Bukti Upload Twibbon' : 'Twibbon Upload Proof'}
                file={twibbonProofFile}
                onFileSet={setTwibbonProofFile}
                accept=".pdf"
                maxSizeMB={100}
                hint={language === 'id'
                  ? 'Screenshot bukti upload twibbon di Instagram Story/Feed. Maks 100MB.'
                  : 'Screenshot proof of twibbon upload on Instagram Story/Feed. Max 100MB.'}
              />

              <FileUploadZone
                label={language === 'id' ? 'Business Model Canvas (BMC)' : 'Business Model Canvas (BMC)'}
                file={bmcFile}
                onFileSet={setBmcFile}
                accept=".pdf"
                maxSizeMB={100}
                hint={language === 'id'
                  ? 'Upload BMC tim Anda dalam format PDF. Maks 100MB.'
                  : 'Upload your team\'s BMC in PDF format. Max 100MB.'}
              />
            </div>
          )}

          {/* ===== STEP 6: Payment ===== */}
          {currentStep === 6 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-lg sm:text-xl font-bold text-[#0F0F0F] mb-4 sm:mb-6 border-b border-gray-100 pb-4">
                {language === 'id' ? 'Pembayaran' : 'Payment'}
              </h2>

              {/* Pricing Tiers */}
              <div className="bg-amber-50 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-amber-200">
                <div className="flex items-start gap-3 sm:gap-4">
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-3 text-sm sm:text-base">
                      {language === 'id' ? 'Biaya Registrasi (Per Tim)' : 'Registration Fee (Per Team)'}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">Early Bird</span>
                        <span className="text-sm font-semibold text-amber-800">Rp 100.000</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Wave 1</span>
                        <span className="text-sm font-semibold text-amber-800">Rp 125.000</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">Wave 2</span>
                        <span className="text-sm font-semibold text-amber-800">Rp 150.000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods - Bank Cards */}
              <div className="mb-6">
                <h3 className="font-semibold text-sm text-[#0F0F0F] mb-4">
                  {language === 'id' ? 'Metode Pembayaran' : 'Payment Methods'}
                </h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  {/* Bank Mandiri */}
                  <div className="bg-[#F4F6F8] rounded-xl p-4 border border-gray-200 hover:border-[#FFB22C]/50 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <img src="/images/banks/mandiri.png" alt="Bank Mandiri" className="h-8 w-auto object-contain" />
                      <span className="font-semibold text-sm text-[#0F0F0F]">Bank Mandiri</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">{language === 'id' ? 'Nomor Rekening' : 'Account Number'}</p>
                      <p className="font-mono text-sm font-bold text-[#0F0F0F] tracking-wider">1170012915260</p>
                      <p className="text-xs text-gray-500">{language === 'id' ? 'Atas Nama' : 'Account Holder'}</p>
                      <p className="text-sm font-semibold text-[#0F0F0F]">Aldhi F.</p>
                    </div>
                  </div>

                  {/* OVO */}
                  <div className="bg-[#F4F6F8] rounded-xl p-4 border border-gray-200 hover:border-[#FFB22C]/50 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <img src="/images/banks/ovo.png" alt="OVO" className="h-8 w-auto object-contain" />
                      <span className="font-semibold text-sm text-[#0F0F0F]">OVO</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">{language === 'id' ? 'Nomor Telepon' : 'Phone Number'}</p>
                      <p className="font-mono text-sm font-bold text-[#0F0F0F] tracking-wider">085770051330</p>
                      <p className="text-xs text-gray-500">{language === 'id' ? 'Atas Nama' : 'Account Holder'}</p>
                      <p className="text-sm font-semibold text-[#0F0F0F]">Aldhi F.</p>
                    </div>
                  </div>

                  {/* SuperBank */}
                  <div className="bg-[#F4F6F8] rounded-xl p-4 border border-gray-200 hover:border-[#FFB22C]/50 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <img src="/images/banks/superbank.svg" alt="SuperBank" className="h-8 w-auto object-contain" />
                      <span className="font-semibold text-sm text-[#0F0F0F]">SuperBank</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">{language === 'id' ? 'Nomor Rekening' : 'Account Number'}</p>
                      <p className="font-mono text-sm font-bold text-[#0F0F0F] tracking-wider">000075067215</p>
                      <p className="text-xs text-gray-500">{language === 'id' ? 'Atas Nama' : 'Account Holder'}</p>
                      <p className="text-sm font-semibold text-[#0F0F0F]">Aldhi F.</p>
                    </div>
                  </div>
                </div>

                {/* Overseas payment info */}
                <div className="mt-4 bg-[#F9F8F6] rounded-xl p-3 border border-gray-200">
                  <div className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-[#FFB22C] flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-500">
                      {language === 'id'
                        ? 'Untuk pembayaran luar negeri: Gunakan metode SWIFT ke Bank Mandiri.'
                        : 'For overseas payments: Use SWIFT method to Bank Mandiri.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Proof Upload */}
              <div className="mb-6">
                <label className="block font-semibold text-sm text-[#0F0F0F] mb-2">
                  {language === 'id' ? 'Upload Bukti Pembayaran (Foto)' : 'Upload Payment Proof (Image)'}
                </label>
                <p className="text-xs text-gray-400 mb-3">
                  {language === 'id'
                    ? 'Format: JPG, PNG, atau JPEG. Ukuran maksimal 5MB.'
                    : 'Format: JPG, PNG, or JPEG. Maximum file size 5MB.'}
                </p>

                <div
                  onDrop={(e) => {
                    e.preventDefault();
                    const droppedFile = e.dataTransfer.files[0];
                    if (droppedFile && droppedFile.type.startsWith('image/')) {
                      if (droppedFile.size <= 5 * 1024 * 1024) {
                        setPaymentFile(droppedFile);
                        toast.success(language === 'id' ? 'File berhasil dipilih' : 'File selected');
                      } else {
                        toast.error(language === 'id' ? 'File maksimal 5MB' : 'File max 5MB');
                      }
                    } else {
                      toast.error(language === 'id' ? 'Format file harus gambar' : 'File must be an image');
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 transition-all ${
                    paymentFile ? 'border-[#FFB22C] bg-[#FFB22C]/5' : 'border-gray-200 bg-[#F4F6F8] hover:border-[#FFB22C]'
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
                          setPaymentFile(file);
                        } else {
                          toast.error(language === 'id' ? 'Format gambar (JPG, PNG), max 5MB' : 'Image format (JPG, PNG), max 5MB');
                        }
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-3">
                    <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                    {paymentFile ? (
                      <div className="text-center">
                        <p className="font-semibold text-[#0F0F0F] text-sm sm:text-base">{paymentFile.name}</p>
                        <p className="text-xs sm:text-sm text-gray-500">{(paymentFile.size / 1024 / 1024).toFixed(1)} MB</p>
                        <button
                          onClick={() => setPaymentFile(null)}
                          className="mt-2 text-xs sm:text-sm text-red-500 hover:underline"
                        >
                          {language === 'id' ? 'Hapus gambar' : 'Remove image'}
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="font-semibold text-[#0F0F0F] text-sm sm:text-base">
                          {language === 'id' ? 'Drag & drop atau klik untuk upload' : 'Drag & drop or click to upload'}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">JPG, PNG, max 5MB</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Verification Note */}
              <div className="bg-[#F9F8F6] rounded-xl p-4 mb-6 border border-gray-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-[#FFB22C] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-500">
                    {language === 'id'
                      ? 'Bukti pembayaran akan diverifikasi oleh panitia dalam 1x24 jam. Anda akan menerima konfirmasi melalui email dan WhatsApp.'
                      : 'Payment proof will be verified by the committee within 24 hours. You will receive confirmation via email and WhatsApp.'}
                  </p>
                </div>
              </div>

              {/* Agreement */}
              <div className="flex items-start gap-3 mt-6">
                <input
                  type="checkbox"
                  {...step6Form.register('agreeToPayment')}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-[#FFB22C] focus:ring-[#FFB22C] cursor-pointer"
                />
                <label className="text-sm text-gray-600 cursor-pointer">
                  {language === 'id'
                    ? 'Saya menyetujui bahwa bukti pembayaran yang saya upload adalah valid dan benar.'
                    : 'I confirm that the payment proof I uploaded is valid and accurate.'}
                </label>
              </div>
              {step6Form.formState.errors.agreeToPayment && (
                <p className="mt-1 text-xs text-red-500">{step6Form.formState.errors.agreeToPayment.message}</p>
              )}
            </div>
          )}

          {/* ===== STEP 7: Review & Submit ===== */}
          {currentStep === 7 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-lg sm:text-xl font-bold text-[#0F0F0F] mb-4 sm:mb-6 border-b border-gray-100 pb-4">
                {language === 'id' ? 'Tinjauan & Kirim' : 'Review & Submit'}
              </h2>

              {/* Summary Table */}
              <div className="space-y-6 mb-8">
                {/* Account Summary */}
                <div className="bg-[#F4F6F8] rounded-xl p-4 sm:p-5">
                  <h3 className="font-semibold text-sm text-[#0F0F0F] mb-3 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#FFB22C]" />
                    {language === 'id' ? 'Akun' : 'Account'}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-2 text-sm">
                    <div><span className="text-gray-500">Email:</span> <span className="font-medium text-[#0F0F0F]">{step1Form.getValues('email')}</span></div>
                  </div>
                </div>

                {/* Personal Info Summary */}
                <div className="bg-[#F4F6F8] rounded-xl p-4 sm:p-5">
                  <h3 className="font-semibold text-sm text-[#0F0F0F] mb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-[#FFB22C]" />
                    {language === 'id' ? 'Data Ketua Tim' : 'Team Leader'}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-2 text-sm">
                    <div><span className="text-gray-500">{language === 'id' ? 'Nama' : 'Name'}:</span> <span className="font-medium text-[#0F0F0F]">{step2Form.getValues('fullName')}</span></div>
                    <div><span className="text-gray-500">{language === 'id' ? 'Institusi' : 'Institution'}:</span> <span className="font-medium text-[#0F0F0F]">{step2Form.getValues('institution')}</span></div>
                    <div><span className="text-gray-500">{language === 'id' ? 'NIM' : 'Student ID'}:</span> <span className="font-medium text-[#0F0F0F]">{step2Form.getValues('studentId')}</span></div>
                    <div><span className="text-gray-500">{language === 'id' ? 'Jurusan' : 'Major'}:</span> <span className="font-medium text-[#0F0F0F]">{step2Form.getValues('major') || '-'}</span></div>
                    <div><span className="text-gray-500">{language === 'id' ? 'Telepon' : 'Phone'}:</span> <span className="font-medium text-[#0F0F0F]">{step2Form.getValues('phone')}</span></div>
                  </div>
                </div>

                {/* Team & Sub-Theme Summary */}
                <div className="bg-[#F4F6F8] rounded-xl p-4 sm:p-5">
                  <h3 className="font-semibold text-sm text-[#0F0F0F] mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#FFB22C]" />
                    {language === 'id' ? 'Tim & Sub-Tema' : 'Team & Sub-Theme'}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-2 text-sm">
                    <div><span className="text-gray-500">{language === 'id' ? 'Nama Tim' : 'Team Name'}:</span> <span className="font-medium text-[#0F0F0F]">{step3Form.getValues('teamName')}</span></div>
                    <div><span className="text-gray-500">{language === 'id' ? 'Sub-Tema' : 'Sub-Theme'}:</span> <span className="font-medium text-[#0F0F0F]">{step3Form.getValues('subTheme')}</span></div>
                    <div><span className="text-gray-500">{language === 'id' ? 'Kategori' : 'Category'}:</span> <span className="font-medium text-[#0F0F0F]">Student</span></div>
                  </div>
                </div>

                {/* Team Members Summary */}
                <div className="bg-[#F4F6F8] rounded-xl p-4 sm:p-5">
                  <h3 className="font-semibold text-sm text-[#0F0F0F] mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#FFB22C]" />
                    {language === 'id' ? 'Anggota Tim' : 'Team Members'}
                  </h3>
                  <div className="space-y-3">
                    <div className="grid sm:grid-cols-3 gap-2 text-sm">
                      <div><span className="text-gray-500">{language === 'id' ? 'Anggota 1' : 'Member 1'}:</span> <span className="font-medium text-[#0F0F0F]">{step4Form.getValues('member1FullName')}</span></div>
                      <div><span className="text-gray-500">{language === 'id' ? 'Institusi' : 'Institution'}:</span> <span className="font-medium text-[#0F0F0F]">{step4Form.getValues('member1Institution')}</span></div>
                      <div><span className="text-gray-500">NIM:</span> <span className="font-medium text-[#0F0F0F]">{step4Form.getValues('member1StudentId')}</span></div>
                    </div>
                    <div className="border-t border-gray-200 pt-3 grid sm:grid-cols-3 gap-2 text-sm">
                      <div><span className="text-gray-500">{language === 'id' ? 'Anggota 2' : 'Member 2'}:</span> <span className="font-medium text-[#0F0F0F]">{step4Form.getValues('member2FullName')}</span></div>
                      <div><span className="text-gray-500">{language === 'id' ? 'Institusi' : 'Institution'}:</span> <span className="font-medium text-[#0F0F0F]">{step4Form.getValues('member2Institution')}</span></div>
                      <div><span className="text-gray-500">NIM:</span> <span className="font-medium text-[#0F0F0F]">{step4Form.getValues('member2StudentId')}</span></div>
                    </div>
                  </div>
                </div>

                {/* Documents Summary */}
                <div className="bg-[#F4F6F8] rounded-xl p-4 sm:p-5">
                  <h3 className="font-semibold text-sm text-[#0F0F0F] mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#FFB22C]" />
                    {language === 'id' ? 'Dokumen' : 'Documents'}
                  </h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      {studentCardsFile ? <Check className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
                      <span className={studentCardsFile ? 'text-[#0F0F0F]' : 'text-red-400'}>{language === 'id' ? 'Kartu Mahasiswa' : 'Student ID Cards'}</span>
                      {studentCardsFile && <span className="text-xs text-gray-400">({(studentCardsFile.size / 1024 / 1024).toFixed(1)} MB)</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      {instagramProofFile ? <Check className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
                      <span className={instagramProofFile ? 'text-[#0F0F0F]' : 'text-red-400'}>{language === 'id' ? 'Bukti Follow Instagram' : 'Instagram Follow Proof'}</span>
                      {instagramProofFile && <span className="text-xs text-gray-400">({(instagramProofFile.size / 1024 / 1024).toFixed(1)} MB)</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      {twibbonProofFile ? <Check className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
                      <span className={twibbonProofFile ? 'text-[#0F0F0F]' : 'text-red-400'}>{language === 'id' ? 'Bukti Twibbon' : 'Twibbon Proof'}</span>
                      {twibbonProofFile && <span className="text-xs text-gray-400">({(twibbonProofFile.size / 1024 / 1024).toFixed(1)} MB)</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      {bmcFile ? <Check className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
                      <span className={bmcFile ? 'text-[#0F0F0F]' : 'text-red-400'}>BMC</span>
                      {bmcFile && <span className="text-xs text-gray-400">({(bmcFile.size / 1024 / 1024).toFixed(1)} MB)</span>}
                    </div>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-[#F4F6F8] rounded-xl p-4 sm:p-5">
                  <h3 className="font-semibold text-sm text-[#0F0F0F] mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#FFB22C]" />
                    {language === 'id' ? 'Pembayaran' : 'Payment'}
                  </h3>
                  <div className="text-sm">
                    <div className="flex items-center gap-2">
                      {paymentFile ? <Check className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-yellow-500" />}
                      <span className="text-[#0F0F0F]">
                        {paymentFile
                          ? (language === 'id' ? 'Bukti pembayaran telah diupload' : 'Payment proof uploaded')
                          : (language === 'id' ? 'Bukti pembayaran belum diupload (dapat diupload di dashboard)' : 'Payment proof not uploaded (can be uploaded in dashboard)')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guidebook & Contact Info */}
              <div className="bg-[#F9F8F6] rounded-2xl p-4 sm:p-6 border border-gray-200 mb-6">
                <h3 className="font-semibold text-[#0F0F0F] text-sm mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#FFB22C]" />
                  {language === 'id' ? 'Informasi & Kontak' : 'Information & Contact'}
                </h3>

                <div className="space-y-3 text-sm">
                  {/* Guidebook Link */}
                  <a
                    href="https://drive.google.com/file/d/1w3Qj3NXQuea-k8Tfj_3xi8wF7hjSJM06/view"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#FFB22C] hover:text-[#FFB22C]/80 font-medium transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {language === 'id' ? 'Guidebook CIBC 2026' : 'CIBC 2026 Guidebook'}
                  </a>

                  {/* Contact Persons */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>Farrel: +62 821-1201-4719</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>Evan: +62 896-1708-8800</span>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a href="mailto:innovatewith.cibc@gmail.com" className="hover:text-[#FFB22C] transition-colors">
                      innovatewith.cibc@gmail.com
                    </a>
                  </div>

                  {/* Instagram */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <MessageCircle className="w-4 h-4 text-gray-400" />
                    <span>@innovatewith.cibc</span>
                  </div>

                  {/* WhatsApp Group Notice */}
                  <div className="mt-3 bg-amber-50 rounded-xl p-3 border border-amber-200">
                    <p className="text-xs text-amber-700">
                      {language === 'id'
                        ? 'Link WhatsApp Group akan dikirim setelah registrasi disetujui oleh admin.'
                        : 'WhatsApp Group link will be sent after your registration is approved by admin.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Final Confirmation */}
              <div className="bg-[#F4F6F8] rounded-xl p-4 border border-gray-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-[#FFB22C] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-500">
                    {language === 'id'
                      ? 'Pastikan semua data yang Anda masukkan sudah benar sebelum mengirim. Data yang sudah dikirim tidak dapat diubah.'
                      : 'Make sure all data you entered is correct before submitting. Submitted data cannot be changed.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Centered Navigation Button */}
          <div className="flex justify-center items-center gap-4 mt-12">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 font-semibold text-sm text-gray-400 hover:text-[#0F0F0F] transition-colors"
              >
                {language === 'id' ? 'Kembali' : 'Cancel'}
              </button>
            )}

            <button
              type="button"
              onClick={currentStep < TOTAL_STEPS ? nextStep : onSubmit}
              disabled={isSubmitting}
              className="px-10 py-3.5 bg-[#FFB22C] text-[#0F0F0F] rounded-full font-bold text-sm hover:bg-[#FFB22C]/90 shadow-md shadow-[#FFB22C]/20 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {language === 'id' ? 'Memproses...' : 'Processing...'}
                </span>
              ) : (
                currentStep < TOTAL_STEPS
                  ? (language === 'id' ? 'Simpan & Lanjut' : 'Save & Continue')
                  : (language === 'id' ? 'Kirim Pendaftaran' : 'Submit Registration')
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CIBCRegister;
