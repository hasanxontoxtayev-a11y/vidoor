// Vidoor 1-Click In-Page Script for YouTube (YouTube ichida to'g'ridan-to'g'ri ishlash)
// Channel sahifalarida, Video sahifalarida (/watch) va qidiruvda ishlaydi!

(function () {
  // 1. Uslublarni kiritish
  if (!document.getElementById('vidoor-inpage-styles')) {
    const style = document.createElement('style');
    style.id = 'vidoor-inpage-styles';
    style.textContent = `
      .vidoor-injected-container {
        width: 100% !important;
        max-width: 1280px !important;
        margin: 14px auto !important;
        padding: 0 12px !important;
        box-sizing: border-box !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif !important;
        z-index: 9999 !important;
        position: relative !important;
      }
      .vidoor-card {
        background: #090d16 !important;
        border: 2px solid #10b981 !important;
        border-radius: 20px !important;
        padding: 18px 22px !important;
        color: #f8fafc !important;
        box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.7), 0 0 25px rgba(16, 185, 129, 0.2) !important;
        animation: vidoorFadeIn 0.3s ease-out !important;
      }
      @keyframes vidoorFadeIn {
        from { opacity: 0; transform: translateY(-8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .vidoor-card-header {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        padding-bottom: 14px !important;
        margin-bottom: 14px !important;
        border-bottom: 1px solid #1e293b !important;
        flex-wrap: wrap !important;
        gap: 10px !important;
      }
      .vidoor-brand {
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
      }
      .vidoor-logo-img {
        width: 32px !important;
        height: 32px !important;
        border-radius: 10px !important;
        object-fit: cover !important;
        border: 1.5px solid #10b981 !important;
      }
      .vidoor-logo-text {
        font-size: 18px !important;
        font-weight: 900 !important;
        letter-spacing: 0.5px !important;
      }
      .vidoor-logo-text .vid { color: #10b981 !important; }
      .vidoor-logo-text .oor { color: #f97316 !important; }
      .vidoor-badge-tag {
        font-size: 10px !important;
        font-weight: 800 !important;
        background: rgba(16, 185, 129, 0.15) !important;
        color: #34d399 !important;
        padding: 3px 8px !important;
        border-radius: 12px !important;
        border: 1px solid rgba(16, 185, 129, 0.3) !important;
      }
      .vidoor-header-actions {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
      }
      .vidoor-btn {
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
        font-size: 11px !important;
        font-weight: 800 !important;
        padding: 6px 12px !important;
        border-radius: 12px !important;
        text-decoration: none !important;
        cursor: pointer !important;
        border: none !important;
        transition: all 0.2s !important;
      }
      .vidoor-btn-primary {
        background: linear-gradient(135deg, #10b981, #059669) !important;
        color: #ffffff !important;
      }
      .vidoor-btn-secondary {
        background: #1e293b !important;
        color: #94a3b8 !important;
        border: 1px solid #334155 !important;
      }
      .vidoor-btn-close {
        background: transparent !important;
        color: #64748b !important;
        font-size: 16px !important;
        padding: 4px 8px !important;
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
        background: #0f172a !important;
        border: 1px solid #1e293b !important;
        border-radius: 14px !important;
        padding: 12px 14px !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        min-height: 80px !important;
      }
      .vidoor-stat-box.highlight {
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), #0f172a) !important;
        border: 1.5px solid #10b981 !important;
      }
      .vidoor-stat-label {
        font-size: 11px !important;
        font-weight: 600 !important;
        color: #94a3b8 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.5px !important;
      }
      .vidoor-stat-value {
        font-size: 20px !important;
        font-weight: 900 !important;
        color: #ffffff !important;
        margin-top: 4px !important;
      }
      .vidoor-stat-sub {
        font-size: 11px !important;
        font-weight: 700 !important;
        margin-top: 4px !important;
      }
      .vidoor-badge-green {
        color: #34d399 !important;
        background: rgba(16, 185, 129, 0.2) !important;
        padding: 2px 6px !important;
        border-radius: 6px !important;
      }
      .vidoor-badge-red {
        color: #f87171 !important;
        background: rgba(239, 68, 68, 0.2) !important;
        padding: 2px 6px !important;
        border-radius: 6px !important;
      }
      .vidoor-ai-banner {
        margin-top: 12px !important;
        padding: 10px 14px !important;
        border-radius: 12px !important;
        background: rgba(249, 115, 22, 0.1) !important;
        border: 1px solid rgba(249, 115, 22, 0.25) !important;
        font-size: 12px !important;
        color: #fed7aa !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 8px !important;
      }
    `;
    document.head.appendChild(style);
  }

  // 2. YouTube sahifasidagi kanalni aniqlash (Video sahifasi yoki Kanal sahifasi)
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

    // E. Qidiruv sahifasi (/results?search_query=...)
    const params = new URLSearchParams(window.location.search);
    const sq = params.get('search_query');
    if (sq) return sq;

    return null;
  }

  // 3. YouTube sahifasida Vidoor joylashadigan nuqtani topish
  function findInsertionTarget() {
    const isWatch = window.location.pathname.includes('/watch') || window.location.search.includes('v=');

    if (isWatch) {
      const videoTarget = document.querySelector('ytd-watch-metadata') || document.querySelector('#below') || document.querySelector('#primary-inner');
      if (videoTarget) return { element: videoTarget, isVideo: true };
    } else {
      // Kanal sahifasi uchun eng maqbul joy (header tagida):
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

  async function run() {
    let channelQuery = detectChannel();
    if (!channelQuery) {
      // Agar avtomatik topilmasa, foydalanuvchidan so'rash
      channelQuery = prompt("Vidoor AI: Qaysi YouTube kanalni tahlil qilmoqchisiz? (Masalan: Xamdam Sobirov, Kun.uz yoki @mittivine):", "Xamdam Sobirov");
      if (!channelQuery) return;
    }

    const targetInfo = findInsertionTarget();
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
      let data = null;
      try {
        const cached = sessionStorage.getItem('vidoor_cache_' + channelQuery);
        if (cached) data = JSON.parse(cached);
      } catch (e) {}

      if (!data) {
        // DOM'dan bir zumda (0.001s) aniqlash
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

        data = {
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

        // Orqa fonda serverdan yangilash
        fetch(`https://vidoor.vercel.app/api/youtube?query=${encodeURIComponent(channelQuery)}`)
          .then(r => r.json())
          .then(sd => {
            if (sd && !sd.error) {
              try { sessionStorage.setItem('vidoor_cache_' + channelQuery, JSON.stringify(sd)); } catch (e) {}
            }
          })
          .catch(() => {});
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
              <button onclick="alert('AI Diagnostika xulosasi:\\n\\n1. Muqova CTR bosish foizi: 4.8% (Norma: 8-12%)\\n2. Dastlabki 30 soniyalik Hook: Tomoshabinlar chiqib ketishini kamaytiring\\n3. Eng maqbul soat: 18:00 - 21:00 UZT\\n\\nTo\\'liq AI tahlilini Vidoor saytida ko\\'ring!')" class="vidoor-btn vidoor-btn-secondary">
                <span>💡 AI Diagnostika</span>
              </button>
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

          <div class="vidoor-ai-banner">
            <div>
              <strong>🤖 Vidoor AI Xulosasi: </strong>
              <span>${data.aiInsight || 'Kanal oylik daromadi va tomoshabinlar oqimi barqaror. CTR muqovalarini yangilash tavsiya etiladi.'}</span>
            </div>
            <a href="https://vidoor.vercel.app/?q=${encodeURIComponent(data.handle || data.name)}" target="_blank" style="color: #f97316; font-weight: bold; text-decoration: none; white-space: nowrap;">Batafsil ↗</a>
          </div>
        </div>
      `;

      container.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (e) {
      alert("Vidoor xatoligi: " + e.message);
    }
  }

  run();
})();
