/* ===== GeoArch Studio - app.js ===== */

// ---------- KONFIGURASI (EDIT DI SINI) ----------
const CONFIG = {
  waNumber: '6281234567890',          // ganti dengan nomor WhatsApp Anda (format 62xxx)
  brandName: 'GeoArch Studio',
  expressFee: 100000,                 // biaya express 24 jam
  mapCenter: [-6.175392, 106.827153], // titik tengah peta hero
  imgPath: 'assets/images/'
};

// ---------- DATA KATALOG ----------
const katalogData = [
  { id: 'landuse', cat: 'gis', title: 'Peta Tutupan & Penggunaan Lahan',
    desc: 'Analisis zonasi penggunaan lahan (Land Use/Land Cover) berbasis citra Sentinel-2/Landsat & Peta RBI.',
    price: 150000, img: 'peta-tutupan-lahan.svg', tags: ['Skripsi', 'RTRW', 'GIS'] },
  { id: 'kesesuaian', cat: 'gis', title: 'Peta Kesesuaian Lahan (Overlay)',
    desc: 'Analisis pembobotan (Weighted Overlay / AHP) untuk pemukiman, pertanian, atau lokasi bisnis.',
    price: 200000, img: 'peta-kesesuaian-lahan.svg', tags: ['AHP', 'Overlay', 'GIS'] },
  { id: 'banjir', cat: 'gis', title: 'Peta Kerentanan Banjir & Longsor',
    desc: 'Zonasi tingkat kerentanan bencana berdasarkan curah hujan, kemiringan lereng (DEM), dan jenis tanah.',
    price: 250000, img: 'peta-kerentanan-bencana.svg', tags: ['Mitigasi', 'BNPB', 'AMDAL'] },

  { id: 'arch_perancangan', cat: 'arsitektur', title: 'Perancangan Arsitektur 2D & 3D Render',
    desc: 'Desain denah 2D, konsep fasad 3D photorealistic render exterior/interior & animasi walkthrough 3D.',
    price: 350000, img: 'arsitektur-3d-render.svg', tags: ['3D Render', 'Denah', 'Arsitektur'] },
  { id: 'arch_ded', cat: 'arsitektur', title: 'Penggambaran DED Lengkap (CAD)',
    desc: 'Gambar Kerja DED (Detail Engineering Design): Arsitektur, Struktur Beton/Baja, Plumbing & ME (DWG + PDF).',
    price: 300000, img: 'arsitektur-ded-cad.svg', tags: ['DED', 'AutoCAD', 'Gambar Kerja'] },
  { id: 'arch_rab', cat: 'arsitektur', title: 'Perhitungan Anggaran Biaya (RAB & BQ)',
    desc: 'Estimasi RAB konstruksi lengkap, Bill of Quantities (BQ), dan Analisis Harga Satuan Pekerjaan (AHSP) format Excel.',
    price: 250000, img: 'arsitektur-rab-bq.svg', tags: ['RAB', 'Excel', 'AHSP'] },

  { id: 'web_landing', cat: 'webdev', title: 'Website Landing Page & Portofolio',
    desc: 'Pembuatan website responsif modern, hemat biaya, siap dipublikasikan via GitHub Pages / Custom Domain.',
    price: 300000, img: 'web-landing-page.svg', tags: ['Landing Page', 'GitHub Pages', 'Portofolio'] },
  { id: 'web_gis', cat: 'webdev', title: 'Website Peta Interaktif (WebGIS)',
    desc: 'Aplikasi peta WebGIS interaktif berbasis Leaflet/Mapbox, custom basemaps, filter spasial, dan data GeoJSON.',
    price: 500000, img: 'webgis-peta-interaktif.svg', tags: ['WebGIS', 'Leaflet', 'Dashboard Spasial'] },
  { id: 'web_toko', cat: 'webdev', title: 'Website Katalog Bisnis & Order WA',
    desc: 'Website katalog produk/jasa interaktif dilengkapi kalkulator estimasi biaya, chatbot, dan checkout WhatsApp.',
    price: 450000, img: 'web-katalog-bisnis.svg', tags: ['E-Commerce', 'Katalog WA', 'QRIS'] }
];

const CAT_LABEL = { gis: 'GIS & Pemetaan', arsitektur: 'Arsitektur, DED & RAB', webdev: 'Web Development' };

let cart = [];
let currentCat = 'all';
let heroMapInstance;

const $ = (id) => document.getElementById(id);
const rupiah = (n) => `Rp ${Number(n).toLocaleString('id-ID')}`;

// ---------- INIT ----------
window.addEventListener('load', () => {
  initHeroMap();
  renderKatalog('all');
  renderCartItems();
  calculateTotal();
});

