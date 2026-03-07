import { useState } from 'react';
import { X, Send, CheckCircle, User, Mail, Phone, Building, Upload, Award } from 'lucide-react';

interface CompetitionFormProps {
  isOpen: boolean;
  onClose: () => void;
  competitionName?: string;
}

const CompetitionForm = ({ isOpen, onClose, competitionName = '' }: CompetitionFormProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    institution: '',
    competitionCategory: competitionName || '',
    teamName: '',
    teamMembers: '',
    portfolio: '',
    motivation: '',
    agreement: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'Wedding Concept Competition',
    'Event Design Challenge',
    'Event Photography Contest',
    'Student Event Competition',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Nama lengkap wajib diisi';
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Nomor telepon wajib diisi';
    if (!formData.competitionCategory) newErrors.competitionCategory = 'Kategori lomba wajib dipilih';
    if (!formData.motivation.trim()) newErrors.motivation = 'Motivasi wajib diisi';
    if (!formData.agreement) newErrors.agreement = 'Anda harus menyetujui syarat dan ketentuan';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      // Reset form after animation
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          institution: '',
          competitionCategory: '',
          teamName: '',
          teamMembers: '',
          portfolio: '',
          motivation: '',
          agreement: false,
        });
      }, 300);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-kath-black/95 backdrop-blur-xl"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-kath-dark-gray border border-kath-charcoal/50 rounded-3xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-kath-black/50 hover:bg-kath-gold/20 rounded-full flex items-center justify-center text-kath-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[90vh]">
          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="p-6 sm:p-8 border-b border-kath-charcoal/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-kath-gold/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-kath-gold" />
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
                <p className="font-body text-kath-off-white/60 text-sm mt-2">
                  Lengkapi data diri Anda untuk mengikuti kompetisi KATH Event Organizer
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
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
                      placeholder="Masukkan nama lengkap"
                      className={`w-full pl-12 pr-4 py-3 bg-kath-black/50 border rounded-xl font-body text-kath-white placeholder-kath-off-white/30 focus:outline-none focus:border-kath-gold transition-colors ${
                        errors.fullName ? 'border-red-500' : 'border-kath-charcoal/50'
                      }`}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                  )}
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
                        placeholder="08123456789"
                        className={`w-full pl-12 pr-4 py-3 bg-kath-black/50 border rounded-xl font-body text-kath-white placeholder-kath-off-white/30 focus:outline-none focus:border-kath-gold transition-colors ${
                          errors.phone ? 'border-red-500' : 'border-kath-charcoal/50'
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Institution */}
                <div>
                  <label className="block font-body text-sm text-kath-off-white mb-2">
                    Institusi/Perusahaan
                  </label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kath-off-white/40" />
                    <input
                      type="text"
                      name="institution"
                      value={formData.institution}
                      onChange={handleChange}
                      placeholder="Nama institusi atau perusahaan (opsional)"
                      className="w-full pl-12 pr-4 py-3 bg-kath-black/50 border border-kath-charcoal/50 rounded-xl font-body text-kath-white placeholder-kath-off-white/30 focus:outline-none focus:border-kath-gold transition-colors"
                    />
                  </div>
                </div>

                {/* Competition Category */}
                <div>
                  <label className="block font-body text-sm text-kath-off-white mb-2">
                    Kategori Lomba <span className="text-kath-gold">*</span>
                  </label>
                  <select
                    name="competitionCategory"
                    value={formData.competitionCategory}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-kath-black/50 border rounded-xl font-body text-kath-white focus:outline-none focus:border-kath-gold transition-colors appearance-none ${
                      errors.competitionCategory ? 'border-red-500' : 'border-kath-charcoal/50'
                    }`}
                    style={{ backgroundImage: 'none' }}
                  >
                    <option value="" className="bg-kath-dark-gray">Pilih kategori</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat} className="bg-kath-dark-gray">{cat}</option>
                    ))}
                  </select>
                  {errors.competitionCategory && (
                    <p className="text-red-500 text-xs mt-1">{errors.competitionCategory}</p>
                  )}
                </div>

                {/* Team Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-body text-sm text-kath-off-white mb-2">
                      Nama Tim
                    </label>
                    <input
                      type="text"
                      name="teamName"
                      value={formData.teamName}
                      onChange={handleChange}
                      placeholder="Nama tim (jika ada)"
                      className="w-full px-4 py-3 bg-kath-black/50 border border-kath-charcoal/50 rounded-xl font-body text-kath-white placeholder-kath-off-white/30 focus:outline-none focus:border-kath-gold transition-colors"
                    />
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

                {/* Portfolio Link */}
                <div>
                  <label className="block font-body text-sm text-kath-off-white mb-2">
                    Link Portfolio
                  </label>
                  <div className="relative">
                    <Upload className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kath-off-white/40" />
                    <input
                      type="url"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleChange}
                      placeholder="https://drive.google.com/... atau link portfolio"
                      className="w-full pl-12 pr-4 py-3 bg-kath-black/50 border border-kath-charcoal/50 rounded-xl font-body text-kath-white placeholder-kath-off-white/30 focus:outline-none focus:border-kath-gold transition-colors"
                    />
                  </div>
                  <p className="text-kath-off-white/40 text-xs mt-1">
                    Upload portfolio Anda ke Google Drive, Dropbox, atau platform lain
                  </p>
                </div>

                {/* Motivation */}
                <div>
                  <label className="block font-body text-sm text-kath-off-white mb-2">
                    Motivasi Mengikuti Lomba <span className="text-kath-gold">*</span>
                  </label>
                  <textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Ceritakan mengapa Anda ingin mengikuti kompetisi ini..."
                    className={`w-full px-4 py-3 bg-kath-black/50 border rounded-xl font-body text-kath-white placeholder-kath-off-white/30 focus:outline-none focus:border-kath-gold transition-colors resize-none ${
                      errors.motivation ? 'border-red-500' : 'border-kath-charcoal/50'
                    }`}
                  />
                  {errors.motivation && (
                    <p className="text-red-500 text-xs mt-1">{errors.motivation}</p>
                  )}
                </div>

                {/* Agreement */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreement"
                      checked={formData.agreement}
                      onChange={handleChange}
                      className="w-5 h-5 mt-0.5 rounded border-kath-charcoal/50 bg-kath-black/50 text-kath-gold focus:ring-kath-gold"
                    />
                    <span className="font-body text-sm text-kath-off-white/70">
                      Saya menyetujui syarat dan ketentuan kompetisi serta bersedia mengikuti seluruh rangkaian kegiatan.
                    </span>
                  </label>
                  {errors.agreement && (
                    <p className="text-red-500 text-xs mt-1">{errors.agreement}</p>
                  )}
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
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Daftar Sekarang
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="p-8 sm:p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl text-kath-white mb-3">
                Pendaftaran Berhasil!
              </h2>
              <p className="font-body text-kath-off-white/70 mb-8 max-w-md mx-auto">
                Terima kasih telah mendaftar. Tim kami akan mengirimkan konfirmasi ke email Anda dalam waktu 1-2 hari kerja.
              </p>
              <button
                onClick={handleClose}
                className="px-8 py-3 bg-kath-gold hover:bg-kath-gold-light text-kath-black font-body text-sm uppercase tracking-wider rounded-full transition-all duration-300"
              >
                Tutup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompetitionForm;
