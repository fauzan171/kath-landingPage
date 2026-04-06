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
                id: "Setiap tim maksimal terdiri dari 3 orang anggota untuk kategori mahasiswa, dan 2-6 orang untuk kategori startup/korporat.",
                en: "Each team consists of a maximum of 3 members for the student category, and 2-6 members for the startup/corporate categories."
            }
        },
        {
            q: { id: "Apakah boleh menggunakan BMC yang sudah ada?", en: "Can I use an existing BMC?" },
            a: {
                id: "Tidak. Semua BMC yang disubmit harus merupakan karya orisinal yang dibuat khusus untuk CIBC 2026. Penggunaan BMC yang sudah pernah disubmit ke kompetisi lain harus didiskusikan terlebih dahulu dengan panitia.",
                en: "No. All submitted BMCs must be original work created specifically for CIBC 2026. Using BMCs previously submitted to other competitions must be disclosed to the committee first."
            }
        },
        {
            q: { id: "Bagaimana jika anggota tim keluar sebelum deadline?", en: "What if a team member leaves before the deadline?" },
            a: {
                id: "Tim dapat mengganti anggota maksimal 1 orang sebelum deadline pendaftaran. Setelah deadline, komposisi tim tidak dapat diubah. Hubungi panitia untuk proses penggantian.",
                en: "Teams may replace up to 1 member before the registration deadline. After the deadline, team composition cannot be changed. Contact the committee for the replacement process."
            }
        },
        {
            q: { id: "Apakah boleh submit lebih dari satu ide?", en: "Can I submit more than one idea?" },
            a: {
                id: "Tidak. Setiap tim hanya boleh submit SATU (1) BMC. Namun, revisi diperbolehkan sebelum deadline pengumpulan.",
                en: "No. Each team may submit only ONE (1) BMC. However, revisions are allowed before the submission deadline."
            }
        },
        {
            q: { id: "Format file apa yang diterima? Berapa ukuran maksimal?", en: "What file formats are accepted? What is the maximum file size?" },
            a: {
                id: "Format yang diterima: PDF, PPTX, DOCX, PNG, JPG. Ukuran maksimal per file: 10MB. Maksimal 5 file per submission.",
                en: "Accepted formats: PDF, PPTX, DOCX, PNG, JPG. Maximum file size: 10MB per file. Maximum 5 files per submission."
            }
        },
        {
            q: { id: "Apakah ada mentoring sebelum final?", en: "Is there mentoring before the finals?" },
            a: {
                id: "Ya! Semifinalis akan mendapat sesi mentoring eksklusif dengan para ahli industri dan akademisi sebelum grand final.",
                en: "Yes! Semifinalists will receive exclusive mentoring sessions with industry experts and academics before the grand final."
            }
        },
        {
            q: { id: "Kapan pengumuman hasil?", en: "When will results be announced?" },
            a: {
                id: "Pengumuman semifinalis: 15 Juli 2026. Pengumuman pemenang grand final: 10 Agustus 2026. Hasil akan dikirim via email dan dipublikasikan di website.",
                en: "Semifinalists announcement: July 15, 2026. Grand final winners announcement: August 10, 2026. Results will be sent via email and published on the website."
            }
        },
        {
            q: { id: "Bagaimana proses penilaian?", en: "How does the judging process work?" },
            a: {
                id: "Penilaian dilakukan secara blind review oleh panel juri ahli. Setiap blok BMC dinilai berdasarkan kriteria tertentu (Customer Segments 15%, Value Proposition 20%, dll). Score dihitung dari rata-rata semua juri.",
                en: "Judging is conducted through blind review by an expert panel. Each BMC block is scored based on specific criteria (Customer Segments 15%, Value Proposition 20%, etc.). Final scores are averaged across all judges."
            }
        },
        {
            q: { id: "Apakah ada feedback dari juri?", en: "Will we receive feedback from judges?" },
            a: {
                id: "Ya, setiap tim semifinalis akan menerima feedback terstruktur dari juri per kriteria penilaian setelah pengumuman hasil.",
                en: "Yes, every semifinalist team will receive structured feedback from judges per scoring criterion after results are announced."
            }
        },
        {
            q: { id: "Apakah bisa ganti kategori setelah mendaftar?", en: "Can I change categories after registering?" },
            a: {
                id: "Perubahan kategori dapat dilakukan sebelum deadline pendaftaran dengan menghubungi panitia. Setelah deadline, perubahan kategori tidak diperbolehkan.",
                en: "Category changes can be made before the registration deadline by contacting the committee. After the deadline, category changes are not permitted."
            }
        },
        {
            q: { id: "Apa kebijakan plagiarisme?", en: "What is the plagiarism policy?" },
            a: {
                id: "Plagiarisme akan mengakibatkan diskualifikasi seluruh tim, pencabutan hadiah, dan potensi larangan mengikuti CIBC di masa depan. Semua submission dapat diperiksa menggunakan alat deteksi plagiarisme.",
                en: "Plagiarism will result in immediate disqualification of the entire team, forfeiture of prizes, and potential ban from future CIBC editions. All submissions may be checked using plagiarism detection tools."
            }
        }
    ],
    judges: [
        {
            name: "Dr. Rina Setiawan",
            title: { id: "Profesor Entrepreneurship", en: "Professor of Entrepreneurship" },
            institution: "Universitas Indonesia",
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80",
            expertise: { id: "Inovasi Bisnis, Strategi Startup", en: "Business Innovation, Startup Strategy" }
        },
        {
            name: "Ahmad Fauzi, MBA",
            title: { id: "Managing Director", en: "Managing Director" },
            institution: "Venture Capital ABC",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80",
            expertise: { id: "Investasi, Valuasi Startup", en: "Investment, Startup Valuation" }
        },
        {
            name: "Prof. Lisa Chen",
            title: { id: "Ketua Center for Innovation", en: "Director of Center for Innovation" },
            institution: "National University of Singapore",
            avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80",
            expertise: { id: "Model Bisnis Berkelanjutan, ESG", en: "Sustainable Business Models, ESG" }
        },
        {
            name: "Budi Hartono",
            title: { id: "CEO & Founder", en: "CEO & Founder" },
            institution: "GreenTech Indonesia",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
            expertise: { id: "Teknologi Hijau, Ekonomi Sirkular", en: "Green Technology, Circular Economy" }
        }
    ],
    contact: {
        email: "hello@cibcpower.com",
        instagram: "@cibcpower",
        linkedin: "CIBC Power Official",
        twitter: "@cibcpower"
    }
};