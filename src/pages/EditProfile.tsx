import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ChevronLeft,
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  GraduationCap,
  Briefcase,
  Link as LinkIcon,
  Globe,
  Save,
  Loader2,
  CheckCircle2,
  Upload
} from 'lucide-react';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
  city: string;
  institution: string;
  institutionType: string;
  major: string;
  nim: string;
  bio: string;
  linkedin: string;
  website: string;
  portfolio: string;
}

interface FormErrors {
  [key: string]: string;
}

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'personal' | 'education' | 'social'>('personal');

  const [formData, setFormData] = useState<FormData>({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    birthDate: user?.birthDate || '',
    address: user?.address || '',
    city: user?.city || '',
    institution: user?.institution || '',
    institutionType: user?.institutionType || '',
    major: user?.major || '',
    nim: user?.nim || '',
    bio: '',
    linkedin: '',
    website: '',
    portfolio: '',
  });

  const institutionTypes = [
    'Universitas',
    'Politeknik',
    'Sekolah Tinggi',
    'Akademi',
    'Perusahaan',
    'Freelance',
    'Lainnya',
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

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

    if (!formData.city.trim()) {
      newErrors.city = 'Kota wajib diisi';
    }

    if (!formData.institution.trim()) {
      newErrors.institution = 'Institusi wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) {
        alert('Ukuran file maksimal 800KB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update user data
    updateUser({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      institution: formData.institution,
      institutionType: formData.institutionType,
      major: formData.major,
      nim: formData.nim,
    });

    setIsLoading(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      setIsSuccess(false);
      navigate('/dashboard');
    }, 2000);
  };

  const inputClasses = (fieldName: string) => `
    w-full px-4 py-3 bg-white/[0.02] border rounded-xl font-body text-white 
    placeholder-white/30 focus:outline-none focus:border-[#a68a2d]/50 transition-all
    ${errors[fieldName] ? 'border-red-500/50' : 'border-white/5'}
  `;

  const renderPersonalSection = () => (
    <div className="space-y-6">
      {/* Avatar Upload */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <div
            onClick={handleAvatarClick}
            className="w-32 h-32 rounded-full overflow-hidden cursor-pointer group border-4 border-[#a68a2d]/30"
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#a68a2d] to-[#8e7526] flex items-center justify-center">
                <span className="font-display text-[#0a0a0a] text-4xl">
                  {formData.fullName.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </div>
          <button
            type="button"
            onClick={handleAvatarClick}
            className="absolute bottom-0 right-0 w-10 h-10 bg-[#a68a2d] hover:bg-[#c9a94d] text-[#0a0a0a] rounded-full flex items-center justify-center transition-all"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <p className="mt-4 font-body text-white/50 text-sm">Klik untuk mengubah foto profil</p>
        <p className="font-body text-white/30 text-xs">Maksimal 800KB (JPG, PNG)</p>
      </div>

      {/* Name & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-body text-sm text-white/70 mb-2">
            Nama Lengkap <span className="text-[#a68a2d]">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`${inputClasses('fullName')} pl-12`}
              placeholder="Nama lengkap Anda"
            />
          </div>
          {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block font-body text-sm text-white/70 mb-2">
            Email <span className="text-[#a68a2d]">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`${inputClasses('email')} pl-12`}
              placeholder="email@example.com"
            />
          </div>
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      {/* Phone & Birth Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-body text-sm text-white/70 mb-2">
            Nomor Telepon <span className="text-[#a68a2d]">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`${inputClasses('phone')} pl-12`}
              placeholder="081234567890"
            />
          </div>
          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block font-body text-sm text-white/70 mb-2">Tanggal Lahir</label>
          <div className="relative">
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className={`${inputClasses('birthDate')} px-4`}
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block font-body text-sm text-white/70 mb-2">Alamat Lengkap</label>
        <div className="relative">
          <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-white/40" />
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className={`${inputClasses('address')} pl-12 resize-none`}
            placeholder="Alamat lengkap Anda"
          />
        </div>
      </div>

      {/* City */}
      <div>
        <label className="block font-body text-sm text-white/70 mb-2">
          Kota <span className="text-[#a68a2d]">*</span>
        </label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={`${inputClasses('city')} pl-12`}
            placeholder="Kota domisili"
          />
        </div>
        {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
      </div>

      {/* Bio */}
      <div>
        <label className="block font-body text-sm text-white/70 mb-2">Tentang Saya</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={4}
          className={`${inputClasses('bio')} resize-none`}
          placeholder="Ceritakan sedikit tentang diri Anda, pengalaman, dan minat..."
        />
        <p className="mt-1 font-body text-white/30 text-xs text-right">
          {formData.bio.length}/500 karakter
        </p>
      </div>
    </div>
  );

  const renderEducationSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-body text-sm text-white/70 mb-2">
            Jenis Institusi <span className="text-[#a68a2d]">*</span>
          </label>
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <select
              name="institutionType"
              value={formData.institutionType}
              onChange={handleChange}
              className={`${inputClasses('institutionType')} pl-12 appearance-none cursor-pointer`}
            >
              <option value="" className="bg-[#1a1a1a]">Pilih jenis institusi</option>
              {institutionTypes.map((type) => (
                <option key={type} value={type} className="bg-[#1a1a1a]">
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-body text-sm text-white/70 mb-2">
            Nama Institusi <span className="text-[#a68a2d]">*</span>
          </label>
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              className={`${inputClasses('institution')} pl-12`}
              placeholder="Nama universitas/institusi"
            />
          </div>
          {errors.institution && <p className="text-red-400 text-xs mt-1">{errors.institution}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-body text-sm text-white/70 mb-2">Jurusan/Program Studi</label>
          <div className="relative">
            <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              name="major"
              value={formData.major}
              onChange={handleChange}
              className={`${inputClasses('major')} pl-12`}
              placeholder="Contoh: Manajemen Perhotelan"
            />
          </div>
        </div>

        <div>
          <label className="block font-body text-sm text-white/70 mb-2">NIM/NIP</label>
          <div className="relative">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              name="nim"
              value={formData.nim}
              onChange={handleChange}
              className={`${inputClasses('nim')} pl-12`}
              placeholder="Nomor Induk"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSocialSection = () => (
    <div className="space-y-6">
      <div>
        <label className="block font-body text-sm text-white/70 mb-2">LinkedIn</label>
        <div className="relative">
          <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="url"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            className={`${inputClasses('linkedin')} pl-12`}
            placeholder="https://linkedin.com/in/username"
          />
        </div>
      </div>

      <div>
        <label className="block font-body text-sm text-white/70 mb-2">Website Pribadi</label>
        <div className="relative">
          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className={`${inputClasses('website')} pl-12`}
            placeholder="https://www.yourwebsite.com"
          />
        </div>
      </div>

      <div>
        <label className="block font-body text-sm text-white/70 mb-2">Link Portofolio</label>
        <div className="relative">
          <Upload className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="url"
            name="portfolio"
            value={formData.portfolio}
            onChange={handleChange}
            className={`${inputClasses('portfolio')} pl-12`}
            placeholder="https://www.behance.net/username atau link Google Drive"
          />
        </div>
        <p className="mt-1 font-body text-white/40 text-xs">
          Link ke portofolio online Anda (Behance, Dribbble, Google Drive, dll)
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-white/60 hover:text-[#a68a2d] transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-body text-sm">Back</span>
              </button>
              <div className="h-6 w-px bg-white/10" />
              <h1 className="font-display text-xl text-white">Edit Profile</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section Tabs */}
          <div className="flex items-center gap-2 mb-8 bg-white/[0.02] border border-white/5 rounded-xl p-1">
            {[
              { id: 'personal', label: 'Personal Info', icon: User },
              { id: 'education', label: 'Education', icon: GraduationCap },
              { id: 'social', label: 'Social Links', icon: Globe },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-body text-sm transition-all ${
                  activeSection === tab.id
                    ? 'bg-[#a68a2d]/20 text-[#a68a2d]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8">
            {activeSection === 'personal' && renderPersonalSection()}
            {activeSection === 'education' && renderEducationSection()}
            {activeSection === 'social' && renderSocialSection()}

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-white/5">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 text-white/60 hover:text-white font-body text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || isSuccess}
                className="flex items-center gap-2 px-8 py-3 bg-[#a68a2d] hover:bg-[#c9a94d] disabled:bg-[#a68a2d]/50 text-[#0a0a0a] font-body font-medium rounded-xl transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
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

export default EditProfile;
