import { useState, useRef } from 'react';
import { X, Send, CheckCircle, User, Mail, Phone, Building, Upload, Award, FileText, CreditCard, GraduationCap, Users, Calendar, MapPin } from '../icons';

interface CompetitionFormProps {
  isOpen: boolean;
  onClose: () => void;
  competitionName?: string;
}

const CompetitionForm = ({ isOpen, onClose, competitionName = '' }: CompetitionFormProps) => {
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: '',
    email: '',
    phone: '',
    birthDate: '',
    address: '',
    city: '',

    // Institution Info
    institution: '',
    institutionType: '', // Universitas, Perusahaan, Freelance, dll
    major: '', // For students
    nim: '', // For students

    // Competition Info
    competitionCategory: competitionName || '',
    teamName: '',
    teamMembers: '',
    teamMemberNames: '',

    // Portfolio & Documents
    portfolioFile: null as File | null,
    idCardFile: null as File | null,
    studentCardFile: null as File | null, // For students

    // Additional Info
    motivation: '',
    experience: '',
    referral: '',

    // Agreement
    agreement: false,
    dataConsent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const idCardInputRef = useRef<HTMLInputElement>(null);
  const studentCardInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'Wedding Concept Competition',
    'Event Design Challenge',
    'Event Photography Contest',
    'Student Event Competition',
  ];

  const institutionTypes = [
    'Universitas',
    'Politeknik',
    'Perusahaan Event',
    'Freelance',
    'Lainnya',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (field: 'portfolioFile' | 'idCardFile' | 'studentCardFile', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (field === 'portfolioFile') {
      if (file.type !== 'application/pdf') {
        setErrors(prev => ({ ...prev, [field]: 'File harus berformat PDF' }));
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB max
        setErrors(prev => ({ ...prev, [field]: 'Ukuran file maksimal 10MB' }));
        return;
      }
    } else {
      // ID card and student card - allow image or PDF
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, [field]: 'File harus PDF, JPG, atau PNG' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB max
        setErrors(prev => ({ ...prev, [field]: 'Ukuran file maksimal 5MB' }));
        return;
      }
    }

    setFormData(prev => ({ ...prev, [field]: file }));
    setErrors(prev => ({ ...prev, [field]: '' }));

    // Simulate upload progress
    setUploadProgress(prev => ({ ...prev, [field]: 0 }));
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(prev => ({ ...prev, [field]: progress }));
      if (progress >= 100) clearInterval(interval);
    }, 100);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Personal Info
    if (!formData.fullName.trim()) newErrors.fullName = 'Nama lengkap wajib diisi';
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Nomor telepon wajib diisi';
    if (!formData.birthDate) newErrors.birthDate = 'Tanggal lahir wajib diisi';
    if (!formData.address.trim()) newErrors.address = 'Alamat wajib diisi';
    if (!formData.city.trim()) newErrors.city = 'Kota wajib diisi';

    // Institution
    if (!formData.institutionType) newErrors.institutionType = 'Jenis institusi wajib dipilih';
    if (!formData.institution.trim()) newErrors.institution = 'Nama institusi wajib diisi';

    // For student competition
    if (formData.competitionCategory.includes('Student')) {
      if (!formData.major.trim()) newErrors.major = 'Jurusan wajib diisi';
      if (!formData.nim.trim()) newErrors.nim = 'NIM wajib diisi';
      if (!formData.studentCardFile) newErrors.studentCardFile = 'Kartu mahasiswa wajib diupload';
    }

    // Competition
    if (!formData.competitionCategory) newErrors.competitionCategory = 'Kategori lomba wajib dipilih';

    // Documents
    if (!formData.portfolioFile) newErrors.portfolioFile = 'Portofolio wajib diupload (PDF, max 10MB)';
    if (!formData.idCardFile) newErrors.idCardFile = 'KTP wajib diupload';

    // Additional Info
    if (!formData.motivation.trim()) newErrors.motivation = 'Motivasi wajib diisi';
    if (formData.motivation.length < 50) newErrors.motivation = 'Motivasi minimal 50 karakter';

    // Agreements
    if (!formData.agreement) newErrors.agreement = 'Anda harus menyetujui syarat dan ketentuan';
    if (!formData.dataConsent) newErrors.dataConsent = 'Anda harus menyetujui penggunaan data';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call with file upload
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          birthDate: '',
          address: '',
          city: '',
          institution: '',
          institutionType: '',
          major: '',
          nim: '',
          competitionCategory: '',
          teamName: '',
          teamMembers: '',
          teamMemberNames: '',
          portfolioFile: null,
          idCardFile: null,
          studentCardFile: null,
          motivation: '',
          experience: '',
          referral: '',
          agreement: false,
          dataConsent: false,
        });
        setUploadProgress({});
      }, 300);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  const isStudentCompetition = formData.competitionCategory.includes('Student');

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop - Fixed, tidak ikut scroll */}
      <div
        className="fixed inset-0 bg-kath-black/95 backdrop-blur-xl"
        onClick={handleClose}
      />

      {/* Form Container - Fixed position dengan scrollable content */}
      <div className="fixed inset-4 sm:inset-8 lg:inset-12 flex items-center justify-center pointer-events-none">
        <div className="relative w-full max-w-3xl max-h-full bg-kath-dark-gray border border-kath-charcoal/50 rounded-3xl overflow-hidden pointer-events-auto flex flex-col">
          {/* Header - Fixed */}
          <div className="flex-shrink-0 p-6 sm:p-8 border-b border-kath-charcoal/30 bg-gradient-to-r from-kath-gold/10 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-kath-gold/20 flex items-center justify-center">
                  <Award className="w-6 h-6 text-kath-gold" />
                </div>
                <div>
                  <span className="font-body text-kath-gold text-xs uppercase tracking-wider">
                    Form Pendaftaran
                  </span>
                  <h2 className="font-display text-xl sm:text-2xl text-kath-white">
                    Daftar Kompetisi
                  </h2>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-10 h-10 bg-kath-black/50 hover:bg-kath-gold/20 rounded-full flex items-center justify-center text-kath-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="font-body text-kath-off-white/60 text-sm mt-3">
              Lengkapi data diri dan upload dokumen yang diperlukan
            </p>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">

                {/* Section: Personal Information */}
                <div className="space-y-4">
                  <h3 className="font-display text-lg text-kath-gold flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Data Pribadi
                  </h3>

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
                        placeholder="Masukkan nama lengkap sesuai KTP"
                        className={`w-full pl-12 pr-4 py-3 bg-kath-black/50 border rounded-xl font-body text-kath-white placeholder-kath-off-white/30 focus:outline-none focus:border-kath-gold transition-colors ${
                          errors.fullName ? 'border-red-500' : 'border-kath-charcoal/50'
                        }`}
                      />
                    </div>
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                          className={`w-full pl-12 pr-4 py-3 bg-kath-black/50 border rounded-xl font-body text-kath-white placeholder-kath-off-white/30 focus:outline-none focus:border-kath-gold transition-colors ${
                            errors.email ? 'border-red-500' : 'border-kath-charcoal/50'
                          }`}
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block font-body text-sm text-kath-off-white mb-2">
                        Nomor Telepon (WhatsApp) <span className="text-kath-gold">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kath-off-white/40" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="081234567890"
                          className={`w-full pl-12 pr-4 py-3 bg-kath-black/50 border rounded-xl font-body text-kath-white placeholder-kath-off-white/30 focus:outline-none focus:border-kath-gold transition-colors ${
                            errors.phone ? 'border-red-500' : 'border-kath-charcoal/50'
                          }`}
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Birth Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                          className={`w-full pl-12 pr-4 py-3 bg-kath-black/50 border rounded-xl font-body text-kath-white focus:outline-none focus:border-kath-gold transition-colors ${
                            errors.birthDate ? 'border-red-500' : 'border-kath-charcoal/50'
                          }`}
                        />
                      </div>
                      {errors.birthDate && <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>}
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
                          className={`w-full pl-12 pr-4 py-3 bg-kath-black/50 border rounded-xl font-body text-kath-white placeholder-kath-off-white/30 focus:outline-none focus:border-kath-gold transition-colors ${
                            errors.city ? 'border-red-500' : 'border-kath-charcoal/50'
                          }`}
                        />
                      </div>
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
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
                      rows={2}
                      placeholder="Alamat lengkap sesuai KTP"
                      className={`w-full px-4 py-3 bg-kath-black/50 border rounded-xl font-body text-kath-white placeholder-kath-off-white/30 focus:outline-none focus:border-kath-gold transition-colors resize-none ${
                        errors.address ? 'border-red-500' : 'border-kath-charcoal/50'
                      }`}
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-kath-charcoal/30" />

                {/* Section: Institution Information */}
                <div className="space-y-4">
                  <h3 className="font-display text-lg text-kath-gold flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Data Institusi
                  </h3>

                  {/* Institution Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-body text-sm text-kath-off-white mb-2">
                        Jenis Institusi <span className="text-kath-gold">*</span>
                      </label>
                      <select
                        name="institutionType"
                        value={formData.institutionType}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-kath-black/50 border rounded-xl font-body text-kath-white focus:outline-none focus:border-kath-gold transition-colors ${
                          errors.institutionType ? 'border-red-500' : 'border-kath-charcoal/50'
                        }`}
                      >
                        <option value="">Pilih jenis institusi</option>
                        {institutionTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {errors.institutionType && <p className="text-red-500 text-xs mt-1">{errors.institutionType}</p>}
                    </div>

                    <div>
                      <label className="block font-body text-sm text-kath-off-white mb-2">
                        Nama Institusi/Perusahaan <span className="text-kath-gold">*</span>
                      </label>
                      <div className="relative">
                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kath-off-white/40" />
                        <input
                          type="text"
                          name="institution"
                          value={formData.institution}
                          onChange={handleChange}
                          placeholder="Nama universitas/perusahaan"
                          className={`w-full pl-12 pr-4 py-3 bg-kath-black/50 border rounded-xl font-body text-kath-white placeholder-kath-off-white/30 focus:outline-none focus:border-kath-gold transition-colors ${
                            errors.institution ? 'border-red-500' : 'border-kath-charcoal/50'
                          }`}
                        />
                      </div>
                      {errors.institution && <p className="text-red-500 text-xs mt-1">{errors.institution}</p>}
                    </div>
                  </div>

                  {/* Student-specific fields */}
                  {isStudentCompetition && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-body text-sm text-kath-off-white mb-2">
                          Jurusan/Program Studi <span className="text-kath-gold">*</span>
                        </label>
                        <div className="relative">
                          <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kath-off-white/40" />
                          <input
                            type="text"
                            name="major"
                            value={formData.major}
                            onChange={handleChange}
                            placeholder="Contoh: Manajemen Perhotelan"
                            className={`w-full pl-12 pr-4 py-3 bg-kath-black/50 border rounded-xl font-body text-kath-white placeholder-kath-off-white/30 focus:outline-none focus:border-kath-gold transition-colors ${
                              errors.major ? 'border-red-500' : 'border-kath-charcoal/50'
                            }`}
                          />
                        </div>
                        {errors.major && <p className="text-red-500 text-xs mt-1">{errors.major}</p>}
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
                            className={`w-full pl-12 pr-4 py-3 bg-kath-black/50 border rounded-xl font-body text-kath-white placeholder-kath-off-white/30 focus:outline-none focus:border-kath-gold transition-colors ${
                              errors.nim ? 'border-red-500' : 'border-kath-charcoal/50'
                            }`}
                          />
                        </div>
                        {errors.nim && <p className="text-red-500 text-xs mt-1">{errors.nim}</p>}
                      </div>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-kath-charcoal/30" />

                {/* Section: Competition Information */}
                <div className="space-y-4">
                  <h3 className="font-display text-lg text-kath-gold flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Informasi Kompetisi
                  </h3>

                  {/* Competition Category */}
                  <div>
                    <label className="block font-body text-sm text-kath-off-white mb-2">
                      Kategori Lomba <span className="text-kath-gold">*</span>
                    </label>
                    <select
                      name="competitionCategory"
                      value={formData.competitionCategory}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-kath-black/50 border rounded-xl font-body text-kath-white focus:outline-none focus:border-kath-gold transition-colors ${
                        errors.competitionCategory ? 'border-red-500' : 'border-kath-charcoal/50'
                      }`}
                    >
                      <option value="">Pilih kategori lomba</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {errors.competitionCategory && <p className="text-red-500 text-xs mt-1">{errors.competitionCategory}</p>}
                  </div>

                  {/* Team Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-body text-sm text-kath-off-white mb-2">
                        Nama Tim
                      </label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kath-off-white/40" />
                        <input
                          type="text"
                          name="teamName"
                          value={formData.teamName}
                          onChange={handleChange}
                          placeholder="Nama tim (jika berkelompok)"
                          className="w-full pl-12 pr-4 py-3 bg-kath-black/50 border border-kath-charcoal/50 rounded-xl font-body text-kath-white placeholder-kath-off-white/30 focus:outline-none focus:border-kath-gold transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-body text-sm text-kath-off-white mb-2">
                        Jumlah Anggota Tim
                      </label>
                      <input
                        type="number"
                        name="teamMembers"
                        value={formData.teamMembers}
                        onChange={handleChange}
                        placeholder="1-5 orang"
                        min="1"
                        max="5"
                        className="w-full px-4 py-3 bg-kath-black/50 border border-kath-charcoal/50 rounded-xl font-body text-kath-white placeholder-kath-off-white/30 focus:outline-none focus:border-kath-gold transition-colors"
                      />
                    </div>
                  </div>

                  {formData.teamMembers && parseInt(formData.teamMembers) > 1 && (
                    <div>
                      <label className="block font-body text-sm text-kath-off-white mb-2">
                        Nama Anggota Tim Lainnya
                      </label>
                      <textarea
                        name="teamMemberNames"
                        value={formData.teamMemberNames}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Tuliskan nama lengkap anggota tim lainnya"
                        className="w-full px-4 py-3 bg-kath-black/50 border border-kath-charcoal/50 rounded-xl font-body text-kath-white placeholder-kath-off-white/30 focus:outline-none focus:border-kath-gold transition-colors resize-none"
                      />
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-kath-charcoal/30" />

                {/* Section: Documents Upload */}
                <div className="space-y-4">
                  <h3 className="font-display text-lg text-kath-gold flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Upload Dokumen
                  </h3>

                  {/* Portfolio Upload */}
                  <div>
                    <label className="block font-body text-sm text-kath-off-white mb-2">
                      Portofolio (PDF) <span className="text-kath-gold">*</span>
                      <span className="text-kath-off-white/50 text-xs ml-2">Max 10MB</span>
                    </label>
                    <div
                      onClick={() => portfolioInputRef.current?.click()}
                      className={`relative cursor-pointer border-2 border-dashed rounded-xl p-6 transition-colors ${
                        errors.portfolioFile
                          ? 'border-red-500 bg-red-500/5'
                          : formData.portfolioFile
                            ? 'border-green-500 bg-green-500/5'
                            : 'border-kath-charcoal/50 hover:border-kath-gold/50 bg-kath-black/30'
                      }`}
                    >
                      <input
                        ref={portfolioInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileChange('portfolioFile', e)}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center text-center">
                        {formData.portfolioFile ? (
                          <>
                            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
                              <FileText className="w-6 h-6 text-green-500" />
                            </div>
                            <p className="font-body text-kath-white text-sm">{formData.portfolioFile.name}</p>
                            <p className="font-body text-kath-off-white/50 text-xs">
                              {formatFileSize(formData.portfolioFile.size)}
                            </p>
                            {uploadProgress.portfolioFile && uploadProgress.portfolioFile < 100 && (
                              <div className="w-full max-w-xs mt-2">
                                <div className="h-1 bg-kath-charcoal/50 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-kath-gold transition-all duration-300"
                                    style={{ width: `${uploadProgress.portfolioFile}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-12 rounded-full bg-kath-gold/20 flex items-center justify-center mb-2">
                              <Upload className="w-6 h-6 text-kath-gold" />
                            </div>
                            <p className="font-body text-kath-white text-sm">Klik untuk upload portofolio</p>
                            <p className="font-body text-kath-off-white/50 text-xs">Format PDF, maksimal 10MB</p>
                          </>
                        )}
                      </div>
                    </div>
                    {errors.portfolioFile && <p className="text-red-500 text-xs mt-1">{errors.portfolioFile}</p>}
                  </div>

                  {/* ID Card Upload */}
                  <div>
                    <label className="block font-body text-sm text-kath-off-white mb-2">
                      KTP/Kartu Identitas <span className="text-kath-gold">*</span>
                      <span className="text-kath-off-white/50 text-xs ml-2">PDF/JPG/PNG, Max 5MB</span>
                    </label>
                    <div
                      onClick={() => idCardInputRef.current?.click()}
                      className={`relative cursor-pointer border-2 border-dashed rounded-xl p-6 transition-colors ${
                        errors.idCardFile
                          ? 'border-red-500 bg-red-500/5'
                          : formData.idCardFile
                            ? 'border-green-500 bg-green-500/5'
                            : 'border-kath-charcoal/50 hover:border-kath-gold/50 bg-kath-black/30'
                      }`}
                    >
                      <input
                        ref={idCardInputRef}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange('idCardFile', e)}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center text-center">
                        {formData.idCardFile ? (
                          <>
                            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
                              <CreditCard className="w-6 h-6 text-green-500" />
                            </div>
                            <p className="font-body text-kath-white text-sm">{formData.idCardFile.name}</p>
                            <p className="font-body text-kath-off-white/50 text-xs">
                              {formatFileSize(formData.idCardFile.size)}
                            </p>
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-12 rounded-full bg-kath-gold/20 flex items-center justify-center mb-2">
                              <CreditCard className="w-6 h-6 text-kath-gold" />
                            </div>
                            <p className="font-body text-kath-white text-sm">Klik untuk upload KTP</p>
                            <p className="font-body text-kath-off-white/50 text-xs">Format PDF, JPG, atau PNG</p>
                          </>
                        )}
                      </div>
                    </div>
                    {errors.idCardFile && <p className="text-red-500 text-xs mt-1">{errors.idCardFile}</p>}
                  </div>

                  {/* Student Card Upload (for student competition) */}
                  {isStudentCompetition && (
                    <div>
                      <label className="block font-body text-sm text-kath-off-white mb-2">
                        Kartu Mahasiswa <span className="text-kath-gold">*</span>
                        <span className="text-kath-off-white/50 text-xs ml-2">PDF/JPG/PNG, Max 5MB</span>
                      </label>
                      <div
                        onClick={() => studentCardInputRef.current?.click()}
                        className={`relative cursor-pointer border-2 border-dashed rounded-xl p-6 transition-colors ${
                          errors.studentCardFile
                            ? 'border-red-500 bg-red-500/5'
                            : formData.studentCardFile
                              ? 'border-green-500 bg-green-500/5'
                              : 'border-kath-charcoal/50 hover:border-kath-gold/50 bg-kath-black/30'
                        }`}
                      >
                        <input
                          ref={studentCardInputRef}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange('studentCardFile', e)}
                          className="hidden"
                        />
                        <div className="flex flex-col items-center text-center">
                          {formData.studentCardFile ? (
                            <>
                              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
                                <GraduationCap className="w-6 h-6 text-green-500" />
                              </div>
                              <p className="font-body text-kath-white text-sm">{formData.studentCardFile.name}</p>
                              <p className="font-body text-kath-off-white/50 text-xs">
                                {formatFileSize(formData.studentCardFile.size)}
                              </p>
                            </>
                          ) : (
                            <>
                              <div className="w-12 h-12 rounded-full bg-kath-gold/20 flex items-center justify-center mb-2">
                                <GraduationCap className="w-6 h-6 text-kath-gold" />
                              </div>
                              <p className="font-body text-kath-white text-sm">Klik untuk upload KTM</p>
                              <p className="font-body text-kath-off-white/50 text-xs">Format PDF, JPG, atau PNG</p>
                            </>
                          )}
                        </div>
                      </div>
                      {errors.studentCardFile && <p className="text-red-500 text-xs mt-1">{errors.studentCardFile}</p>}
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-kath-charcoal/30" />

                {/* Section: Additional Information */}
                <div className="space-y-4">
                  <h3 className="font-display text-lg text-kath-gold flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Informasi Tambahan
                  </h3>

                  {/* Motivation */}
                  <div>
                    <label className="block font-body text-sm text-kath-off-white mb-2">
                      Motivasi Mengikuti Lomba <span className="text-kath-gold">*</span>
                      <span className="text-kath-off-white/50 text-xs ml-2">Minimal 50 karakter</span>
                    </label>
                    <textarea
                      name="motivation"
                      value={formData.motivation}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Ceritakan mengapa Anda ingin mengikuti kompetisi ini, apa yang memotivasi Anda, dan apa yang ingin Anda capai..."
                      className={`w-full px-4 py-3 bg-kath-black/50 border rounded-xl font-body text-kath-white placeholder-kath-off-white/30 focus:outline-none focus:border-kath-gold transition-colors resize-none ${
                        errors.motivation ? 'border-red-500' : 'border-kath-charcoal/50'
                      }`}
                    />
                    <div className="flex justify-between mt-1">
                      {errors.motivation ? (
                        <p className="text-red-500 text-xs">{errors.motivation}</p>
                      ) : (
                        <span />
                      )}
                      <span className="text-kath-off-white/40 text-xs">{formData.motivation.length} karakter</span>
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block font-body text-sm text-kath-off-white mb-2">
                      Pengalaman Terkait (Opsional)
                    </label>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Ceritakan pengalaman Anda di bidang event/wedding/design/fotografi (jika ada)"
                      className="w-full px-4 py-3 bg-kath-black/50 border border-kath-charcoal/50 rounded-xl font-body text-kath-white placeholder-kath-off-white/30 focus:outline-none focus:border-kath-gold transition-colors resize-none"
                    />
                  </div>

                  {/* Referral */}
                  <div>
                    <label className="block font-body text-sm text-kath-off-white mb-2">
                      Referral Code (Opsional)
                    </label>
                    <input
                      type="text"
                      name="referral"
                      value={formData.referral}
                      onChange={handleChange}
                      placeholder="Masukkan kode referral jika ada"
                      className="w-full px-4 py-3 bg-kath-black/50 border border-kath-charcoal/50 rounded-xl font-body text-kath-white placeholder-kath-off-white/30 focus:outline-none focus:border-kath-gold transition-colors"
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-kath-charcoal/30" />

                {/* Section: Agreements */}
                <div className="space-y-4">
                  <h3 className="font-display text-lg text-kath-gold">Persyaratan & Ketentuan</h3>

                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreement"
                        checked={formData.agreement}
                        onChange={handleChange}
                        className="w-5 h-5 mt-0.5 rounded border-kath-charcoal/50 bg-kath-black/50 text-kath-gold focus:ring-kath-gold"
                      />
                      <span className="font-body text-sm text-kath-off-white/70">
                        Saya menyetujui <span className="text-kath-gold">syarat dan ketentuan</span> kompetisi serta bersedia mengikuti seluruh rangkaian kegiatan dengan penuh tanggung jawab. *
                      </span>
                    </label>
                    {errors.agreement && <p className="text-red-500 text-xs ml-8">{errors.agreement}</p>}

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="dataConsent"
                        checked={formData.dataConsent}
                        onChange={handleChange}
                        className="w-5 h-5 mt-0.5 rounded border-kath-charcoal/50 bg-kath-black/50 text-kath-gold focus:ring-kath-gold"
                      />
                      <span className="font-body text-sm text-kath-off-white/70">
                        Saya menyetujui penggunaan data pribadi saya untuk keperluan kompetisi ini dan komunikasi terkait acara. *
                      </span>
                    </label>
                    {errors.dataConsent && <p className="text-red-500 text-xs ml-8">{errors.dataConsent}</p>}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-kath-gold hover:bg-kath-gold-light disabled:opacity-50 disabled:cursor-not-allowed text-kath-black font-body text-sm uppercase tracking-wider rounded-full transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-kath-black/30 border-t-kath-black rounded-full animate-spin" />
                      Mengirim Pendaftaran...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Kirim Pendaftaran
                    </>
                  )}
                </button>

                <p className="text-center font-body text-kath-off-white/40 text-xs pb-4">
                  * Wajib diisi
                </p>
              </form>
            ) : (
              /* Success State */
              <div className="p-8 sm:p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="font-display text-2xl sm:text-3xl text-kath-white mb-3">
                  Pendaftaran Berhasil!
                </h2>
                <p className="font-body text-kath-off-white/70 mb-2 max-w-md mx-auto">
                  Terima kasih telah mendaftar kompetisi KATH Event Organizer.
                </p>
                <p className="font-body text-kath-gold mb-8 max-w-md mx-auto">
                  Tim kami akan mengirimkan konfirmasi dan detail pembayaran (jika ada) ke email Anda dalam waktu 1-2 hari kerja.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleClose}
                    className="px-8 py-3 bg-kath-gold hover:bg-kath-gold-light text-kath-black font-body text-sm uppercase tracking-wider rounded-full transition-all duration-300"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionForm;
