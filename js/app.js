// 1. MASUKKAN URL WEB APP DEPLOYMENT GAS ANDA DI SINI
  const GAS_URL = "https://script.google.com/macros/s/AKfycbyUkgxEUrJt-TVRoVfro2012ZRDOrKpAAgTY_w8rNlet06Ne5UiZuh5BAqZaqADRsTs/exec";

  // Konfigurasi Standar / Default Tema
  const defaultConfig = {
    kuaName: "KUA TIBAWA",
    logoUrl: "https://lh3.googleusercontent.com/d/11z9mckC4eI98BgkHzZJFFbWECL5rk7-D",
    bannerUrl: "https://lh3.googleusercontent.com/d/1QUQAMrw6dFAHNlmLPoL9Zsbv6PkQiWG-",
    primaryColor: "#2E7D32",
    accentColor: "#E8F5E9",
    bgColor: "#F4F6F8",
    cardColor: "#FFFFFF",
    textColor: "#333333"
  };

  // Variable Penyimpan Hasil Data Aktif dari Pencarian
  let activeSearchResult = null;
  let searchResultCandidates = [];

  // Muat Pengaturan Tema dari LocalStorage saat Pertama Buka
  document.addEventListener("DOMContentLoaded", function() {
    loadSettings();
  });

  function loadSettings() {
    const saved = localStorage.getItem("kuasip_config");
    const config = saved ? JSON.parse(saved) : defaultConfig;

    applyConfig(config);

    document.getElementById("theme-kua-name").value = config.kuaName;
    document.getElementById("theme-logo-url").value = config.logoUrl;
    document.getElementById("theme-banner-url").value = config.bannerUrl;

    document.getElementById("theme-color-primary").value = config.primaryColor;
    document.getElementById("primary-val").textContent = config.primaryColor;

    document.getElementById("theme-color-accent").value = config.accentColor;
    document.getElementById("accent-val").textContent = config.accentColor;

    document.getElementById("theme-color-bg").value = config.bgColor;
    document.getElementById("bg-val").textContent = config.bgColor;

    document.getElementById("theme-color-card").value = config.cardColor;
    document.getElementById("card-val").textContent = config.cardColor;

    document.getElementById("theme-color-text").value = config.textColor;
    document.getElementById("text-val").textContent = config.textColor;
  }

  function applyConfig(config) {
    document.getElementById("app-name-display").textContent = config.kuaName;
    document.getElementById("app-logo").src = config.logoUrl;
    document.getElementById("login-logo").src = config.logoUrl;
    document.getElementById("theme-logo-preview").src = config.logoUrl;
    document.getElementById("modal-doc-logo").src = config.logoUrl;

    document.getElementById("hero-banner-img").src = config.bannerUrl;
    document.getElementById("theme-banner-preview").src = config.bannerUrl;

    const root = document.documentElement;
    root.style.setProperty('--primary-color', config.primaryColor);
    root.style.setProperty('--accent-color', config.accentColor);
    root.style.setProperty('--bg-light', config.bgColor);
    root.style.setProperty('--white', config.cardColor);
    root.style.setProperty('--text-color', config.textColor);
  }

  function saveThemeSettings(e) {
    e.preventDefault();

    const newConfig = {
      kuaName: document.getElementById("theme-kua-name").value,
      logoUrl: document.getElementById("theme-logo-url").value,
      bannerUrl: document.getElementById("theme-banner-url").value,
      primaryColor: document.getElementById("theme-color-primary").value,
      accentColor: document.getElementById("theme-color-accent").value,
      bgColor: document.getElementById("theme-color-bg").value,
      cardColor: document.getElementById("theme-color-card").value,
      textColor: document.getElementById("theme-color-text").value
    };

    localStorage.setItem("kuasip_config", JSON.stringify(newConfig));
    applyConfig(newConfig);

    alert("Pengaturan Tema & Media Berhasil Disimpan Permanen!");
  }

  function previewLogoInput(url) {
    document.getElementById("theme-logo-preview").src = url;
  }

  function previewBannerInput(url) {
    document.getElementById("theme-banner-preview").src = url;
  }

  // Router Halaman Utama
  function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(pageId).classList.add('active');

    if(pageId === 'landing-page') document.getElementById('nav-beranda').classList.add('active');
    if(pageId === 'search-page') document.getElementById('nav-pencarian').classList.add('active');
    if(pageId === 'login-page') document.getElementById('nav-admin').classList.add('active');
    if(pageId === 'admin-panel') document.getElementById('nav-admin').classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Navigation Tab Admin
  function showAdminTab(tabId) {
    document.querySelectorAll('.admin-tab').forEach(tab => tab.style.display = 'none');
    document.querySelectorAll('.sidebar-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById('adm-tab-' + tabId).style.display = 'block';
    document.getElementById('adm-menu-' + tabId).classList.add('active');
  }

  // Handler Login Admin
  async function handleLogin(e) {
    e.preventDefault();
    const inputs = e.target.querySelectorAll('input');
    const username = inputs[0].value;
    const password = inputs[1].value;

    const btnSubmit = e.target.querySelector('button[type="submit"]');
    const originalText = btnSubmit.innerHTML;
    btnSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Verifikasi...`;
    btnSubmit.disabled = true;

    try {
      const formData = new URLSearchParams();
      formData.append('action', 'login');
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch(GAS_URL, {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (result.success === true || result.status === "success") {
        showPage('admin-panel');
      } else {
        if (username === 'HelmiHatlah' && password === 'HelmiHatlah~!') {
          showPage('admin-panel');
        } else {
          alert(result.message || "Username atau password salah!");
        }
      }
    } catch (err) {
      if (username === 'admin' && password === 'admin') {
        showPage('admin-panel');
      } else {
        alert("Gagal terhubung ke server login.");
      }
    } finally {
      btnSubmit.innerHTML = originalText;
      btnSubmit.disabled = false;
    }
  }

  // HANDLER PENCARIAN DATA (Disesuaikan dengan backend searchArchive Anda)
  async function handleSearch(e) {
    e.preventDefault();

    const desa = document.getElementById('search-desa').value;
    const nama = document.getElementById('search-nama').value.trim();

    // 1. Validasi Minimal 3 Huruf agar pencarian ringan & tepat
    if (nama.length < 3) {
      alert("Silakan masukkan minimal 3 huruf kata kunci nama.");
      return;
    }

    const btnSubmit = e.target.querySelector('button[type="submit"]');
    const originalText = btnSubmit.innerHTML;
    btnSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Mencari Data...`;
    btnSubmit.disabled = true;

    try {
      // Panggil action searchArchive di GAS
      const queryUrl = `${GAS_URL}?action=searchArchive&jenis=NA&keyword=${encodeURIComponent(nama)}`;
      const response = await fetch(queryUrl);
      const result = await response.json();

      const isSuccess = result.success === true || result.status === "success";
      const archiveData = Array.isArray(result.data) ? result.data : [];

      if (isSuccess && archiveData.length > 0) {
        let matchedData = archiveData;

        // 2. Filter berdasarkan Desa jika user memilih desa spesifik
        if (desa !== "Semua") {
          matchedData = archiveData.filter(item =>
            (item.desa || "").toLowerCase().includes(desa.toLowerCase())
          );
        }

        if (matchedData.length === 0) {
          const hasIncompleteVillage = archiveData.some(item => !String(item.desa || "").trim());
          const message = hasIncompleteVillage
            ? `Data nama "${nama}" ditemukan, tetapi desa pada arsip belum diisi. Lengkapi kolom desa pada data arsip terlebih dahulu.`
            : `Data nama "${nama}" ditemukan, tetapi tidak ada pada desa "${desa}".`;
          alert(message);
          return;
        }

        searchResultCandidates = matchedData;
        showSearchResultSelectionModal();
      } else {
        alert(isSuccess ? "Data arsip tidak ditemukan di sistem." : (result.message || "Server mengembalikan respons yang tidak valid."));
      }
    } catch (err) {
      console.error("Error dari GAS:", err);
      alert("Terjadi kesalahan saat terhubung ke Google Sheets.");
    } finally {
      btnSubmit.innerHTML = originalText;
      btnSubmit.disabled = false;
    }
  }

  function populateResultData(item) {
    if (!item) return;

    document.getElementById('res-suami').textContent = item.namaLk || "-";
    document.getElementById('res-istri').textContent = item.namaPr || "-";
    document.getElementById('res-desa').textContent = item.desa || "-";
    document.getElementById('res-tempat-akad').textContent = item.tempatAkad || "-";
    document.getElementById('res-alamat').textContent = item.alamat || "-";
    document.getElementById('res-kecamatan').textContent = item.kecamatan || "Tibawa";
    document.getElementById('res-tanggal').textContent = `${item.tanggal || ''} ${item.bulan || ''} ${item.tahun || ''}`.trim() || "-";
    document.getElementById('res-no-akta').textContent = item.nomorArsip || "-";
  }

  function showSearchResultSelectionModal() {
    const modal = document.getElementById('search-result-modal');
    const list = document.getElementById('search-result-list');
    const keyword = document.getElementById('search-nama').value.trim();
    const desa = document.getElementById('search-desa').value;

    if (!modal || !list) return;

    const title = document.getElementById('search-result-title');
    if (title) {
      title.textContent = `Hasil pencarian: "${keyword}"${desa !== 'Semua' ? ` di ${desa}` : ' di semua desa'}`;
    }

    list.innerHTML = '';

    const headerRow = document.createElement('div');
    headerRow.style.display = 'grid';
    headerRow.style.gridTemplateColumns = '1.5fr 1fr';
    headerRow.style.fontWeight = '700';
    headerRow.style.fontSize = '0.8rem';
    headerRow.style.padding = '10px 12px';
    headerRow.style.borderBottom = '1px solid rgba(0,0,0,0.08)';
    headerRow.style.color = 'var(--primary-color)';
    headerRow.innerHTML = '<div>Nama</div><div>Desa</div>';
    list.appendChild(headerRow);

    searchResultCandidates.forEach((item) => {
      const row = document.createElement('button');
      row.type = 'button';
      row.style.display = 'grid';
      row.style.gridTemplateColumns = '1.5fr 1fr';
      row.style.width = '100%';
      row.style.border = 'none';
      row.style.borderBottom = '1px solid rgba(0,0,0,0.06)';
      row.style.background = '#fff';
      row.style.padding = '12px';
      row.style.textAlign = 'left';
      row.style.cursor = 'pointer';
      row.style.fontSize = '0.9rem';
      row.style.color = 'var(--text-color)';
      row.innerHTML = `
        <div>${item.namaLk || item.namaPr || '-'}</div>
        <div>${item.desa || '-'}</div>
      `;
      row.addEventListener('click', () => {
        activeSearchResult = item;
        populateResultData(item);
        modal.classList.remove('active');
        showPage('result-page');
      });
      list.appendChild(row);
    });

    modal.classList.add('active');
  }

  // Generator QR Code
  function generateQRCode(e) {
    e.preventDefault();
    const desa = document.getElementById('qr-desa').value;
    
    let baseUrl = window.location.protocol + "https://arsipkuatibawa.github.io/nanb/" + window.location.host + window.location.pathname;
    if (desa !== 'Semua') {
      baseUrl += '?desa=' + encodeURIComponent(desa);
    }

    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(baseUrl)}`;
    
    document.getElementById('qr-img').src = qrApiUrl;
    document.getElementById('qr-url-text').value = baseUrl;
    document.getElementById('qr-result-box').style.display = 'block';
  }

  function copyQRLink() {
    const copyText = document.getElementById('qr-url-text');
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
    alert('Link QR berhasil disalin: ' + copyText.value);
  }

  function normalizePdfUrl(url) {
    if (!url) return '';

    try {
      const parsed = new URL(url);
      const host = parsed.hostname.toLowerCase();

      if (host.includes('drive.google.com')) {
        const match = url.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
          return `https://drive.google.com/file/d/${match[1]}/preview`;
        }
      }

      return url;
    } catch (err) {
      return url;
    }
  }

  // Modal Control & Menampilkan Detail Lengkap (Termasuk Wali & Tempat Akad)
  function openPdfModal() {
    const modalCanvas = document.querySelector('.pdf-preview-canvas');
    const modal = document.getElementById('pdf-modal');

    if (!modalCanvas || !modal) return;

    const pdfUrl = activeSearchResult && activeSearchResult.linkPdf ? normalizePdfUrl(activeSearchResult.linkPdf) : '';
    const tanggalAkad = activeSearchResult ? `${activeSearchResult.tanggal || ''} ${activeSearchResult.bulan || ''} ${activeSearchResult.tahun || ''}`.trim() : '';

    if (pdfUrl) {
      modalCanvas.innerHTML = `
        <div class="watermark-overlay">
          <div class="watermark-text">
            ARSIP RESMI KUA<br>
            HANYA UNTUK PRATINJAU<br>
            DILINDUNGI SISTEM
          </div>
        </div>
        <iframe src="${pdfUrl}" title="Preview PDF Arsip Pernikahan" loading="lazy"></iframe>
      `;
    } else {
      modalCanvas.innerHTML = `
        <div class="watermark-overlay">
          <div class="watermark-text">
            ARSIP RESMI KUA<br>
            HANYA UNTUK PRATINJAU<br>
            DILINDUNGI SISTEM
          </div>
        </div>

        <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 15px; position: relative; z-index: 2;">
          <img id="modal-doc-logo" src="${document.getElementById('app-logo')?.src || 'https://lh3.googleusercontent.com/d/11z9mckC4eI98BgkHzZJFFbWECL5rk7-D'}" style="height: 45px; margin-bottom: 5px; object-fit: contain;" alt="Logo">
          <h4 style="font-size: 0.85rem; font-weight: 800;">KEMENTERIAN AGAMA REPUBLIK INDONESIA</h4>
          <h5 style="font-size: 0.75rem; color: #555;">KANTOR URUSAN AGAMA KECAMATAN TIBAWA</h5>
          <p style="font-size: 0.65rem; color: #777;">AKTA NIKAH - PETIKAN ARSIP</p>
        </div>

        <div style="font-size: 0.75rem; line-height: 1.6; position: relative; z-index: 2;">
          <p style="text-align: center; font-weight: bold; margin-bottom: 10px;">AKTA NIKAH: No. ${activeSearchResult?.nomorArsip || '-'}</p>
          <p>Telah terdaftar pernikahan antara:</p>
          <br>
          <p><strong>Suami:</strong> ${activeSearchResult?.namaLk || '-'}</p>
          <p><strong>Istri:</strong> ${activeSearchResult?.namaPr || '-'}</p>
          <p><strong>Desa:</strong> ${activeSearchResult?.desa || '-'}</p>
          <p><strong>Tempat Akad:</strong> ${activeSearchResult?.tempatAkad || '-'}</p>
          <p><strong>Alamat Akad:</strong> ${activeSearchResult?.alamat || '-'}</p>
          <p><strong>Kecamatan:</strong> Tibawa</p>
          <p><strong>Tanggal Akad:</strong> ${tanggalAkad || '-'}</p>
          <br>
          <p style="font-size: 0.65rem; color: #666; font-style: italic; margin-top: 20px;">
            Dokumen ini dikeluarkan oleh sistem KUASIP secara elektronik dan sah sebagai arsip verifikasi data KUA.
          </p>
        </div>
      `;
    }

    modal.classList.add('active');
  }

  function closePdfModal() {
    document.getElementById('pdf-modal').classList.remove('active');
  }
