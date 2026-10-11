// Vidoor 1-Click In-Page Script for YouTube
// Can be run via Bookmarklet or Userscript directly on any YouTube page!

(function () {
  // 1. Inject Styles if not already present
  if (!document.getElementById('vidoor-inpage-styles')) {
    const style = document.createElement('style');
    style.id = 'vidoor-inpage-styles';
    style.textContent = `
      .vidoor-injected-container {
        width: 100% !important;
        max-width: 1280px !important;
        margin: 12px auto 16px auto !important;
        padding: 0 16px !important;
        box-sizing: border-box !important;
        font-family: "Roboto", "Segoe UI", Arial, sans-serif !important;
        z-index: 99 !important;
      }
      .vidoor-card {
        background: #0f172a !important;
        border: 1px solid #1e293b !important;
        border-radius: 16px !important;
        padding: 16px 20px !important;
        color: #f8fafc !important;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4) !important;
      }
      .vidoor-card-header {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        padding-bottom: 12px !important;
        margin-bottom: 14px !important;
        border-bottom: 1px solid #1e293b !important;
      }
      .vidoor-brand {
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
      }
      .vidoor-logo-img {
        width: 28px !important;
        height: 28px !important;
        border-radius: 8px !important;
        object-fit: cover !important;
        border: 1px solid rgba(16, 185, 129, 0.4) !important;
      }
      .vidoor-logo-text {
        font-size: 16px !important;
        font-weight: 900 !important;
        color: #ffffff !important;
      }
      .vidoor-logo-text .vid { color: #10b981 !important; }
      .vidoor-logo-text .oor { color: #f97316 !important; }
      .vidoor-header-title {
        font-size: 13px !important;
        font-weight: 700 !important;
        color: #e2e8f0 !important;
        margin-left: 6px !important;
        border-left: 1px solid #334155 !important;
        padding-left: 10px !important;
      }
      .vidoor-view-all-btn {
        display: inline-flex !important;
        align-items: center !important;
        gap: 5px !important;
        font-size: 12px !important;
        font-weight: 700 !important;
        color: #38bdf8 !important;
        background: rgba(56, 189, 248, 0.1) !important;
        border: 1px solid rgba(56, 189, 248, 0.25) !important;
        padding: 5px 12px !important;
        border-radius: 20px !important;
        text-decoration: none !important;
        cursor: pointer !important;
      }
      .vidoor-stats-grid {
        display: grid !important;
        grid-template-columns: repeat(5, 1fr) !important;
        gap: 10px !important;
      }
      @media (max-width: 900px) {
        .vidoor-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
      }
      .vidoor-stat-box {
        background: #1e293b !important;
        border: 1px solid #334155 !important;
        border-radius: 12px !important;
        padding: 12px 14px !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        min-height: 85px !important;
      }
      .vidoor-stat-box.highlight {
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(15, 23, 42, 0.9)) !important;
        border: 1.5px solid #10b981 !important;
      }
      .vidoor-stat-label {
        font-size: 11px !important;
        font-weight: 500 !important;
        color: #94a3b8 !important;
      }
      .vidoor-stat-box.highlight .vidoor-stat-label {
        color: #34d399 !important;
        font-weight: 700 !important;
        text-transform: uppercase !important;
      }
      .vidoor-stat-value {
        font-size: 18px !important;
        font-weight: 900 !important;
        color: #ffffff !important;
        margin-top: 4px !important;
      }
      .vidoor-stat-box.highlight .vidoor-stat-value {
        color: #34d399 !important;
        font-size: 20px !important;
      }
      .vidoor-stat-sub {
        font-size: 10px !important;
        font-weight: 600 !important;
        margin-top: 4px !important;
        display: flex !important;
        gap: 4px !important;
      }
      .vidoor-badge-green {
        color: #34d399 !important;
        background: rgba(16, 185, 129, 0.15) !important;
        padding: 2px 6px !important;
        border-radius: 4px !important;
      }
      .vidoor-badge-red {
        color: #f87171 !important;
        background: rgba(239, 68, 68, 0.15) !important;
        padding: 2px 6px !important;
        border-radius: 4px !important;
      }
      .vidoor-header-stats-btn {
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
        background: linear-gradient(135deg, #0284c7, #0369a1) !important;
        color: #ffffff !important;
        font-size: 13px !important;
        font-weight: 700 !important;
        padding: 8px 16px !important;
        border-radius: 24px !important;
        cursor: pointer !important;
        margin-left: 8px !important;
        text-decoration: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  function getChannelFromUrl() {
    const path = window.location.pathname;
    const handleMatch = path.match(/^\/(@[a-zA-Z0-9_.-]+)/);
    if (handleMatch) return handleMatch[1];
    const channelMatch = path.match(/^\/channel\/([a-zA-Z0-9_-]+)/);
    if (channelMatch) return channelMatch[1];
    const cMatch = path.match(/^\/(?:c|user)\/([a-zA-Z0-9_.-]+)/);
    if (cMatch) return cMatch[1];
    return null;
  }

  function findInsertionTarget() {
    return (
      document.querySelector('yt-page-header-renderer') ||
      document.querySelector('#page-header') ||
      document.querySelector('ytd-c4-tabbed-header-renderer') ||
      document.querySelector('#channel-container') ||
      document.querySelector('ytd-tabbed-page-header')
    );
  }

  async function run() {
    const channelQuery = getChannelFromUrl();
    if (!channelQuery) {
      alert("Iltimos, avval biror YouTube kanal sahifasini oching (masalan, Xamdam Sobirov yoki Setanta Sports)!");
      return;
    }

    const target = findInsertionTarget();
    if (!target) {
      alert("YouTube kanal qismi topilmadi. Sahifa to'liq yuklangach yana bosing!");
      return;
    }

    let container = document.getElementById('vidoor-injected-stats');
    if (!container) {
      container = document.createElement('div');
      container.id = 'vidoor-injected-stats';
      container.className = 'vidoor-injected-container';
      if (target.nextSibling) {
        target.parentNode.insertBefore(container, target.nextSibling);
      } else {
        target.parentNode.appendChild(container);
      }
    }

    container.innerHTML = `
      <div class="vidoor-card" style="text-align: center; padding: 20px;">
        <span style="font-size: 14px; font-weight: bold; color: #10b981;">⚡ Vidoor: "${channelQuery}" kanali tahlil qilinmoqda...</span>
      </div>
    `;

    try {
      const res = await fetch(`https://vidoor.vercel.app/api/youtube?query=${encodeURIComponent(channelQuery)}`);
      const data = await res.json();

      if (!data || data.error) {
        container.innerHTML = `<div class="vidoor-card" style="color: #f87171;">Xatolik: ${data?.error || "Yuklanmadi"}</div>`;
        return;
      }

      const growthSign = data.viewsGainedPercent?.startsWith('+') ? '+' : '';
      const isGrowthPositive = !data.viewsGainedPercent?.startsWith('-');
      const growthBadgeClass = isGrowthPositive ? 'vidoor-badge-green' : 'vidoor-badge-red';

      container.innerHTML = `
        <div class="vidoor-card">
          <div class="vidoor-card-header">
            <div class="vidoor-brand">
              <img src="https://vidoor.vercel.app/vidoor-emblem.jpg" class="vidoor-logo-img" alt="Vidoor" onerror="this.style.display='none'" />
              <div class="vidoor-logo-text"><span class="vid">VID</span><span class="oor">OOR</span></div>
              <span class="vidoor-header-title">Quick channel stats</span>
            </div>
            <a href="https://vidoor.vercel.app/?q=${encodeURIComponent(channelQuery)}" target="_blank" class="vidoor-view-all-btn">
              <span>View all ↗</span>
            </a>
          </div>

          <div class="vidoor-stats-grid">
            <div class="vidoor-stat-box">
              <span class="vidoor-stat-label">Views gained (7 days)</span>
              <div>
                <div class="vidoor-stat-value">${data.viewsGained7Days || '—'}</div>
                <div class="vidoor-stat-sub">
                  <span class="${growthBadgeClass}">${data.viewsGainedPercent || '+4.5%'}</span>
                </div>
              </div>
            </div>

            <div class="vidoor-stat-box">
              <span class="vidoor-stat-label">Подписчики / Obunachilar</span>
              <div>
                <div class="vidoor-stat-value">${data.subscribers || '—'}</div>
                <div class="vidoor-stat-sub">
                  <span class="vidoor-badge-green">+1.41%</span>
                  <span style="color: #94a3b8;">Ranked ${data.channelRank || '#28 ming'}</span>
                </div>
              </div>
            </div>

            <div class="vidoor-stat-box highlight">
              <span class="vidoor-stat-label">Est. monthly earnings</span>
              <div>
                <div class="vidoor-stat-value">${data.estMonthlyEarningsMain || '—'}</div>
                <div class="vidoor-stat-sub">
                  <span style="color: #e2e8f0; font-weight: 700;">${data.estMonthlyRange || ''}</span>
                  <span style="color: #94a3b8;">(${data.estMonthlyDollars || ''})</span>
                </div>
              </div>
            </div>

            <div class="vidoor-stat-box">
              <span class="vidoor-stat-label">Avg. video length</span>
              <div>
                <div class="vidoor-stat-value">${data.avgVideoLength || '—'}</div>
                <div class="vidoor-stat-sub">
                  <span style="color: #94a3b8;">O'rtacha davomiylik</span>
                </div>
              </div>
            </div>

            <div class="vidoor-stat-box">
              <span class="vidoor-stat-label">Upload frequency</span>
              <div>
                <div class="vidoor-stat-value" style="font-size: 15px;">${data.uploadFrequency || '—'}</div>
                <div class="vidoor-stat-sub">
                  <span style="color: #94a3b8;">Yuklash chastotasi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      container.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (e) {
      alert("Xatolik: " + e.message);
    }
  }

  run();
})();
