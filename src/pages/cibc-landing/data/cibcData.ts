export const COMPETITION_DATA = {
    name: "CIBC Power 2026",
    tagline: "Empowering The Next Generation of Sustainable Innovators",
    description: {
        id: "Bergabunglah dalam kompetisi business case terbesar tahun ini. Tunjukkan inovasimu, pecahkan masalah dunia nyata, dan menangkan total hadiah ratusan juta rupiah.",
        en: "Join the biggest business case competition of the year. Showcase your innovation, solve real-world problems, and win a total prize pool of hundreds of millions of rupiah."
    },
    stats: [
        { value: "500+", label: "Participants" },
        { value: "50+", label: "Universities" },
        { value: "15+", label: "Mentors" },
        { value: "100M+", label: "Prize Pool" }
    ],
    themes: [
        {
            title: { id: "Teknologi Hijau", en: "Green Technology" },
            desc: { id: "Inovasi teknologi untuk kelestarian lingkungan.", en: "Technological innovations for environmental sustainability." },
            topics: {
                id: ["Energi Terbarukan", "Manajemen Limbah", "Efisiensi Karbon"],
                en: ["Renewable Energy", "Waste Management", "Carbon Efficiency"]
            }
        },
        {
            title: { id: "Ekonomi Sirkular", en: "Circular Economy" },
            desc: { id: "Model bisnis yang meminimalkan limbah dan memaksimalkan sumber daya.", en: "Business models that minimize waste and maximize resources." },
            topics: {
                id: ["Daur Ulang Produk", "Rantai Pasok Berkelanjutan", "Upcycling"],
                en: ["Product Recycling", "Sustainable Supply Chain", "Upcycling"]
            }
        },
        {
            title: { id: "Dampak Sosial", en: "Social Impact" },
            desc: { id: "Solusi bisnis yang memberdayakan masyarakat.", en: "Business solutions that empower communities." },
            topics: {
                id: ["Pemberdayaan UMKM", "Akses Pendidikan", "Kesehatan Masyarakat"],
                en: ["MSME Empowerment", "Education Access", "Public Health"]
            }
        }
    ],
    timeline: [
        {
            phase: { id: "Pendaftaran Dibuka", en: "Registration Opens" },
            date: { id: "1 Mei 2026", en: "May 1, 2026" },
            location: "Online"
        },
        {
            phase: { id: "Batas Akhir Pendaftaran", en: "Registration Deadline" },
            date: { id: "30 Juni 2026", en: "June 30, 2026" },
            location: "Online"
        },
        {
            phase: { id: "Pengumuman Semifinalis", en: "Semifinalists Announcement" },
            date: { id: "15 Juli 2026", en: "July 15, 2026" },
            location: "Website & Email"
        },
        {
            phase: { id: "Grand Final & Awarding", en: "Grand Final & Awarding" },
            date: { id: "10 Agustus 2026", en: "August 10, 2026" },
            location: "Jakarta, Indonesia"
        }
    ],
    prizes: {
        pool: "Rp 150.000.000",
        categories: {
            student: [
                { place: "Runner Up 2", amount: "Rp 10.000.000", benefits: ["Trophy", "Certificate", "Merchandise"] },
                { place: "1st Winner", amount: "Rp 25.000.000", benefits: ["Trophy", "Certificate", "Incubation Program"] },
                { place: "Runner Up 1", amount: "Rp 15.000.000", benefits: ["Trophy", "Certificate", "Mentorship"] }
            ],
            startup: [
                { place: "Runner Up 2", amount: "Rp 15.000.000", benefits: ["Trophy", "Certificate", "AWS Credits"] },
                { place: "1st Winner", amount: "Rp 40.000.000", benefits: ["Trophy", "Certificate", "Investor Pitch"] },
                { place: "Runner Up 1", amount: "Rp 25.000.000", benefits: ["Trophy", "Certificate", "AWS Credits"] }
            ],
            corporate: [
                { place: "Innovation Award", amount: "Rp 20.000.000", benefits: ["Plaque", "Media Coverage", "Partnership"] }
            ]
        }
    },
    testimonials: [
        {
            quote: {
                id: "Kompetisi ini benar-benar membuka wawasan saya tentang bagaimana bisnis bisa berdampak positif bagi lingkungan.",
                en: "This competition truly opened my eyes to how businesses can have a positive impact on the environment."
            },
            name: "Budi Santoso",
            role: "CEO EcoTech",
            company: "Alumni 2025",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80"
        },
        {
            quote: {
                id: "Mentoring yang diberikan sangat berharga. Kami bisa menyempurnakan produk kami berkat feedback dari para ahli.",
                en: "The mentoring provided was invaluable. We were able to perfect our product thanks to feedback from the experts."
            },
            name: "Sarah Wijaya",
            role: "Product Manager",
            company: "GreenLife",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80"
        }
    ],
    faqs: [
        {
            q: { id: "Siapa saja yang bisa mendaftar?", en: "Who can register?" },
            a: {
                id: "Mahasiswa aktif (D3/D4/S1) dari seluruh universitas di Indonesia dan luar negeri, serta startup tahap awal (early-stage).",
                en: "Active students (Diploma/Bachelor) from all universities in Indonesia and abroad, as well as early-stage startups."
            }
        },
        {
            q: { id: "Apakah ada biaya pendaftaran?", en: "Is there a registration fee?" },
            a: {
                id: "Pendaftaran tahap awal (Early Bird) gratis. Untuk reguler akan dikenakan biaya sebesar Rp 150.000 per tim.",
                en: "Early Bird registration is free. Regular registration will incur a fee of Rp 150,000 per team."
            }
        },
        {
            q: { id: "Berapa anggota maksimal dalam satu tim?", en: "What is the maximum number of members in a team?" },
            a: {
                id: "Setiap tim maksimal terdiri dari 3 orang anggota.",
                en: "Each team consists of a maximum of 3 members."
            }
        }
    ],
    contact: {
        email: "hello@cibcpower.com",
        instagram: "@cibcpower",
        linkedin: "CIBC Power Official",
        twitter: "@cibcpower"
    }
};