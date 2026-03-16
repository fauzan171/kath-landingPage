import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  User,
  Mail,
  Phone,
  Lock,
  Calendar,
  MapPin,
  Building2,
  GraduationCap,
  CreditCard,
  Users,
  Award,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ChevronLeft,
  Check
} from 'lucide-react';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
  address: string;
  city: string;
  institutionType: string;
  institution: string;
  major: string;
  nim: string;
  competitionCategory: string;
  teamName: string;
  teamMembers: string;
  agreement: boolean;
  dataConsent: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const institutionTypes = [
  'Universitas',
  'Politeknik',
  'Perusahaan Event',
  'Freelance',
  'Lainnya',
];

const competitionCategories = [
  { id: 'startup', name: 'BMC Startup Challenge', prize: '$50,000' },
  { id: 'social', name: 'BMC Social Enterprise', prize: '$30,000' },
  { id: 'student', name: 'BMC Student Innovation', prize: '$15,000' },
  { id: 'corporate', name: 'BMC Corporate Innovation', prize: '$25,000' },
];

const teamSizeOptions = ['1', '2', '3', '4', '5', '6'];

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    address: '',
    city: '',
    institutionType: '',
    institution: '',
    major: '',
    nim: '',
    competitionCategory: '',
    teamName: '',
    teamMembers: '',
    agreement: false,
    dataConsent: false,
  });

  const isStudentCompetition = formData.competitionCategory === 'BMC Student Innovation';

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Nama lengkap wajib diisi';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email wajib diisi';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Format email tidak valid';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Nomor telepon wajib diisi';
      } else if (formData.phone.length < 10) {
        newErrors.phone = 'Nomor telepon minimal 10 digit';
      }
      if (!formData.password) {
        newErrors.password = 'Password wajib diisi';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password minimal 8 karakter';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Password tidak cocok';
      }
    }

    if (step === 2) {
      if (!formData.birthDate) {
        newErrors.birthDate = 'Tanggal lahir wajib diisi';
      }
      if (!formData.address.trim()) {
        newErrors.address = 'Alamat wajib diisi';
      }
      if (!formData.city.trim()) {
        newErrors.city = 'Kota wajib diisi';
      }
      if (!formData.institutionType) {
        newErrors.institutionType = 'Jenis institusi wajib dipilih';
      }
      if (!formData.institution.trim()) {
        newErrors.institution = 'Nama institusi wajib diisi';
      }
      if (isStudentCompetition) {
        if (!formData.major.trim()) {
          newErrors.major = 'Jurusan wajib diisi';
        }
        if (!formData.nim.trim()) {
          newErrors.nim = 'NIM wajib diisi';
        }
      }
    }

    if (step === 3) {
      if (!formData.competitionCategory) {
        newErrors.competitionCategory = 'Kategori lomba wajib dipilih';
      }
      if (!formData.agreement) {
        newErrors.agreement = 'Anda harus menyetujui syarat dan ketentuan';
      }
      if (!formData.dataConsent) {
        newErrors.dataConsent = 'Anda harus menyetujui penggunaan data';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (submitError) {
      setSubmitError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        birthDate: formData.birthDate,
        address: formData.address,
        city: formData.city,
        institution: formData.institution,
        institutionType: formData.institutionType,
        major: formData.major || undefined,
        nim: formData.nim || undefined,
        competitionCategory: formData.competitionCategory,
        teamName: formData.teamName || undefined,
        teamMembers: formData.teamMembers || undefined,
      });

      if (result.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          navigate('/login', { state: { message: 'Registrasi berhasil! Silakan login.' } });
        }, 2000);
      } else {
        setSubmitError(result.message);
      }
    } catch (error) {
      setSubmitError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (fieldName: string) => `
    w-full px-4 py-3.5 bg-white border rounded-xl font-body text-kath-text-primary
    placeholder-kath-text-muted focus:outline-none focus:border-kath-primary focus:ring-2 focus:ring-kath-primary/10 transition-all
    ${errors[fieldName] ? 'border-red-400 focus:border-red-400 focus:ring-red-400/10' : 'border-kath-bg-section hover:border-kath-primary/30'}
  `;

  const selectClasses = (fieldName: string) => `
    w-full px-4 py-3.5 bg-white border rounded-xl font-body text-kath-text-primary
    focus:outline-none focus:border-kath-primary focus:ring-2 focus:ring-kath-primary/10 transition-all appearance-none cursor-pointer
    ${errors[fieldName] ? 'border-red-400 focus:border-red-400 focus:ring-red-400/10' : 'border-kath-bg-section hover:border-kath-primary/30'}
  `;

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-kath-bg-main flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="font-display text-3xl text-kath-text-primary mb-4">
            Registrasi Berhasil!
          </h2>
          <p className="font-body text-kath-text-secondary mb-8">
            Akun Anda telah berhasil dibuat. Mengalihkan ke halaman login...
          </p>
          <div className="w-full h-1.5 bg-kath-bg-section rounded-full overflow-hidden">
            <div className="h-full bg-kath-primary animate-pulse rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kath-bg-main py-8 px-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-kath-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-kath-gold/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-kath-primary/3 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-kath-text-secondary hover:text-kath-primary transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-body text-sm">Kembali</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-kath-primary to-kath-primary-dark flex items-center justify-center shadow-lg shadow-kath-primary/25">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-kath-text-primary mb-2">
            Daftar Kompetisi
          </h1>
          <p className="font-body text-kath-text-secondary">
            Lengkapi data diri Anda untuk mendaftar BMC International 2026
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-body text-sm font-medium transition-all ${
                  currentStep >= step
                    ? 'bg-kath-primary text-white shadow-lg shadow-kath-primary/25'
                    : 'bg-kath-bg-section text-kath-text-muted'
                }`}
              >
                {currentStep > step ? <Check className="w-5 h-5" /> : step}
              </div>
              {step < 3 && (
                <div
                  className={`w-16 h-1 mx-2 rounded-full transition-all ${
                    currentStep > step ? 'bg-kath-primary' : 'bg-kath-bg-section'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white border border-kath-bg-section rounded-3xl p-6 md:p-8 shadow-xl shadow-kath-primary/5">
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="font-body text-red-600 text-sm">{submitError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Account Information */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-kath-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-kath-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-kath-text-primary">Informasi Akun</h3>
                    <p className="font-body text-sm text-kath-text-muted">Buat akun untuk mengakses dashboard</p>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block font-body text-sm text-kath-text-primary mb-2">
                    Nama Lengkap <span className="text-kath-primary">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kath-text-muted" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Nama lengkap sesuai KTP"
                      className={`${inputClasses('fullName')} pl-12`}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-body text-sm text-kath-text-primary mb-2">
                      Email <span className="text-kath-primary">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kath-text-muted" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@example.com"
                        className={`${inputClasses('email')} pl-12`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block font-body text-sm text-kath-text-primary mb-2">
                      Nomor Telepon <span className="text-kath-primary">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kath-text-muted" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="081234567890"
                        className={`${inputClasses('phone')} pl-12`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Password & Confirm */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-body text-sm text-kath-text-primary mb-2">
                      Password <span className="text-kath-primary">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kath-text-muted" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Minimal 8 karakter"
                        className={`${inputClasses('password')} pl-12 pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-kath-text-muted hover:text-kath-primary transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block font-body text-sm text-kath-text-primary mb-2">
                      Konfirmasi Password <span className="text-kath-primary">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kath-text-muted" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Ulangi password"
                        className={`${inputClasses('confirmPassword')} pl-12 pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-kath-text-muted hover:text-kath-primary transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Personal Information */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-kath-primary/10 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-kath-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-kath-text-primary">Data Pribadi</h3>
                    <p className="font-body text-sm text-kath-text-muted">Lengkapi data diri Anda</p>
                  </div>
                </div>

                {/* Birth Date & City */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-body text-sm text-kath-text-primary mb-2">
                      Tanggal Lahir <span className="text-kath-primary">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kath-text-muted" />
                      <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        className={`${inputClasses('birthDate')} pl-12`}
                      />
                    </div>
                    {errors.birthDate && (
                      <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.birthDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block font-body text-sm text-kath-text-primary mb-2">
                      Kota <span className="text-kath-primary">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kath-text-muted" />
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Kota domisili"
                        className={`${inputClasses('city')} pl-12`}
                      />
                    </div>
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.city}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block font-body text-sm text-kath-text-primary mb-2">
                    Alamat Lengkap <span className="text-kath-primary">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Alamat lengkap sesuai KTP"
                    className={`${inputClasses('address')} resize-none`}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* Institution Type & Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-body text-sm text-kath-text-primary mb-2">
                      Jenis Institusi <span className="text-kath-primary">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kath-text-muted pointer-events-none z-10" />
                      <select
                        name="institutionType"
                        value={formData.institutionType}
                        onChange={handleChange}
                        className={`${selectClasses('institutionType')} pl-12`}
                      >
                        <option value="">Pilih jenis institusi</option>
                        {institutionTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    {errors.institutionType && (
                      <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.institutionType}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block font-body text-sm text-kath-text-primary mb-2">
                      Nama Institusi <span className="text-kath-primary">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kath-text-muted" />
                      <input
                        type="text"
                        name="institution"
                        value={formData.institution}
                        onChange={handleChange}
                        placeholder="Nama universitas/perusahaan"
                        className={`${inputClasses('institution')} pl-12`}
                      />
                    </div>
                    {errors.institution && (
                      <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.institution}
                      </p>
                    )}
                  </div>
                </div>

                {/* Student-specific fields */}
                {isStudentCompetition && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-body text-sm text-kath-text-primary mb-2">
                        Jurusan <span className="text-kath-primary">*</span>
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kath-text-muted" />
                        <input
                          type="text"
                          name="major"
                          value={formData.major}
                          onChange={handleChange}
                          placeholder="Jurusan/program studi"
                          className={`${inputClasses('major')} pl-12`}
                        />
                      </div>
                      {errors.major && (
                        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.major}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-body text-sm text-kath-text-primary mb-2">
                        NIM <span className="text-kath-primary">*</span>
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kath-text-muted" />
                        <input
                          type="text"
                          name="nim"
                          value={formData.nim}
                          onChange={handleChange}
                          placeholder="Nomor Induk Mahasiswa"
                          className={`${inputClasses('nim')} pl-12`}
                        />
                      </div>
                      {errors.nim && (
                        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.nim}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Competition Selection */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-kath-primary/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-kath-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-kath-text-primary">Pilih Kompetisi</h3>
                    <p className="font-body text-sm text-kath-text-muted">Pilih kategori yang sesuai dengan Anda</p>
                  </div>
                </div>

                {/* Competition Categories */}
                <div className="grid grid-cols-1 gap-3">
                  {competitionCategories.map((category) => (
                    <label
                      key={category.id}
                      className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.competitionCategory === category.name
                          ? 'border-kath-primary bg-kath-primary/5'
                          : 'border-kath-bg-section hover:border-kath-primary/30 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="competitionCategory"
                        value={category.name}
                        checked={formData.competitionCategory === category.name}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            formData.competitionCategory === category.name
                              ? 'border-kath-primary'
                              : 'border-kath-text-muted'
                          }`}>
                            {formData.competitionCategory === category.name && (
                              <div className="w-2.5 h-2.5 rounded-full bg-kath-primary" />
                            )}
                          </div>
                          <div>
                            <p className="font-body font-medium text-kath-text-primary">{category.name}</p>
                            <p className="font-body text-xs text-kath-text-muted">
                              {category.id === 'student' ? 'Khusus mahasiswa' : 'Terbuka untuk umum'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-lg text-kath-primary">{category.prize}</p>
                          <p className="font-body text-xs text-kath-text-muted">Grand Prize</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.competitionCategory && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.competitionCategory}
                  </p>
                )}

                {/* Team Info (Optional) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-kath-bg-section">
                  <div>
                    <label className="block font-body text-sm text-kath-text-primary mb-2">
                      Nama Tim <span className="text-kath-text-muted">(Opsional)</span>
                    </label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kath-text-muted" />
                      <input
                        type="text"
                        name="teamName"
                        value={formData.teamName}
                        onChange={handleChange}
                        placeholder="Nama tim Anda"
                        className={`${inputClasses('teamName')} pl-12`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-body text-sm text-kath-text-primary mb-2">
                      Jumlah Anggota <span className="text-kath-text-muted">(Opsional)</span>
                    </label>
                    <select
                      name="teamMembers"
                      value={formData.teamMembers}
                      onChange={handleChange}
                      className={selectClasses('teamMembers')}
                    >
                      <option value="">Pilih jumlah anggota</option>
                      {teamSizeOptions.map((size) => (
                        <option key={size} value={size}>{size} orang</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Agreements */}
                <div className="space-y-3 pt-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreement"
                      checked={formData.agreement}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-kath-bg-section text-kath-primary focus:ring-kath-primary/20 mt-0.5"
                    />
                    <span className="font-body text-sm text-kath-text-secondary">
                      Saya menyetujui{' '}
                      <Link to="#" className="text-kath-primary hover:underline">Syarat dan Ketentuan</Link>
                      {' '}serta{' '}
                      <Link to="#" className="text-kath-primary hover:underline">Peraturan Kompetisi</Link>
                    </span>
                  </label>
                  {errors.agreement && (
                    <p className="text-red-500 text-xs flex items-center gap-1 ml-8">
                      <AlertCircle className="w-3 h-3" />
                      {errors.agreement}
                    </p>
                  )}

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="dataConsent"
                      checked={formData.dataConsent}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-kath-bg-section text-kath-primary focus:ring-kath-primary/20 mt-0.5"
                    />
                    <span className="font-body text-sm text-kath-text-secondary">
                      Saya menyetujui pengumpulan dan penggunaan data pribadi saya sesuai dengan{' '}
                      <Link to="#" className="text-kath-primary hover:underline">Kebijakan Privasi</Link>
                    </span>
                  </label>
                  {errors.dataConsent && (
                    <p className="text-red-500 text-xs flex items-center gap-1 ml-8">
                      <AlertCircle className="w-3 h-3" />
                      {errors.dataConsent}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-kath-bg-section">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 border border-kath-bg-section hover:border-kath-primary/30 text-kath-text-primary font-body rounded-xl transition-all"
                >
                  Kembali
                </button>
              ) : (
                <div />
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3 bg-kath-primary hover:bg-kath-primary-dark text-white font-body font-medium rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-kath-primary/25"
                >
                  Lanjut
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-kath-primary hover:bg-kath-primary-dark disabled:bg-kath-primary/50 text-white font-body font-medium rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-kath-primary/25"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Daftar
                      <CheckCircle className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Login Link */}
        <p className="text-center mt-8 font-body text-sm text-kath-text-secondary">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-kath-primary hover:text-kath-primary-dark font-medium transition-colors">
            Login sekarang
          </Link>
        </p>

        {/* Footer */}
        <p className="text-center mt-4 font-body text-xs text-kath-text-muted">
          © 2026 KATH Event Organizer. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Register;
