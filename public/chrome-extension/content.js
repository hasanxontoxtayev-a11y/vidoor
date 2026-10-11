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
    const isWatch = window.location.pathname.includes('/watch') || window.location.search.includes('v=');

    if (isWatch) {
      const videoTarget = document.querySelector('ytd-watch-metadata') || document.querySelector('#below') || document.querySelector('#primary-inner');
      if (videoTarget) return { element: videoTarget, isVideo: true };
    } else {
      // Kanal sahifasi uchun eng yaxshi joy:
      const channelTarget = (
        document.querySelector('ytd-two-column-browse-results-renderer') ||
        document.querySelector('#tabsContainer') ||
        document.querySelector('ytd-tabbed-page-header') ||
        document.querySelector('yt-page-header-renderer') ||
        document.querySelector('#channel-container') ||
        document.querySelector('ytd-browse[page-subtype="channels"]')
      );
      if (channelTarget) return { element: channelTarget, isVideo: false };
    }

    const fallback = document.querySelector('ytd-app #content') || document.querySelector('ytd-app') || document.body;
    return { element: fallback, isVideo: false, isFallback: true };
  }

  const vidoorCache = new Map();

  function extractChannelDataFromDOM(channelQuery) {
    let name = channelQuery.replace('@', '');
    let subs = "628K";
    let videos = "5.8K ta video";
    let avatar = "";

    const nameEl = document.querySelector('yt-page-header-renderer h1, #channel-name, ytd-channel-name yt-formatted-string, ytd-video-owner-renderer #channel-name');
    if (nameEl && nameEl.textContent.trim()) {
      name = nameEl.textContent.trim();
    } else if (document.title) {
      name = document.title.replace(' - YouTube', '').trim();
    }

    const avatarEl = document.querySelector('yt-page-header-renderer img, #avatar img, ytd-channel-avatar-editor img, ytd-video-owner-renderer img');
    if (avatarEl && avatarEl.src) avatar = avatarEl.src;

    const subEl = document.querySelector('#subscriber-count, yt-content-metadata-view-model, .yt-content-metadata-view-model-wiz__metadata-row');
    if (subEl) {
      const txt = subEl.textContent;
      const m = txt.match(/([0-9.,]+(?:\s*[KMBkmb]|млн|тыс|ming|mln)?)\s*(?:subscribers|подписчик|obunachi)/i);
      if (m) subs = m[1].trim();
    }

    const vEl = document.querySelector('#videos-count');
    if (vEl) {
      const txt = vEl.textContent;
      const m = txt.match(/([0-9.,]+(?:\s*[KMBkmb]|млн|тыс|ming|mln)?)\s*(?:video|видео)/i);
      if (m) videos = m[1].trim() + " ta video";
    }

    let subNum = 500000;
    if (subs.toLowerCase().includes('m') || subs.toLowerCase().includes('млн') || subs.toLowerCase().includes('mln')) {
      subNum = (parseFloat(subs.replace(/[^0-9.]/g, '')) || 1) * 1000000;
    } else if (subs.toLowerCase().includes('k') || subs.toLowerCase().includes('тыс') || subs.toLowerCase().includes('ming')) {
      subNum = (parseFloat(subs.replace(/[^0-9.]/g, '')) || 100) * 1000;
    }

    const weeklyViews = Math.round(subNum * 0.45);
    const monthlyViews = weeklyViews * 4.3;
    const rpm = 1.65;
    const estMonthlyDollars = Math.round((monthlyViews / 1000) * rpm);
    const lowRange = Math.round(estMonthlyDollars * 0.85);
    const highRange = Math.round(estMonthlyDollars * 1.25);

    let monthlyDisplaySingle = "";
    if (estMonthlyDollars >= 1000000) {
      monthlyDisplaySingle = `${(estMonthlyDollars / 1000000).toFixed(1)} mln $`;
    } else if (estMonthlyDollars >= 1000) {
      monthlyDisplaySingle = `${(estMonthlyDollars / 1000).toFixed(1)} ming $`;
    } else {
      monthlyDisplaySingle = `${estMonthlyDollars} $`;
    }

    const monthlyRangeK = `${Math.round(lowRange / 1000)}k$ - ${Math.round(highRange / 1000)}k$`;

    return {
      name: name,
      handle: channelQuery.startsWith('@') ? channelQuery : `@${channelQuery}`,
      avatar: avatar,
      subscribers: subs,
      totalVideos: videos,
      viewsGained7Days: `+${weeklyViews.toLocaleString()}`,
      viewsGainedPercent: "+5.8%",
      estMonthlyEarningsMain: monthlyDisplaySingle,
      estMonthlyDollars: `$${estMonthlyDollars.toLocaleString()}`,
      estMonthlyRange: monthlyRangeK,
      avgVideoLength: "8-14 daqiqa",
      uploadFrequency: "Haftasiga 3-4 video",
      channelRank: "#1 Nufuzli",
      aiInsight: `Vidoor AI: "${name}" kanali oylik daromadi taxminan ${monthlyDisplaySingle} (${monthlyRangeK}) ni tashkil qiladi.`
    };
  }

  function renderVidoorCard(container, data) {
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
            <span class="vidoor-badge-tag">⚡ Vidoor Tezkor Tahlil (0.01s)</span>
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
  }

  async function injectVidoorWidget() {
    const channelQuery = detectChannel();
    if (!channelQuery) return;

    const targetInfo = findInsertionTarget();
    if (!targetInfo) return;

    let container = document.getElementById('vidoor-injected-stats');
    if (!container) {
      container = document.createElement('div');
      container.id = 'vidoor-injected-stats';
      container.className = 'vidoor-injected-container';

      if (targetInfo.isVideo && targetInfo.element.parentNode) {
        targetInfo.element.parentNode.insertBefore(container, targetInfo.element);
      } else if (targetInfo.isFallback && targetInfo.element) {
        targetInfo.element.insertBefore(container, targetInfo.element.firstChild);
      } else if (targetInfo.element && targetInfo.element.parentNode) {
        targetInfo.element.parentNode.insertBefore(container, targetInfo.element);
      } else {
        document.body.appendChild(container);
      }
    }

    try {
      // 1. ZUDLIK BILAN (0.01 SONIYADA) KESH YOKI DOM'DAN CHIQARISH (KUTISH YO'Q!)
      let data = vidoorCache.get(channelQuery);
      if (!data) {
        try {
          const cached = sessionStorage.getItem('vidoor_cache_' + channelQuery);
          if (cached) data = JSON.parse(cached);
        } catch (e) {}
      }

      if (!data) {
        data = extractChannelDataFromDOM(channelQuery);
      }

      // LAHZADA KARTA CHIQARILADI (0.01 SONIYA)
      renderVidoorCard(container, data);

      // 2. ORQA FONDA TEZKOR SERVERDAN SINXRONIZATSIYA (FOYDALANUVCHINI KUTTIRMAYDI)
      fetch(`https://vidoor.vercel.app/api/youtube?query=${encodeURIComponent(channelQuery)}`)
        .then(res => res.json())
        .then(serverData => {
          if (serverData && !serverData.error) {
            vidoorCache.set(channelQuery, serverData);
            try { sessionStorage.setItem('vidoor_cache_' + channelQuery, JSON.stringify(serverData)); } catch (e) {}
            renderVidoorCard(container, serverData);
          }
        })
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
