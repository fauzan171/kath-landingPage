import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { contactConfig } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { Mail, Phone, MapPin, Clock, Instagram, Facebook, Linkedin, Send, ArrowRight, Twitter, Sparkles } from '../icons';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert(language === 'id' 
      ? 'Terima kasih atas pertanyaan Anda! Kami akan segera menghubungi Anda.' 
      : 'Thank you for your inquiry! We will contact you soon.'
    );
    setFormData({ name: '', email: '', phone: '', eventType: '', message: '' });
  };

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const form = formRef.current;
    const info = infoRef.current;

    if (!section || !header || !form || !info) return;

    const triggers: ScrollTrigger[] = [];

    // Header animation
    gsap.set(header.children, { opacity: 0, y: 30 });
    const headerTrigger = ScrollTrigger.create({
      trigger: header,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(header.children, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
        });
      },
    });
    triggers.push(headerTrigger);

    // Form animation
    gsap.set(form, { opacity: 0, x: -40 });
    const formTrigger = ScrollTrigger.create({
      trigger: form,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.to(form, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
        });
      },
    });
    triggers.push(formTrigger);

    // Info animation
    gsap.set(info.children, { opacity: 0, y: 30 });
    const infoTrigger = ScrollTrigger.create({
      trigger: info,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.to(info.children, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
        });
      },
    });
    triggers.push(infoTrigger);

    return () => {
      triggers.forEach(trigger => trigger.kill());
    };
  }, []);

  const labels = {
    name: language === 'id' ? 'Nama Lengkap' : 'Full Name',
    email: language === 'id' ? 'Alamat Email' : 'Email Address',
    phone: language === 'id' ? 'Nomor Telepon' : 'Phone Number',
    eventType: language === 'id' ? 'Jenis Event' : 'Event Type',
    message: language === 'id' ? 'Pesan Anda' : 'Your Message',
    selectEvent: language === 'id' ? 'Pilih Jenis Event' : 'Select Event Type',
    eventTypes: [
      { value: 'wedding', label: language === 'id' ? 'Pernikahan' : 'Wedding' },
      { value: 'corporate', label: language === 'id' ? 'Event Korporat' : 'Corporate Event' },
      { value: 'birthday', label: language === 'id' ? 'Ulang Tahun' : 'Birthday' },
      { value: 'exhibition', label: language === 'id' ? 'Pameran' : 'Exhibition' },
      { value: 'private', label: language === 'id' ? 'Pesta Pribadi' : 'Private Party' },
      { value: 'other', label: language === 'id' ? 'Lainnya' : 'Other' },
    ],
    placeholders: {
      name: language === 'id' ? 'Nama Anda' : 'Your Name',
      email: language === 'id' ? 'email@anda.com' : 'your@email.com',
      phone: '+62 812 3456 7890',
      message: language === 'id' 
        ? 'Ceritakan tentang event impian Anda...' 
        : 'Tell us about your dream event...',
    },
    contactInfo: {
      email: 'Email',
      phone: language === 'id' ? 'Telepon' : 'Phone',
      address: language === 'id' ? 'Alamat' : 'Address',
      hours: language === 'id' ? 'Jam Kerja' : 'Working Hours',
    },
    followUs: language === 'id' ? 'Ikuti Kami' : 'Follow Us',
    ctaTitle: language === 'id' ? 'Siap Memulai?' : 'Ready to Get Started?',
    ctaDesc: language === 'id' 
      ? 'Jadwalkan konsultasi gratis dengan tim ahli kami hari ini.' 
      : 'Book a free consultation with our expert team today.',
    scheduleCall: language === 'id' ? 'Jadwalkan Panggilan' : 'Schedule a Call',
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full bg-kath-bg-main py-24 md:py-32 overflow-hidden"
    >
      {/* Background decoration - Premium Gold */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-kath-primary/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-kath-primary/3 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-kath-primary/3 to-transparent rounded-full" />
      </div>

      {/* Decorative lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-kath-primary/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Header - Premium Style */}
        <div ref={headerRef} className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-kath-primary/5 border border-kath-primary/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-kath-primary" />
            <span className="font-body text-kath-primary text-xs uppercase tracking-[0.2em]">
              {contactConfig.sectionLabel[language]}
            </span>
          </div>
          <h2 className="font-display text-headline text-kath-text-primary mt-4">
            {language === 'id' ? 'Mari Rencanakan ' : "Let's Plan Your "}
            <span className="text-gold-gradient">{language === 'id' ? 'Event Anda' : 'Event'}</span>
            {language === 'en' && ' Together'}
          </h2>
          <p className="font-body text-kath-text-secondary mt-4 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            {contactConfig.sectionDescription[language]}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Form - Premium Card */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="relative p-8 md:p-10 bg-white border border-kath-primary/10 rounded-3xl shadow-xl shadow-kath-primary/5"
          >
            {/* Corner decorations */}
            <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-kath-primary/30" />
            <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-kath-primary/30" />
            <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-kath-primary/30" />
            <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-kath-primary/30" />

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-body text-sm text-kath-text-secondary mb-2">
                    {labels.name}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3.5 bg-kath-bg-main border border-kath-primary/10 rounded-xl font-body text-kath-text-primary placeholder-kath-text-muted focus:border-kath-primary focus:ring-2 focus:ring-kath-primary/10 focus:outline-none transition-all"
                    placeholder={labels.placeholders.name}
                    required
                  />
                </div>
                <div>
                  <label className="block font-body text-sm text-kath-text-secondary mb-2">
                    {labels.email}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3.5 bg-kath-bg-main border border-kath-primary/10 rounded-xl font-body text-kath-text-primary placeholder-kath-text-muted focus:border-kath-primary focus:ring-2 focus:ring-kath-primary/10 focus:outline-none transition-all"
                    placeholder={labels.placeholders.email}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-body text-sm text-kath-text-secondary mb-2">
                    {labels.phone}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3.5 bg-kath-bg-main border border-kath-primary/10 rounded-xl font-body text-kath-text-primary placeholder-kath-text-muted focus:border-kath-primary focus:ring-2 focus:ring-kath-primary/10 focus:outline-none transition-all"
                    placeholder={labels.placeholders.phone}
                  />
                </div>
                <div>
                  <label className="block font-body text-sm text-kath-text-secondary mb-2">
                    {labels.eventType}
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full px-4 py-3.5 bg-kath-bg-main border border-kath-primary/10 rounded-xl font-body text-kath-text-primary focus:border-kath-primary focus:ring-2 focus:ring-kath-primary/10 focus:outline-none transition-all appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23AE8E1C' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                    required
                  >
                    <option value="">{labels.selectEvent}</option>
                    {labels.eventTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-body text-sm text-kath-text-secondary mb-2">
                  {labels.message}
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3.5 bg-kath-bg-main border border-kath-primary/10 rounded-xl font-body text-kath-text-primary placeholder-kath-text-muted focus:border-kath-primary focus:ring-2 focus:ring-kath-primary/10 focus:outline-none transition-all resize-none"
                  placeholder={labels.placeholders.message}
                  required
                />
              </div>

              <button
                type="submit"
                className="group w-full md:w-auto px-8 py-4 bg-gradient-to-r from-kath-primary to-kath-primary-dark hover:from-kath-primary-light hover:to-kath-primary text-white font-body text-sm uppercase tracking-wider rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-kath-primary/25 hover:shadow-xl hover:shadow-kath-primary/30 hover:-translate-y-0.5"
              >
                {contactConfig.ctaText[language]}
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          {/* Contact Info - Premium Cards */}
          <div ref={infoRef} className="space-y-6">
            {/* Contact Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Email Card */}
              <div className="group p-6 bg-white border border-kath-primary/10 rounded-2xl hover:border-kath-primary/30 hover:shadow-lg hover:shadow-kath-primary/5 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-kath-primary/10 to-kath-primary/5 flex items-center justify-center mb-4 group-hover:from-kath-primary/20 group-hover:to-kath-primary/10 transition-all">
                  <Mail className="w-5 h-5 text-kath-primary" />
                </div>
                <h4 className="font-body text-xs text-kath-text-muted uppercase tracking-wider mb-1">{labels.contactInfo.email}</h4>
                <a
                  href={`mailto:${contactConfig.contactInfo.email}`}
                  className="font-body text-kath-text-primary hover:text-kath-primary transition-colors"
                >
                  {contactConfig.contactInfo.email}
                </a>
              </div>

              {/* Phone Card */}
              <div className="group p-6 bg-white border border-kath-primary/10 rounded-2xl hover:border-kath-primary/30 hover:shadow-lg hover:shadow-kath-primary/5 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-kath-primary/10 to-kath-primary/5 flex items-center justify-center mb-4 group-hover:from-kath-primary/20 group-hover:to-kath-primary/10 transition-all">
                  <Phone className="w-5 h-5 text-kath-primary" />
                </div>
                <h4 className="font-body text-xs text-kath-text-muted uppercase tracking-wider mb-1">{labels.contactInfo.phone}</h4>
                <a
                  href={`tel:${contactConfig.contactInfo.phone}`}
                  className="font-body text-kath-text-primary hover:text-kath-primary transition-colors"
                >
                  {contactConfig.contactInfo.phone}
                </a>
              </div>

              {/* Address Card */}
              <div className="group p-6 bg-white border border-kath-primary/10 rounded-2xl hover:border-kath-primary/30 hover:shadow-lg hover:shadow-kath-primary/5 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-kath-primary/10 to-kath-primary/5 flex items-center justify-center mb-4 group-hover:from-kath-primary/20 group-hover:to-kath-primary/10 transition-all">
                  <MapPin className="w-5 h-5 text-kath-primary" />
                </div>
                <h4 className="font-body text-xs text-kath-text-muted uppercase tracking-wider mb-1">{labels.contactInfo.address}</h4>
                <p className="font-body text-kath-text-primary text-sm leading-relaxed">
                  {contactConfig.contactInfo.address[language]}
                </p>
              </div>

              {/* Hours Card */}
              <div className="group p-6 bg-white border border-kath-primary/10 rounded-2xl hover:border-kath-primary/30 hover:shadow-lg hover:shadow-kath-primary/5 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-kath-primary/10 to-kath-primary/5 flex items-center justify-center mb-4 group-hover:from-kath-primary/20 group-hover:to-kath-primary/10 transition-all">
                  <Clock className="w-5 h-5 text-kath-primary" />
                </div>
                <h4 className="font-body text-xs text-kath-text-muted uppercase tracking-wider mb-1">{labels.contactInfo.hours}</h4>
                <p className="font-body text-kath-text-primary text-sm">
                  {contactConfig.contactInfo.hours[language]}
                </p>
              </div>
            </div>

            {/* Social Links - Premium Style */}
            <div className="p-6 bg-kath-bg-dark rounded-2xl">
              <h4 className="font-body text-xs text-kath-primary uppercase tracking-wider mb-4">{labels.followUs}</h4>
              <div className="flex gap-3">
                <a
                  href={contactConfig.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-kath-primary/20 hover:border-kath-primary/50 transition-all duration-300 group"
                >
                  <Instagram className="w-5 h-5 text-white/70 group-hover:text-kath-primary transition-colors" />
                </a>
                <a
                  href={contactConfig.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-kath-primary/20 hover:border-kath-primary/50 transition-all duration-300 group"
                >
                  <Facebook className="w-5 h-5 text-white/70 group-hover:text-kath-primary transition-colors" />
                </a>
                <a
                  href={contactConfig.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-kath-primary/20 hover:border-kath-primary/50 transition-all duration-300 group"
                >
                  <Linkedin className="w-5 h-5 text-white/70 group-hover:text-kath-primary transition-colors" />
                </a>
                <a
                  href={contactConfig.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-kath-primary/20 hover:border-kath-primary/50 transition-all duration-300 group"
                >
                  <Twitter className="w-5 h-5 text-white/70 group-hover:text-kath-primary transition-colors" />
                </a>
              </div>
            </div>

            {/* CTA Card - Premium Gold */}
            <div className="relative p-6 bg-gradient-to-br from-kath-primary to-kath-primary-dark rounded-2xl overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-2xl" />
              </div>
              
              <div className="relative">
                <h4 className="font-display text-xl text-white mb-2">
                  {labels.ctaTitle}
                </h4>
                <p className="font-body text-sm text-white/80 mb-4">
                  {labels.ctaDesc}
                </p>
                <a
                  href={`mailto:${contactConfig.contactInfo.email}`}
                  className="group inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full font-body text-sm text-white transition-all duration-300"
                >
                  {labels.scheduleCall}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section divider */}
      <div className="section-divider mt-24 md:mt-32" />
    </section>
  );
};

export default Contact;
