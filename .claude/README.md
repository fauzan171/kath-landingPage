# KATH Skills Collection

Koleksi skill agent profesional untuk Claude Code.

## Skills yang Tersedia

### 1. BMC Competition Consultant
Mentor veteran kompetisi Business Model Canvas (BMC) internasional dengan pengalaman langsung mengikuti berbagai lomba.

**Command**: `/bmc-consultant`

**Keahlian**:
- Flow kompetisi BMC internasional lengkap
- Dokumentasi (BMC, Pitch Deck, Executive Summary, Video Pitch)
- Tips & tricks dari pengalaman langsung
- Pertanyaan juri yang sering muncul
- Timeline persiapan ideal

---

### 2. UI/UX Consultant
Senior UI/UX Consultant dengan 12+ tahun pengalaman, termasuk 6 tahun project internasional.

**Command**: `/uiux-consultant`

**Keahlian**:
- Color theory & palette generation
- Typography systems
- Design systems architecture
- Accessibility (WCAG 2.1)
- Design validation methodology
- International design considerations

---

### 3. Frontend Engineer
Senior Frontend Engineer dengan 10+ tahun pengalaman, termasuk 5 tahun di Silicon Valley tech companies.

**Command**: `/frontend-engineer`

**Keahlian**:
- React (18+, hooks, concurrent features, Server Components)
- Next.js (13+, App Router, Server Actions, ISR)
- TypeScript (advanced types, generics)
- Performance optimization (Core Web Vitals)
- State management (React Query, Zustand, Redux)
- Testing (Vitest, Testing Library, Playwright)
- CSS/Tailwind CSS

---

## Struktur File

```
.claude/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   ├── bmc-consultant.md
│   ├── uiux-consultant.md
│   └── frontend-engineer.md
├── agents/
│   ├── bmc-consultant.md
│   ├── uiux-consultant.md
│   └── frontend-engineer.md
└── README.md
```

---

## Cara Menggunakan

### BMC Consultant
```
/bmc-consultant Saya mau ikut Hult Prize, timeline 2 bulan lagi
/bmc-consultant Tips lolos screening BMC internasional
/bmc-consultant Bagaimana cara handle Q&A dengan juri?
```

### UI/UX Consultant
```
/uiux-consultant Saya mau buat color palette untuk fintech app
/uiux-consultant Review design saya, apakah accessible?
/uiux-consultant Rekomendasi typography untuk SaaS dashboard
```

### Frontend Engineer
```
/frontend-engineer Cara optimal implementasi React Query?
/frontend-engineer Kenapa komponen saya sering re-render?
/frontend-engineer Best practices untuk Next.js App Router
/frontend-engineer Bagaimana struktur project React yang scalable?
```

---

## Frontend Engineer Content

### Tech Stack Mastery

| Category | Technologies |
|----------|--------------|
| **Core** | JavaScript (ES6+), TypeScript, HTML5, CSS3 |
| **Frameworks** | React, Next.js, Vue.js, Remix |
| **Styling** | Tailwind CSS, CSS Modules, Styled Components |
| **State** | React Query, Zustand, Redux Toolkit |
| **Build** | Vite, Webpack, Turbopack |
| **Testing** | Vitest, Testing Library, Playwright |

### Performance Targets (Core Web Vitals)

| Metric | Good | Needs Improvement |
|--------|------|-------------------|
| LCP | ≤ 2.5s | 2.5s - 4s |
| FID | ≤ 100ms | 100ms - 300ms |
| CLS | ≤ 0.1 | 0.1 - 0.25 |
| INP | ≤ 200ms | 200ms - 500ms |

### Component Patterns

1. **Compound Components** - Flexible, composable API
2. **Render Props** - Flexible rendering control
3. **Custom Hooks** - Reusable logic extraction
4. **Container/Presentational** - Separation of concerns

### State Management Decision

```
Server state? → React Query / SWR
Complex client state? → Zustand / Redux Toolkit
Simple local state? → useState / useReducer
Shared across components? → Context API
```

---

## Author

**KATH Event Organizer**
- Email: contact@kath-event.com
- Version: 1.0.0

## Changelog

### v1.0.0 (2024-03-15)
- Added BMC Competition Consultant skill
- Added UI/UX Consultant skill
- Added Frontend Engineer skill
- Complete documentation for all skills