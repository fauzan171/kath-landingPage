import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { contactConfig } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { Mail, Phone, MapPin, Clock, Instagram, Facebook, Linkedin, Send, ArrowRight, Twitter } from 'lucide-react';

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
    gsap.set(info, { opacity: 0, x: 40 });
    const infoTrigger = ScrollTrigger.create({
      trigger: info,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.to(info, {
          opacity: 1,
          x: 0,
          duration: 0.8,
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
      className="relative w-full bg-[#F9F8F6] py-24 md:py-32"
    >
      {/* Background decoration - emas transparan yang soft */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFB22C]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFB22C]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12 md:mb-16">
          <span className="font-body text-[#FFB22C] text-xs font-bold uppercase tracking-[0.3em]">
            {contactConfig.sectionLabel[language]}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[#0F0F0F] mt-4 tracking-tight">
            {contactConfig.sectionTitle[language]}
          </h2>
          <p className="font-body text-[#0F0F0F]/60 mt-4 max-w-2xl mx-auto">
            {contactConfig.sectionDescription[language]}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Contact Form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block font-body text-sm font-medium text-[#0F0F0F]/80 mb-2">
                  {labels.name}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-[#0F0F0F]/10 rounded-lg font-body text-[#0F0F0F] placeholder-[#0F0F0F]/30 focus:border-[#FFB22C] focus:bg-white focus:shadow-md focus:shadow-[#FFB22C]/10 focus:outline-none transition-all duration-300"
                  placeholder={labels.placeholders.name}
                  required
                />
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-[#0F0F0F]/80 mb-2">
                  {labels.email}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-[#0F0F0F]/10 rounded-lg font-body text-[#0F0F0F] placeholder-[#0F0F0F]/30 focus:border-[#FFB22C] focus:bg-white focus:shadow-md focus:shadow-[#FFB22C]/10 focus:outline-none transition-all duration-300"
                  placeholder={labels.placeholders.email}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block font-body text-sm font-medium text-[#0F0F0F]/80 mb-2">
                  {labels.phone}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-[#0F0F0F]/10 rounded-lg font-body text-[#0F0F0F] placeholder-[#0F0F0F]/30 focus:border-[#FFB22C] focus:bg-white focus:shadow-md focus:shadow-[#FFB22C]/10 focus:outline-none transition-all duration-300"
                  placeholder={labels.placeholders.phone}
                />
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-[#0F0F0F]/80 mb-2">
                  {labels.eventType}
                </label>
                <select
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-[#0F0F0F]/10 rounded-lg font-body text-[#0F0F0F] focus:border-[#FFB22C] focus:bg-white focus:shadow-md focus:shadow-[#FFB22C]/10 focus:outline-none transition-all duration-300"
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
              <label className="block font-body text-sm font-medium text-[#0F0F0F]/80 mb-2">
                {labels.message}
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 bg-white border border-[#0F0F0F]/10 rounded-lg font-body text-[#0F0F0F] placeholder-[#0F0F0F]/30 focus:border-[#FFB22C] focus:bg-white focus:shadow-md focus:shadow-[#FFB22C]/10 focus:outline-none transition-all duration-300 resize-none"
                placeholder={labels.placeholders.message}
                required
              />
            </div>

            <button
              type="submit"
              className="group w-full md:w-auto px-8 py-4 bg-[#FFB22C] hover:bg-[#e59f27] text-[#0F0F0F] font-body font-bold text-sm uppercase tracking-wider rounded-full shadow-lg shadow-[#FFB22C]/20 transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5"
            >
              {contactConfig.ctaText[language]}
              <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Contact Info */}
          <div ref={infoRef} className="space-y-8">
            {/* Contact Details */}
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <div className="p-4 md:p-6 bg-white border border-[#0F0F0F]/5 rounded-xl md:rounded-2xl hover:border-[#FFB22C]/30 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#F9F8F6] shadow-sm flex items-center justify-center mb-3 md:mb-4 border border-[#0F0F0F]/5">
                  <Mail className="w-4 h-4 md:w-5 md:h-5 text-[#FFB22C]" />
                </div>
                <h4 className="font-body text-sm font-semibold text-[#0F0F0F]/60 mb-1">{labels.contactInfo.email}</h4>
                <a
                  href={`mailto:${contactConfig.contactInfo.email}`}
                  className="font-display font-medium text-[#0F0F0F] hover:text-[#FFB22C] transition-colors break-all"
                >
                  {contactConfig.contactInfo.email}
                </a>
              </div>

              <div className="p-4 md:p-6 bg-white border border-[#0F0F0F]/5 rounded-xl md:rounded-2xl hover:border-[#FFB22C]/30 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#F9F8F6] shadow-sm flex items-center justify-center mb-3 md:mb-4 border border-[#0F0F0F]/5">
                  <Phone className="w-4 h-4 md:w-5 md:h-5 text-[#FFB22C]" />
                </div>
                <h4 className="font-body text-sm font-semibold text-[#0F0F0F]/60 mb-1">{labels.contactInfo.phone}</h4>
                <a
                  href={`tel:${contactConfig.contactInfo.phone}`}
                  className="font-display font-medium text-[#0F0F0F] hover:text-[#FFB22C] transition-colors"
                >
                  {contactConfig.contactInfo.phone}
                </a>
              </div>

              <div className="p-4 md:p-6 bg-white border border-[#0F0F0F]/5 rounded-xl md:rounded-2xl hover:border-[#FFB22C]/30 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#F9F8F6] shadow-sm flex items-center justify-center mb-3 md:mb-4 border border-[#0F0F0F]/5">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-[#FFB22C]" />
                </div>
                <h4 className="font-body text-sm font-semibold text-[#0F0F0F]/60 mb-1">{labels.contactInfo.address}</h4>
                <p className="font-display font-medium text-[#0F0F0F]">
                  {contactConfig.contactInfo.address[language]}
                </p>
              </div>

              <div className="p-4 md:p-6 bg-white border border-[#0F0F0F]/5 rounded-xl md:rounded-2xl hover:border-[#FFB22C]/30 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#F9F8F6] shadow-sm flex items-center justify-center mb-3 md:mb-4 border border-[#0F0F0F]/5">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 text-[#FFB22C]" />
                </div>
                <h4 className="font-body text-sm font-semibold text-[#0F0F0F]/60 mb-1">{labels.contactInfo.hours}</h4>
                <p className="font-display font-medium text-[#0F0F0F]">
                  {contactConfig.contactInfo.hours[language]}
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="p-4 md:p-6 bg-white border border-[#0F0F0F]/5 rounded-xl md:rounded-2xl">
              <h4 className="font-body text-xs md:text-sm font-semibold text-[#0F0F0F]/60 mb-3 md:mb-4">{labels.followUs}</h4>
              <div className="flex gap-4">
                {[
                  { icon: Instagram, href: contactConfig.socials.instagram },
                  { icon: Facebook, href: contactConfig.socials.facebook },
                  { icon: Linkedin, href: contactConfig.socials.linkedin },
                  { icon: Twitter, href: contactConfig.socials.twitter },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F9F8F6] flex items-center justify-center border border-[#0F0F0F]/10 hover:border-[#FFB22C] hover:bg-[#FFB22C] group transition-all duration-300 shadow-sm"
                  >
                    <social.icon className="w-4 h-4 md:w-5 md:h-5 text-[#0F0F0F] group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* CTA Card */}
            <div className="p-4 md:p-6 bg-[#FFB22C]/10 border border-[#FFB22C]/30 rounded-xl md:rounded-2xl">
              <h4 className="font-display text-lg md:text-xl font-bold text-[#0F0F0F] mb-1.5 md:mb-2">
                {labels.ctaTitle}
              </h4>
              <p className="font-body text-xs md:text-sm text-[#0F0F0F]/70 mb-3 md:mb-4">
                {labels.ctaDesc}
              </p>
              <a
                href={`mailto:${contactConfig.contactInfo.email}`}
                className="group inline-flex items-center gap-2 font-body font-semibold text-sm text-[#0F0F0F] hover:text-[#FFB22C] transition-colors"
              >
                {labels.scheduleCall}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;