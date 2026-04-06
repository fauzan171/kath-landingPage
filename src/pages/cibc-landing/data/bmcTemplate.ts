/**
 * BMC Template Generator
 * Generates a downloadable BMC Canvas template as HTML
 */

export interface BMCCanvasField {
  key: string;
  label: string;
  labelId: string;
  description: string;
  descriptionId: string;
  placeholder: string;
  placeholderId: string;
}

export const BMC_CANVAS_FIELDS: BMCCanvasField[] = [
  {
    key: 'key_partnerships',
    label: 'Key Partnerships',
    labelId: 'Mitra Kunci',
    description: 'Who are your key partners and suppliers? Which key resources are you acquiring from them?',
    descriptionId: 'Siapa mitra dan pemasok kunci Anda? Sumber daya apa yang Anda peroleh dari mereka?',
    placeholder: 'Strategic alliances, joint ventures, suppliers...',
    placeholderId: 'Aliansi strategis, joint venture, pemasok...',
  },
  {
    key: 'key_activities',
    label: 'Key Activities',
    labelId: 'Aktivitas Kunci',
    description: 'What key activities does your value proposition require?',
    descriptionId: 'Aktivitas kunci apa yang diperlukan oleh proposisi nilai Anda?',
    placeholder: 'Production, problem solving, platform management...',
    placeholderId: 'Produksi, pemecahan masalah, manajemen platform...',
  },
  {
    key: 'key_resources',
    label: 'Key Resources',
    labelId: 'Sumber Daya Kunci',
    description: 'What key resources does your value proposition require?',
    descriptionId: 'Sumber daya kunci apa yang diperlukan oleh proposisi nilai Anda?',
    placeholder: 'Physical, intellectual, human, financial...',
    placeholderId: 'Fisik, intelektual, manusia, keuangan...',
  },
  {
    key: 'value_propositions',
    label: 'Value Propositions',
    labelId: 'Proposisi Nilai',
    description: 'What value do you deliver to the customer? What problem are you solving?',
    descriptionId: 'Nilai apa yang Anda berikan kepada pelanggan? Masalah apa yang Anda selesaikan?',
    placeholder: 'Newness, performance, customization, design, brand/status, price...',
    placeholderId: 'Kebaruan, performa, kustomisasi, desain, merek/status, harga...',
  },
  {
    key: 'customer_relationships',
    label: 'Customer Relationships',
    labelId: 'Hubungan Pelanggan',
    description: 'What type of relationship does each customer segment expect?',
    descriptionId: 'Jenis hubungan apa yang diharapkan oleh setiap segmen pelanggan?',
    placeholder: 'Personal assistance, self-service, automated, communities...',
    placeholderId: 'Bantuan personal, layanan mandiri, otomatis, komunitas...',
  },
  {
    key: 'channels',
    label: 'Channels',
    labelId: 'Saluran',
    description: 'Through which channels do your customers want to be reached?',
    descriptionId: 'Melalui saluran mana pelanggan Anda ingin dijangkau?',
    placeholder: 'Web, mobile, physical store, social media, email...',
    placeholderId: 'Web, mobile, toko fisik, media sosial, email...',
  },
  {
    key: 'customer_segments',
    label: 'Customer Segments',
    labelId: 'Segmen Pelanggan',
    description: 'For whom are you creating value? Who are your most important customers?',
    descriptionId: 'Untuk siapa Anda menciptakan nilai? Siapa pelanggan terpenting Anda?',
    placeholder: 'Mass market, niche market, segmented, diversified...',
    placeholderId: 'Pasar massal, pasar ceruk, tersegmentasi, terdiversifikasi...',
  },
  {
    key: 'cost_structure',
    label: 'Cost Structure',
    labelId: 'Struktur Biaya',
    description: 'What are the most important costs in your business model?',
    descriptionId: 'Apa biaya terpenting dalam model bisnis Anda?',
    placeholder: 'Fixed costs, variable costs, economies of scale...',
    placeholderId: 'Biaya tetap, biaya variabel, skala ekonomi...',
  },
  {
    key: 'revenue_streams',
    label: 'Revenue Streams',
    labelId: 'Aliran Pendapatan',
    description: 'For what value are your customers willing to pay?',
    descriptionId: 'Untuk nilai apa pelanggan Anda bersedia membayar?',
    placeholder: 'Asset sale, usage fee, subscription, licensing, advertising...',
    placeholderId: 'Penjualan aset, biaya penggunaan, langganan, lisensi, iklan...',
  },
];

