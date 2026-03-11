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
  Building,
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
  ChevronLeft
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
  'Wedding Concept Competition',
  'Event Design Challenge',
  'Event Photography Contest',
  'Student Event Competition',
];

const teamSizeOptions = ['1', '2', '3', '4'];

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  const isStudentCompetition = formData.competitionCategory === 'Student Event Competition';

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Personal Info
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

    if (!formData.birthDate) {
      newErrors.birthDate = 'Tanggal lahir wajib diisi';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Alamat wajib diisi';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Kota wajib diisi';
    }

    // Institution
    if (!formData.institutionType) {
      newErrors.institutionType = 'Jenis institusi wajib dipilih';
    }

    if (!formData.institution.trim()) {
      newErrors.institution = 'Nama institusi wajib diisi';
    }

    // Student-specific fields
    if (isStudentCompetition) {
      if (!formData.major.trim()) {
        newErrors.major = 'Jurusan wajib diisi';
      }
      if (!formData.nim.trim()) {
        newErrors.nim = 'NIM wajib diisi';
      }
    }

    // Competition
    if (!formData.competitionCategory) {
      newErrors.competitionCategory = 'Kategori lomba wajib dipilih';
    }

    // Agreements
    if (!formData.agreement) {
      newErrors.agreement = 'Anda harus menyetujui syarat dan ketentuan';
    }

    if (!formData.dataConsent) {
      newErrors.dataConsent = 'Anda harus menyetujui penggunaan data';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Clear submit error
    if (submitError) {
      setSubmitError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
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
    w-full px-4 py-3 bg-kath-black/50 border rounded-xl font-body text-kath-white 
    placeholder-kath-off-white/30 focus:outline-none focus:border-kath-gold transition-colors
    ${errors[fieldName] ? 'border-red-500' : 'border-kath-charcoal/50'}
  `;

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-kath-black flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="font-display text-3xl text-kath-white mb-4">
            Registrasi Berhasil!
          </h2>
          <p className="font-body text-kath-off-white/70 mb-8">
            Akun Anda telah berhasil dibuat. Mengalihkan ke halaman login...
          </p>
          <div className="w-full h-1 bg-kath-charcoal/30 rounded-full overflow-hidden">
            <div className="h-full bg-kath-gold animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kath-black py-8 px-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-kath-gold/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-kath-gold/3 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-kath-off-white/70 hover:text-kath-gold transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-body text-sm">Kembali</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-kath-gold/20 flex items-center justify-center">
            <Award className="w-8 h-8 text-kath-gold" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-kath-white mb-2">
            Daftar Kompetisi
          </h1>
          <p className="font-body text-kath-off-white/60">
            Lengkapi data diri Anda untuk mendaftar
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-kath-dark-gray/50 border border-kath-charcoal/30 rounded-3xl p-6 md:p-8">
          {submitError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="font-body text-red-400 text-sm">{submitError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="font-display text-lg text-kath-gold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Data Pribadi
              </h3>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block font-body text-sm text-kath-off-white mb-2">
                    Nama Lengkap <span className="text-kath-gold">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kath-off-white/40" />
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
                    <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-body text-sm text-kath-off-white mb-2">
                      Email <span className="text-kath-gold">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kath-off-white/40" />
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
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-body text-sm text-kath-off-white mb-2">
                      Nomor Telepon <span className="text-kath-gold">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kath-off-white/40" />
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
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Password & Confirm */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-body text-sm text-kath-off-white mb-2">
                      Password <span className="text-kath-gold">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kath-off-white/40" />
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
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-kath-off-white/40 hover:text-kath-gold transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-body text-sm text-kath-off-white mb-2">
                      Konfirmasi Password <span className="text-kath-gold">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kath-off-white/40" />
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
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-kath-off-white/40 hover:text-kath-gold transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Birth Date & City */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-body text-sm text-kath-off-white mb-2">
                      Tanggal Lahir <span className="text-kath-gold">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kath-off-white/40" />
                      <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        className={`${inputClasses('birthDate')} pl-12`}
                      />
                    </div>
                    {errors.birthDate && (
                      <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-body text-sm text-kath-off-white mb-2">
                      Kota <span className="text-kath-gold">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kath-off-white/40" />
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
                      <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block font-body text-sm text-kath-off-white mb-2">
                    Alamat Lengkap <span className="text-kath-gold">*</span>
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
                    <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-kath-charcoal/30" />

            {/* Institution Information */}
            <div>
              <h3 className="font-display text-lg text-kath-gold mb-4 flex items-center gap-2">
                <Building className="w-5 h-5" />
                Data Institusi
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-body text-sm text-kath-off-white mb-2">
                      Jenis Institusi <span className="text-kath-gold">*</span>
                    </label>
                    <select
                      name="institutionType"
                      value={formData.institutionType}
                      onChange={handleChange}
                      className={`${inputClasses('institutionType')} appearance-none cursor-pointer`}
                    >
                      <option value="" className="bg-kath-dark-gray">Pilih jenis institusi</option>
                      {institutionTypes.map(type => (
                        <option key={type} value={type} className="bg-kath-dark-gray">{type}</option>
                      ))}
                    </select>
                    {errors.institutionType && (
                      <p className="text-red-500 text-xs mt-1">{errors.institutionType}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-body text-sm text-kath-off-white mb-2">
                      Nama Institusi <span className="text-kath-gold">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kath-off-white/40" />
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
                      <p className="text-red-500 text-xs mt-1">{errors.institution}</p>
                    )}
                  </div>
                </div>

                {/* Student-specific fields */}
                {isStudentCompetition && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-kath-gold/5 border border-kath-gold/20 rounded-xl">
                    <div>
                      <label className="block font-body text-sm text-kath-off-white mb-2">
                        Jurusan <span className="text-kath-gold">*</span>
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kath-off-white/40" />
                        <input
                          type="text"
                          name="major"
                          value={formData.major}
                          onChange={handleChange}
                          placeholder="Contoh: Manajemen Perhotelan"
                          className={`${inputClasses('major')} pl-12`}
                        />
                      </div>
                      {errors.major && (
                        <p className="text-red-500 text-xs mt-1">{errors.major}</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-body text-sm text-kath-off-white mb-2">
                        NIM <span className="text-kath-gold">*</span>
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kath-off-white/40" />
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
                        <p className="text-red-500 text-xs mt-1">{errors.nim}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-kath-charcoal/30" />

            {/* Competition Information */}
            <div>
              <h3 className="font-display text-lg text-kath-gold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Informasi Kompetisi
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block font-body text-sm text-kath-off-white mb-2">
                    Kategori Lomba <span className="text-kath-gold">*</span>
                  </label>
                  <select
                    name="competitionCategory"
                    value={formData.competitionCategory}
                    onChange={handleChange}
                    className={`${inputClasses('competitionCategory')} appearance-none cursor-pointer`}
                  >
                    <option value="" className="bg-kath-dark-gray">Pilih kategori lomba</option>
                    {competitionCategories.map(cat => (
                      <option key={cat} value={cat} className="bg-kath-dark-gray">{cat}</option>
                    ))}
                  </select>
                  {errors.competitionCategory && (
                    <p className="text-red-500 text-xs mt-1">{errors.competitionCategory}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-body text-sm text-kath-off-white mb-2">
                      Nama Tim <span className="text-kath-off-white/50">(Opsional)</span>
                    </label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kath-off-white/40" />
                      <input
                        type="text"
                        name="teamName"
                        value={formData.teamName}
                        onChange={handleChange}
                        placeholder="Nama tim jika berkelompok"
                        className={`${inputClasses('teamName')} pl-12`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-body text-sm text-kath-off-white mb-2">
                      Jumlah Anggota <span className="text-kath-off-white/50">(Opsional)</span>
                    </label>
                    <select
                      name="teamMembers"
                      value={formData.teamMembers}
                      onChange={handleChange}
                      className={`${inputClasses('teamMembers')} appearance-none cursor-pointer`}
                    >
                      <option value="" className="bg-kath-dark-gray">Pilih jumlah anggota</option>
                      {teamSizeOptions.map(size => (
                        <option key={size} value={size} className="bg-kath-dark-gray">{size} orang</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-kath-charcoal/30" />

            {/* Agreements */}
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="agreement"
                  checked={formData.agreement}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 rounded border-kath-charcoal/50 bg-kath-black/50 text-kath-gold focus:ring-kath-gold focus:ring-offset-0 cursor-pointer"
                />
                <span className="font-body text-sm text-kath-off-white/70 group-hover:text-kath-off-white transition-colors">
                  Saya menyetujui{' '}
                  <span className="text-kath-gold hover:underline">syarat dan ketentuan</span>
                  {' '}yang berlaku dalam kompetisi ini <span className="text-kath-gold">*</span>
                </span>
              </label>
              {errors.agreement && (
                <p className="text-red-500 text-xs">{errors.agreement}</p>
              )}

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="dataConsent"
                  checked={formData.dataConsent}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 rounded border-kath-charcoal/50 bg-kath-black/50 text-kath-gold focus:ring-kath-gold focus:ring-offset-0 cursor-pointer"
                />
                <span className="font-body text-sm text-kath-off-white/70 group-hover:text-kath-off-white transition-colors">
                  Saya menyetujui penggunaan data pribadi saya untuk keperluan kompetisi ini{' '}
                  <span className="text-kath-gold">*</span>
                </span>
              </label>
              {errors.dataConsent && (
                <p className="text-red-500 text-xs">{errors.dataConsent}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-kath-gold hover:bg-kath-gold-light disabled:bg-kath-gold/50 text-kath-black font-body font-medium rounded-full transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-kath-black/30 border-t-kath-black rounded-full animate-spin" />
                  <span>Mendaftar...</span>
                </>
              ) : (
                <>
                  <span>Daftar Sekarang</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Login Link */}
            <p className="text-center font-body text-sm text-kath-off-white/60">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-kath-gold hover:underline">
                Login di sini
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
