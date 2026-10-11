// Vidoor Chrome Extension Content Script
// Injects Vidoor Scorecard & Quick channel stats directly into YouTube pages

(function () {
  let lastProcessedChannel = "";
  let isProcessing = false;

  function detectChannel() {
    const path = window.location.pathname;

    // A. @Handle (e.g. /@XamdamSobirov_Official, /@kunuz)
    const handleMatch = path.match(/^\/(@[a-zA-Z0-9_.-]+)/);
    if (handleMatch) return handleMatch[1];

    // B. /channel/ID
    const channelMatch = path.match(/^\/channel\/([a-zA-Z0-9_-]+)/);
    if (channelMatch) return channelMatch[1];

    // C. /c/Name yoki /user/Name
    const cMatch = path.match(/^\/(?:c|user)\/([a-zA-Z0-9_.-]+)/);
    if (cMatch) return cMatch[1];

    // D. Video sahifasi (/watch?v=...)
    if (path.includes('/watch') || window.location.search.includes('v=')) {
      // 1. ytd-watch-metadata kanal linki
      const link = document.querySelector('ytd-watch-metadata #channel-name a, ytd-video-owner-renderer a, #owner #channel-name a, #upload-info #channel-name a');
      if (link && link.href) {
        const m = link.href.match(/youtube\.com\/(@[a-zA-Z0-9_.-]+|channel\/[a-zA-Z0-9_-]+)/);
        if (m) return m[1].replace('channel/', '');
      }

      // 2. Kanal nomi matni
      const nameEl = document.querySelector('ytd-watch-metadata #channel-name yt-formatted-string, ytd-video-owner-renderer #channel-name, #owner #channel-name');
      if (nameEl && nameEl.textContent.trim()) {
        return nameEl.textContent.trim();
      }

      // 3. Meta teglar
      const meta = document.querySelector('link[itemprop="name"]');
      if (meta && meta.getAttribute('content')) {
        return meta.getAttribute('content');
      }
    }

    return null;
  }

  function findInsertionTarget() {
    // Video sahifasi uchun:
    const videoTarget = document.querySelector('#below') || document.querySelector('ytd-watch-metadata') || document.querySelector('#primary-inner');
    if (videoTarget) return { element: videoTarget, isVideo: true };

    // Kanal sahifasi uchun:
    const channelTarget = (
      document.querySelector('yt-page-header-renderer') ||
      document.querySelector('#page-header') ||
      document.querySelector('ytd-c4-tabbed-header-renderer') ||
      document.querySelector('#channel-container') ||
      document.querySelector('ytd-tabbed-page-header')
    );
    if (channelTarget) return { element: channelTarget, isVideo: false };

    return null;
  }

  async function injectVidoorWidget() {
    const channelQuery = detectChannel();
    if (!channelQuery) return;

    if (isProcessing && channelQuery === lastProcessedChannel) return;
    lastProcessedChannel = channelQuery;
    isProcessing = true;

    const targetInfo = findInsertionTarget();
    if (!targetInfo) {
      setTimeout(injectVidoorWidget, 500);
      isProcessing = false;
      return;
    }

    let container = document.getElementById('vidoor-injected-stats');
    if (!container) {
      container = document.createElement('div');
      container.id = 'vidoor-injected-stats';
      container.className = 'vidoor-injected-container';

      if (targetInfo.isVideo) {
        targetInfo.element.parentNode.insertBefore(container, targetInfo.element);
      } else if (targetInfo.element.nextSibling) {
        targetInfo.element.parentNode.insertBefore(container, targetInfo.element.nextSibling);
      } else {
        targetInfo.element.parentNode.appendChild(container);
      }
    }

    container.innerHTML = `
      <div class="vidoor-card" style="text-align: center; padding: 18px;">
        <span style="font-size: 13px; font-weight: bold; color: #10b981;">⚡ Vidoor AI: "${channelQuery}" kanali YouTube ichida tahlil qilinmoqda...</span>
      </div>
    `;

    try {
      const res = await fetch(`https://vidoor.vercel.app/api/youtube?query=${encodeURIComponent(channelQuery)}`);
      const data = await res.json();

      if (!data || data.error) {
        isProcessing = false;
        container.remove();
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
              <div>
                <div class="vidoor-logo-text"><span class="vid">VID</span><span class="oor">OOR</span> <span style="font-size: 13px; color: #f97316;">AI</span></div>
                <div style="font-size: 11px; color: #94a3b8; font-weight: bold;">${data.name} (${data.handle || ''})</div>
              </div>
              <span class="vidoor-badge-tag">⚡ YouTube Jonli Analitika</span>
            </div>

            <div class="vidoor-header-actions">
              <a href="https://vidoor.vercel.app/?q=${encodeURIComponent(data.handle || data.name)}" target="_blank" class="vidoor-btn vidoor-btn-primary">
                <span>🚀 Vidoor Portalida Ochish ↗</span>
              </a>
              <button onclick="document.getElementById('vidoor-injected-stats').remove()" class="vidoor-btn vidoor-btn-close" title="Yopish">✕</button>
            </div>
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
              <span class="vidoor-stat-label">Obunachilar</span>
              <div>
                <div class="vidoor-stat-value">${data.subscribers || '—'}</div>
                <div class="vidoor-stat-sub">
                  <span class="vidoor-badge-green">Ranked ${data.channelRank || '#1'}</span>
                </div>
              </div>
            </div>

            <div class="vidoor-stat-box highlight">
              <span class="vidoor-stat-label" style="color: #34d399;">Est. monthly earnings</span>
              <div>
                <div class="vidoor-stat-value" style="color: #34d399;">${data.estMonthlyEarningsMain || '—'}</div>
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
                  <span style="color: #94a3b8;">Optimal davomiylik</span>
                </div>
              </div>
            </div>

            <div class="vidoor-stat-box">
              <span class="vidoor-stat-label">Upload frequency</span>
              <div>
                <div class="vidoor-stat-value" style="font-size: 15px;">${data.uploadFrequency || '—'}</div>
                <div class="vidoor-stat-sub">
                  <span style="color: #94a3b8;">Yuklash sur'ati</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } catch (e) {
      console.warn("Vidoor extension error:", e);
    } finally {
      isProcessing = false;
    }
  }

  // Sahifa o'zgarganda qayta tekshirish (YouTube SPA navigatsiyasi)
  window.addEventListener('yt-navigate-finish', () => {
    setTimeout(injectVidoorWidget, 600);
  });
  window.addEventListener('load', () => {
    setTimeout(injectVidoorWidget, 1000);
  });
  setTimeout(injectVidoorWidget, 1000);
})();