/**
 * Generates and downloads a BMC Canvas template as an HTML file
 */
export function downloadBMCTemplate(language: 'en' | 'id' = 'en') {
  const isEn = language === 'en';

  const html = `<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEn ? 'BMC Canvas Template - CIBC 2026' : 'Template Kanvas BMC - CIBC 2026'}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; padding: 20px; background: #fff; }
    .header { text-align: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #FFB22C; }
    .header h1 { font-size: 24px; color: #1a1a1a; margin-bottom: 5px; }
    .header p { font-size: 13px; color: #666; }
    .team-info { display: flex; gap: 20px; margin-bottom: 20px; flex-wrap: wrap; }
    .team-info label { font-size: 12px; font-weight: 600; color: #333; display: block; margin-bottom: 3px; }
    .team-info input { border: 1px solid #ddd; border-bottom: 2px solid #FFB22C; padding: 6px 10px; font-size: 14px; width: 200px; outline: none; }
    .bmc-grid {
      display: grid;
      grid-template-columns: repeat(10, 1fr);
      grid-template-rows: auto auto;
      gap: 2px;
      background: #e5e7eb;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
    }
    .block {
      background: white;
      padding: 12px;
      min-height: 200px;
    }
    .block h3 { font-size: 11px; font-weight: 700; color: #FFB22C; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .block p.desc { font-size: 9px; color: #888; margin-bottom: 8px; line-height: 1.3; }
    .block textarea { width: 100%; height: 120px; border: 1px dashed #ddd; padding: 8px; font-size: 11px; font-family: inherit; resize: vertical; outline: none; color: #333; }
    .block textarea:focus { border-color: #FFB22C; background: #FFFBF0; }
    .block.span-2 { grid-column: span 2; }
    .block.span-3 { grid-column: span 3; }
    .block.span-5 { grid-column: span 5; }
    .footer { margin-top: 20px; text-align: center; font-size: 11px; color: #999; }
    .instructions { margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #FFB22C; }
    .instructions h3 { font-size: 13px; color: #333; margin-bottom: 8px; }
    .instructions ol { padding-left: 20px; font-size: 12px; color: #555; line-height: 1.8; }
    @media print {
      body { padding: 10px; }
      .bmc-grid { border-width: 1px; }
      .block { min-height: 180px; padding: 8px; }
      .block textarea { height: 100px; }
      .team-info input { border-width: 1px; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${isEn ? 'Business Model Canvas' : 'Kanvas Model Bisnis'}</h1>
    <p>CIBC 2026 - ${isEn ? 'Creative International Business Competition' : 'Kompetisi Bisnis Internasional Kreatif'}</p>
  </div>

  <div class="team-info">
    <div><label>${isEn ? 'Team Name' : 'Nama Tim'}</label><input type="text" /></div>
    <div><label>${isEn ? 'Institution' : 'Institusi'}</label><input type="text" /></div>
    <div><label>${isEn ? 'Category' : 'Kategori'}</label><input type="text" placeholder="${isEn ? 'Student/Startup/Corporate' : 'Mahasiswa/Startup/Korporat'}" /></div>
    <div><label>${isEn ? 'Date' : 'Tanggal'}</label><input type="text" /></div>
  </div>

  <div class="bmc-grid">
    <!-- Row 1: Top 5 blocks -->
    <div class="block span-2">
      <h3>${isEn ? 'Key Partnerships' : 'Mitra Kunci'}</h3>
      <p class="desc">${isEn ? 'Who are your key partners and suppliers?' : 'Siapa mitra dan pemasok kunci Anda?'}</p>
      <textarea placeholder="${isEn ? 'Strategic alliances, joint ventures, suppliers...' : 'Aliansi strategis, joint venture, pemasok...'}"></textarea>
    </div>
    <div class="block span-2">
      <h3>${isEn ? 'Key Activities' : 'Aktivitas Kunci'}</h3>
      <p class="desc">${isEn ? 'What key activities does your value proposition require?' : 'Aktivitas kunci apa yang diperlukan proposisi nilai Anda?'}</p>
      <textarea placeholder="${isEn ? 'Production, problem solving, platform...' : 'Produksi, pemecahan masalah, platform...'}"></textarea>
    </div>
    <div class="block span-2">
      <h3>${isEn ? 'Value Propositions' : 'Proposisi Nilai'}</h3>
      <p class="desc">${isEn ? 'What value do you deliver to the customer?' : 'Nilai apa yang Anda berikan kepada pelanggan?'}</p>
      <textarea placeholder="${isEn ? 'Newness, performance, customization, price...' : 'Kebaruan, performa, kustomisasi, harga...'}"></textarea>
    </div>
    <div class="block span-2">
      <h3>${isEn ? 'Customer Relationships' : 'Hubungan Pelanggan'}</h3>
      <p class="desc">${isEn ? 'What type of relationship does each segment expect?' : 'Jenis hubungan apa yang diharapkan setiap segmen?'}</p>
      <textarea placeholder="${isEn ? 'Personal assistance, self-service...' : 'Bantuan personal, layanan mandiri...'}"></textarea>
    </div>
    <div class="block span-2">
      <h3>${isEn ? 'Customer Segments' : 'Segmen Pelanggan'}</h3>
      <p class="desc">${isEn ? 'For whom are you creating value?' : 'Untuk siapa Anda menciptakan nilai?'}</p>
      <textarea placeholder="${isEn ? 'Mass market, niche, segmented...' : 'Pasar massal, ceruk, tersegmentasi...'}"></textarea>
    </div>

    <!-- Row 2: Bottom 3 blocks -->
    <div class="block span-2">
      <h3>${isEn ? 'Key Resources' : 'Sumber Daya Kunci'}</h3>
      <p class="desc">${isEn ? 'What key resources are required?' : 'Sumber daya kunci apa yang diperlukan?'}</p>
      <textarea placeholder="${isEn ? 'Physical, intellectual, human, financial...' : 'Fisik, intelektual, manusia, keuangan...'}"></textarea>
    </div>
    <div class="block span-2">
      <h3>${isEn ? 'Channels' : 'Saluran'}</h3>
      <p class="desc">${isEn ? 'Through which channels do customers want to be reached?' : 'Melalui saluran mana pelanggan ingin dijangkau?'}</p>
      <textarea placeholder="${isEn ? 'Web, mobile, physical store, social media...' : 'Web, mobile, toko fisik, media sosial...'}"></textarea>
    </div>
    <div class="block span-3">
      <h3>${isEn ? 'Cost Structure' : 'Struktur Biaya'}</h3>
      <p class="desc">${isEn ? 'What are the most important costs?' : 'Apa biaya terpenting dalam model bisnis Anda?'}</p>
      <textarea placeholder="${isEn ? 'Fixed costs, variable costs, economies of scale...' : 'Biaya tetap, biaya variabel, skala ekonomi...'}"></textarea>
    </div>
    <div class="block span-3">
      <h3>${isEn ? 'Revenue Streams' : 'Aliran Pendapatan'}</h3>
      <p class="desc">${isEn ? 'For what value are customers willing to pay?' : 'Untuk nilai apa pelanggan bersedia membayar?'}</p>
      <textarea placeholder="${isEn ? 'Asset sale, subscription, licensing, advertising...' : 'Penjualan aset, langganan, lisensi, iklan...'}"></textarea>
    </div>
  </div>

  <div class="instructions">
    <h3>${isEn ? 'How to Use This Template' : 'Cara Menggunakan Template Ini'}</h3>
    <ol>
      <li>${isEn ? 'Fill in each block with your business model details' : 'Isi setiap blok dengan detail model bisnis Anda'}</li>
      <li>${isEn ? 'Start with Customer Segments and Value Propositions (the heart of the canvas)' : 'Mulai dari Segmen Pelanggan dan Proposisi Nilai (inti kanvas)'}</li>
      <li>${isEn ? 'Be specific and concise - use bullet points' : 'Buat spesifik dan ringkas - gunakan poin-poin'}</li>
      <li>${isEn ? 'Print or save as PDF when complete' : 'Cetak atau simpan sebagai PDF setelah selesai'}</li>
      <li>${isEn ? 'Submit your completed canvas through the CIBC platform' : 'Kirimkan kanvas yang telah selesai melalui platform CIBC'}</li>
    </ol>
  </div>

  <div class="footer">
    <p>CIBC 2026 - Creative International Business Competition | ${isEn ? 'BMC Template v1.0' : 'Template BMC v1.0'}</p>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = isEn ? 'CIBC-2026-BMC-Template.html' : 'CIBC-2026-Template-BMC.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
