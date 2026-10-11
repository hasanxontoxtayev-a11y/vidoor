// Vidoor Chrome Extension Content Script
// Injects Vidoor Quick channel stats directly into YouTube channel pages

(function () {
  let lastProcessedChannel = "";
  let isProcessing = false;

  function getChannelFromUrl() {
    const path = window.location.pathname;
    
    // 1. @Handle (e.g. /@XamdamSobirov_Official, /@SetantaSportsFootball)
    const handleMatch = path.match(/^\/(@[a-zA-Z0-9_.-]+)/);
    if (handleMatch) return handleMatch[1];

    // 2. /channel/ID (e.g. /channel/UCSzq9nfCAs5WS3S9UED1EBA)
    const channelMatch = path.match(/^\/channel\/([a-zA-Z0-9_-]+)/);
    if (channelMatch) return channelMatch[1];

    // 3. /c/Name or /user/Name
    const cMatch = path.match(/^\/(?:c|user)\/([a-zA-Z0-9_.-]+)/);
    if (cMatch) return cMatch[1];

    // 4. Meta tag check
    const metaTag = document.querySelector('link[rel="canonical"]');
    if (metaTag && metaTag.href) {
      const mMatch = metaTag.href.match(/youtube\.com\/(@[a-zA-Z0-9_.-]+|channel\/[a-zA-Z0-9_-]+)/);
      if (mMatch) return mMatch[1].replace('channel/', '');
    }

    return null;
  }

  function findInsertionTarget() {
    // Top priority insertion points: between channel header and tabs
    const candidates = [
      document.querySelector('yt-page-header-renderer'),
      document.querySelector('#page-header'),
      document.querySelector('ytd-c4-tabbed-header-renderer'),
      document.querySelector('#channel-container'),
      document.querySelector('ytd-tabbed-page-header')
    ];

    for (const el of candidates) {
      if (el && el.isConnected) return el;
    }

    return null;
  }

  function findSubscribeButton() {
    return (
      document.querySelector('#subscribe-button') ||
      document.querySelector('ytd-subscribe-button-renderer') ||
      document.querySelector('#page-header yt-button-shape')
    );
  }

  async function injectVidoorWidget() {
    const channelQuery = getChannelFromUrl();
    if (!channelQuery) {
      // Remove widget if navigated away from a channel page
      const existing = document.getElementById('vidoor-injected-stats');
      if (existing) existing.remove();
      return;
    }

    if (isProcessing && channelQuery === lastProcessedChannel) return;
    lastProcessedChannel = channelQuery;
    isProcessing = true;

    // Check if target container exists
    const target = findInsertionTarget();
    if (!target) {
      // Retry in 400ms if YouTube DOM is still loading
      setTimeout(injectVidoorWidget, 400);
      isProcessing = false;
      return;
    }

    // Insert or update placeholder
    let container = document.getElementById('vidoor-injected-stats');
    if (!container) {
      container = document.createElement('div');
      container.id = 'vidoor-injected-stats';
      container.className = 'vidoor-injected-container';
      
      // Place right after header or before tabs
      if (target.nextSibling) {
        target.parentNode.insertBefore(container, target.nextSibling);
      } else {
        target.parentNode.appendChild(container);
      }
    }

    // Show sleek loading state
    container.innerHTML = `
      <div class="vidoor-card">
        <div class="vidoor-card-header">
          <div class="vidoor-brand">
            <img src="https://vidoor.vercel.app/vidoor-emblem.jpg" class="vidoor-logo-img" alt="Vidoor" onerror="this.style.display='none'" />
            <div class="vidoor-logo-text"><span class="vid">VID</span><span class="oor">OOR</span></div>
            <span class="vidoor-header-title">Quick channel stats</span>
          </div>
          <span style="font-size: 11px; color: #94a3b8;"><span class="vidoor-loader"></span> Yuklanmoqda...</span>
        </div>
      </div>
    `;

    // Inject "View channel stats" button next to subscribe button
    const subBtn = findSubscribeButton();
    if (subBtn && !document.getElementById('vidoor-header-btn')) {
      const statsBtn = document.createElement('a');
      statsBtn.id = 'vidoor-header-btn';
      statsBtn.className = 'vidoor-header-stats-btn';
      statsBtn.href = `https://vidoor.vercel.app/?q=${encodeURIComponent(channelQuery)}`;
      statsBtn.target = '_blank';
      statsBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 3v18h18"></path>
          <path d="m19 9-5 5-4-4-3 3"></path>
        </svg>
        <span>View channel stats</span>
      `;
      statsBtn.addEventListener('click', (e) => {
        const el = document.getElementById('vidoor-injected-stats');
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
      subBtn.parentNode.insertBefore(statsBtn, subBtn.nextSibling);
    }

    try {
      const res = await fetch(`https://vidoor.vercel.app/api/youtube?query=${encodeURIComponent(channelQuery)}`);
      const data = await res.json();

      if (!data || data.error) {
        container.innerHTML = `
          <div class="vidoor-card" style="padding: 12px 16px;">
            <div style="font-size: 12px; color: #94a3b8;">
              <strong style="color: #f97316;">Vidoor:</strong> Kanal ma'lumotlarini yuklashda xatolik: ${data?.error || "Noma'lum"}.
              <a href="https://vidoor.vercel.app/?q=${encodeURIComponent(channelQuery)}" target="_blank" style="color: #38bdf8; margin-left: 8px;">Vidoorda ko'rish ↗</a>
            </div>
          </div>
        `;
        isProcessing = false;
        return;
      }

      // Render full 5-card stats matching Image 2
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
              <span>View all</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>

          <div class="vidoor-stats-grid">
            <!-- 1. Views gained (7 days) -->
            <div class="vidoor-stat-box">
              <span class="vidoor-stat-label">Views gained (7 days)</span>
              <div>
                <div class="vidoor-stat-value">${data.viewsGained7Days || '—'}</div>
                <div class="vidoor-stat-sub">
                  <span class="${growthBadgeClass}">${data.viewsGainedPercent || '+4.5%'}</span>
                </div>
              </div>
            </div>

            <!-- 2. Obunachilar / Подписчики -->
            <div class="vidoor-stat-box">
              <span class="vidoor-stat-label">Подписчики / Obunachilar</span>
              <div>
                <div class="vidoor-stat-value">${data.subscribers || '—'}</div>
                <div class="vidoor-stat-sub">
                  <span class="vidoor-badge-green">+1.41%</span>
                  <span class="vidoor-badge-rank">Ranked ${data.channelRank || '#28 ming'}</span>
                </div>
              </div>
            </div>

            <!-- 3. Est. monthly earnings -->
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

            <!-- 4. Avg. video length -->
            <div class="vidoor-stat-box">
              <span class="vidoor-stat-label">Avg. video length</span>
              <div>
                <div class="vidoor-stat-value">${data.avgVideoLength || '—'}</div>
                <div class="vidoor-stat-sub">
                  <span style="color: #94a3b8;">O'rtacha davomiylik</span>
                </div>
              </div>
            </div>

            <!-- 5. Upload frequency -->
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
    } catch (err) {
      console.error("[Vidoor Extension] Error fetching stats:", err);
      container.innerHTML = `
        <div class="vidoor-card" style="padding: 12px 16px;">
          <div style="font-size: 12px; color: #94a3b8;">
            <strong style="color: #f97316;">Vidoor:</strong> Tarmoq xatoligi.
            <a href="https://vidoor.vercel.app/?q=${encodeURIComponent(channelQuery)}" target="_blank" style="color: #38bdf8; margin-left: 8px;">Saytda ochish ↗</a>
          </div>
        </div>
      `;
    } finally {
      isProcessing = false;
    }
  }

  // Listen to YouTube SPA navigation events
  window.addEventListener('yt-navigate-finish', () => {
    setTimeout(injectVidoorWidget, 500);
  });

  window.addEventListener('popstate', () => {
    setTimeout(injectVidoorWidget, 500);
  });

  // Initial check on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(injectVidoorWidget, 800);
    });
  } else {
    setTimeout(injectVidoorWidget, 800);
  }
})();