// ---------- PETA HERO (LEAFLET) ----------
function initHeroMap() {
  if (typeof L === 'undefined' || !$('heroMap')) return;
  heroMapInstance = L.map('heroMap', { zoomControl: false }).setView(CONFIG.mapCenter, 12);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap &copy; CARTO'
  }).addTo(heroMapInstance);

  L.marker(CONFIG.mapCenter).addTo(heroMapInstance)
    .bindPopup('<b>Monumen Nasional</b><br>Area Analisis Pusat Kota');

  L.polygon([[-6.170, 106.820], [-6.170, 106.835], [-6.185, 106.835], [-6.185, 106.820]],
    { color: '#10b981', fillColor: '#10b981', fillOpacity: 0.25 }).addTo(heroMapInstance);

  L.circle(CONFIG.mapCenter, { radius: 2500, color: '#06b6d4', fillOpacity: 0.08 }).addTo(heroMapInstance);
}

// ---------- KATALOG ----------
function filterKatalog(cat, btn) {
  currentCat = cat;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderKatalog(cat);
}

function renderKatalog(category) {
  const grid = $('katalogGrid');
  grid.innerHTML = '';
  const filtered = category === 'all' ? katalogData : katalogData.filter(i => i.cat === category);

  filtered.forEach(item => {
    const isSelected = cart.some(c => c.id === item.id);
    const card = document.createElement('div');
    card.className = 'rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition group';
    card.innerHTML = `
      <div>
        <div class="h-44 overflow-hidden relative">
          <img src="${CONFIG.imgPath}${item.img}" alt="${item.title}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
          <div class="absolute top-3 left-3 flex flex-wrap gap-1 pr-3">
            ${item.tags.map(t => `<span class="text-[10px] font-bold bg-slate-950/80 text-emerald-400 px-2 py-0.5 rounded-md border border-slate-800 backdrop-blur">${t}</span>`).join('')}
          </div>
        </div>
        <div class="p-5 space-y-2">
          <h3 class="font-bold text-slate-100 text-base leading-snug">${item.title}</h3>
          <p class="text-xs text-slate-400 leading-relaxed">${item.desc}</p>
        </div>
      </div>
      <div class="p-5 pt-0 flex items-center justify-between gap-3">
        <div>
          <span class="text-[10px] text-slate-500 block font-medium">Mulai Dari</span>
          <span class="text-emerald-400 font-bold text-sm font-mono">${rupiah(item.price)}</span>
        </div>
        <div class="flex gap-2">
          <button onclick="openPreviewModal('${item.id}')" class="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition" title="Preview">
            <i class="fa-solid fa-eye"></i>
          </button>
          <button onclick="toggleCart('${item.id}')" class="px-3.5 py-2.5 rounded-xl ${isSelected ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'} font-bold text-xs flex items-center gap-1.5 transition">
            <i class="fa-solid ${isSelected ? 'fa-check' : 'fa-plus'}"></i>
            <span>${isSelected ? 'Dipilih' : 'Pilih Layanan'}</span>
          </button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

// ---------- KERANJANG & KALKULATOR ----------
function toggleCart(id) {
  const item = katalogData.find(k => k.id === id);
  const idx = cart.findIndex(c => c.id === id);
  if (idx > -1) cart.splice(idx, 1); else cart.push(item);

  renderCartItems();
  calculateTotal();
  renderKatalog(currentCat);
}

function renderCartItems() {
  const container = $('cartItemsContainer');
  $('navCartBadge').innerText = cart.length;
  $('selectedCountBadge').innerText = `${cart.length} item`;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-6 text-slate-500 text-xs">
        <i class="fa-solid fa-cart-arrow-down text-2xl mb-2 text-slate-600 block"></i>
        Belum ada layanan yang dipilih. Klik <strong>"Pilih Layanan"</strong> dari katalog di atas.
      </div>`;
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80">
      <div class="space-y-0.5">
        <div class="font-bold text-xs text-slate-200">${item.title}</div>
        <div class="text-[10px] text-emerald-400 font-mono">${rupiah(item.price)}</div>
      </div>
      <button onclick="toggleCart('${item.id}')" class="text-slate-500 hover:text-rose-400 p-1 transition" title="Hapus">
        <i class="fa-solid fa-trash-can text-xs"></i>
      </button>
    </div>`).join('');
}

function calculateTotal() {
  const scale = parseFloat($('scaleSelect').value);
  const isExpress = parseInt($('urgencyRange').value, 10) === 2;
  const label = $('urgencyLabel');

  if (isExpress) {
    label.innerText = `Express 24 Jam (+${rupiah(CONFIG.expressFee)})`;
    label.className = 'text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20';
  } else {
    label.innerText = 'Reguler (2-3 Hari)';
    label.className = 'text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20';
  }

  const urgencyFee = isExpress && cart.length > 0 ? CONFIG.expressFee : 0;
  const subtotal = cart.reduce((s, i) => s + i.price, 0);
  const grandTotal = Math.round(subtotal * scale + urgencyFee);

  $('summarySubtotal').innerText = rupiah(subtotal);
  $('summaryScale').innerText = `${scale}x`;
  $('summaryUrgency').innerText = rupiah(urgencyFee);
  $('summaryGrandTotal').innerText = rupiah(grandTotal);
}

// ---------- WHATSAPP ----------
function submitOrderToWA() {
  if (cart.length === 0) {
    alert('Silakan pilih minimal 1 layanan dari katalog terlebih dahulu!');
    return;
  }
  const name = $('clientName').value.trim() || 'Pelanggan Baru';
  const aoi = $('clientAOI').value.trim() || 'Belum ditentukan';
  const scaleText = $('scaleSelect').selectedOptions[0].text;
  const speed = parseInt($('urgencyRange').value, 10) === 2 ? 'Express 24 Jam' : 'Reguler (2-3 Hari)';
  const list = cart.map((it, i) => `${i + 1}. ${it.title} (${rupiah(it.price)})`).join('\n');

  const text =
`Halo Admin ${CONFIG.brandName}! 👋
Saya ingin memesan layanan:

*DETAIL PEMESANAN*
• Nama: ${name}
• Lokasi / Proyek: ${aoi}
• Skala: ${scaleText}
• Kecepatan: ${speed}

*Layanan dipilih:*
${list}

*ESTIMASI TOTAL:* ${$('summaryGrandTotal').innerText}

Mohon konfirmasi alur pembayaran DP dan pengiriman data awal. Terima kasih!`;

  window.open(`https://wa.me/${CONFIG.waNumber}?text=${encodeURIComponent(text)}`, '_blank');
}

function openDirectWA() {
  const text = `Halo Admin ${CONFIG.brandName}, saya ingin konsultasi mengenai layanan GIS / Arsitektur / Web Development.`;
  window.open(`https://wa.me/${CONFIG.waNumber}?text=${encodeURIComponent(text)}`, '_blank');
}

// ---------- MODAL ----------
function openPaymentModal() { $('paymentModal').classList.remove('hidden'); }
function closePaymentModal() { $('paymentModal').classList.add('hidden'); }

function openPreviewModal(id) {
  const item = katalogData.find(k => k.id === id);
  $('prevCatBadge').innerText = CAT_LABEL[item.cat] || item.cat;
  $('prevTitle').innerText = item.title;
  $('prevImage').src = CONFIG.imgPath + item.img;
  $('prevImage').alt = item.title;
  $('prevDesc').innerText = item.desc;
  $('prevPrice').innerText = rupiah(item.price);
  $('prevAddBtn').onclick = () => { if (!cart.some(c => c.id === id)) toggleCart(id); closePreviewModal(); };
  $('previewModal').classList.remove('hidden');
}
function closePreviewModal() { $('previewModal').classList.add('hidden'); }

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closePaymentModal(); closePreviewModal(); }
});
['paymentModal', 'previewModal'].forEach(id => {
  window.addEventListener('DOMContentLoaded', () => {
    $(id).addEventListener('click', (e) => { if (e.target === $(id)) $(id).classList.add('hidden'); });
  });
});

