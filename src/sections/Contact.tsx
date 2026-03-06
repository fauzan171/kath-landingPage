import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { contactConfig } from '../config';
import { Mail, Phone, MapPin, Clock, Instagram, Facebook, Linkedin, Send, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  
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
    alert('Thank you for your inquiry! We will contact you soon.');
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

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full bg-kath-black py-24 md:py-32"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-kath-gold/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-kath-gold/5 rounded-full blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12 md:mb-16">
          <span className="font-body text-kath-gold text-xs uppercase tracking-[0.3em]">
            {contactConfig.sectionLabel}
          </span>
          <h2 className="font-display text-headline text-kath-white mt-4">
            {contactConfig.sectionTitle}
          </h2>
          <p className="font-body text-kath-off-white/60 mt-4 max-w-2xl mx-auto">
            {contactConfig.sectionDescription}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-body text-sm text-kath-off-white/70 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-kath-dark-gray border border-kath-charcoal rounded-lg font-body text-kath-white placeholder-kath-off-white/30 focus:border-kath-gold focus:outline-none transition-colors"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block font-body text-sm text-kath-off-white/70 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-kath-dark-gray border border-kath-charcoal rounded-lg font-body text-kath-white placeholder-kath-off-white/30 focus:border-kath-gold focus:outline-none transition-colors"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-body text-sm text-kath-off-white/70 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-kath-dark-gray border border-kath-charcoal rounded-lg font-body text-kath-white placeholder-kath-off-white/30 focus:border-kath-gold focus:outline-none transition-colors"
                  placeholder="+62 812 3456 7890"
                />
              </div>
              <div>
                <label className="block font-body text-sm text-kath-off-white/70 mb-2">
                  Event Type
                </label>
                <select
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  className="w-full px-4 py-3 bg-kath-dark-gray border border-kath-charcoal rounded-lg font-body text-kath-white focus:border-kath-gold focus:outline-none transition-colors"
                  required
                >
                  <option value="">Select Event Type</option>
                  <option value="wedding">Wedding</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="birthday">Birthday Celebration</option>
                  <option value="exhibition">Exhibition</option>
                  <option value="private">Private Party</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-body text-sm text-kath-off-white/70 mb-2">
                Your Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 bg-kath-dark-gray border border-kath-charcoal rounded-lg font-body text-kath-white placeholder-kath-off-white/30 focus:border-kath-gold focus:outline-none transition-colors resize-none"
                placeholder="Tell us about your event..."
                required
              />
            </div>

            <button
              type="submit"
              className="group w-full md:w-auto px-8 py-4 bg-kath-gold hover:bg-kath-gold-light text-kath-black font-body text-sm uppercase tracking-wider rounded-full transition-all duration-300 flex items-center justify-center gap-2"
            >
              {contactConfig.ctaText}
              <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Contact Info */}
          <div ref={infoRef} className="space-y-8">
            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-kath-dark-gray/50 border border-kath-charcoal/50 rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-kath-gold/10 flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5 text-kath-gold" />
                </div>
                <h4 className="font-body text-sm text-kath-off-white/60 mb-1">Email</h4>
                <a
                  href={`mailto:${contactConfig.contactInfo.email}`}
                  className="font-body text-kath-white hover:text-kath-gold transition-colors"
                >
                  {contactConfig.contactInfo.email}
                </a>
              </div>

              <div className="p-6 bg-kath-dark-gray/50 border border-kath-charcoal/50 rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-kath-gold/10 flex items-center justify-center mb-4">
                  <Phone className="w-5 h-5 text-kath-gold" />
                </div>
                <h4 className="font-body text-sm text-kath-off-white/60 mb-1">Phone</h4>
                <a
                  href={`tel:${contactConfig.contactInfo.phone}`}
                  className="font-body text-kath-white hover:text-kath-gold transition-colors"
                >
                  {contactConfig.contactInfo.phone}
                </a>
              </div>

              <div className="p-6 bg-kath-dark-gray/50 border border-kath-charcoal/50 rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-kath-gold/10 flex items-center justify-center mb-4">
                  <MapPin className="w-5 h-5 text-kath-gold" />
                </div>
                <h4 className="font-body text-sm text-kath-off-white/60 mb-1">Address</h4>
                <p className="font-body text-kath-white">
                  {contactConfig.contactInfo.address}
                </p>
              </div>

              <div className="p-6 bg-kath-dark-gray/50 border border-kath-charcoal/50 rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-kath-gold/10 flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5 text-kath-gold" />
                </div>
                <h4 className="font-body text-sm text-kath-off-white/60 mb-1">Working Hours</h4>
                <p className="font-body text-kath-white">
                  {contactConfig.contactInfo.hours}
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="p-6 bg-kath-dark-gray/30 border border-kath-charcoal/30 rounded-xl">
              <h4 className="font-body text-sm text-kath-off-white/60 mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a
                  href={contactConfig.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-kath-charcoal/50 flex items-center justify-center hover:bg-kath-gold/20 hover:border-kath-gold border border-transparent transition-all duration-300"
                >
                  <Instagram className="w-5 h-5 text-kath-white" />
                </a>
                <a
                  href={contactConfig.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-kath-charcoal/50 flex items-center justify-center hover:bg-kath-gold/20 hover:border-kath-gold border border-transparent transition-all duration-300"
                >
                  <Facebook className="w-5 h-5 text-kath-white" />
                </a>
                <a
                  href={contactConfig.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-kath-charcoal/50 flex items-center justify-center hover:bg-kath-gold/20 hover:border-kath-gold border border-transparent transition-all duration-300"
                >
                  <Linkedin className="w-5 h-5 text-kath-white" />
                </a>
              </div>
            </div>

            {/* CTA Card */}
            <div className="p-6 bg-gradient-to-br from-kath-gold/20 to-kath-gold/5 border border-kath-gold/30 rounded-xl">
              <h4 className="font-display text-xl text-kath-white mb-2">
                Ready to Get Started?
              </h4>
              <p className="font-body text-sm text-kath-off-white/70 mb-4">
                Book a free consultation with our event experts today.
              </p>
              <a
                href={`mailto:${contactConfig.contactInfo.email}`}
                className="group inline-flex items-center gap-2 font-body text-sm text-kath-gold hover:text-kath-gold-light transition-colors"
              >
                Schedule a Call
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