// ---------- CHATBOT ----------
function toggleChatbot() { $('chatPanel').classList.toggle('hidden'); }

function handleBotOption(type) {
  const log = $('chatLog');
  const replies = {
    gis: { cls: 'emerald', user: 'Saya mau konsultasi Peta GIS / WebGIS.',
      bot: 'Kami melayani: <strong>Peta Tutupan Lahan, Kesesuaian Lahan, Kerentanan Bencana, dan Portal WebGIS interaktif</strong>.' },
    arsitektur: { cls: 'amber', user: 'Saya butuh Jasa Arsitek / DED / RAB.',
      bot: 'Layanan Arsitektur mencakup: <strong>Desain 3D Render & Denah 2D, Gambar DED AutoCAD lengkap, dan Perhitungan RAB (Excel/AHSP)</strong>.' },
    webdev: { cls: 'cyan', user: 'Saya butuh Pembuatan Website.',
      bot: 'Kami melayani: <strong>Landing Page Portofolio, WebGIS Peta Interaktif, dan Katalog Bisnis terintegrasi WhatsApp</strong>.' }
  };
  if (type === 'order') { openDirectWA(); return; }
  const r = replies[type];
  const colors = {
    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
  };
  log.insertAdjacentHTML('beforeend', `
    <div class="${colors[r.cls]} p-3 rounded-2xl rounded-tr-none ml-auto max-w-[85%] leading-relaxed border">${r.user}</div>
    <div class="bg-slate-800 text-slate-200 p-3 rounded-2xl rounded-tl-none max-w-[85%] leading-relaxed">${r.bot}</div>`);
  log.scrollTop = log.scrollHeight;
}
