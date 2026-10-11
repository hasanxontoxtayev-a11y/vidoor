document.addEventListener('DOMContentLoaded', () => {
  const btnAnalyze = document.getElementById('btn-analyze-current');
  const infoText = document.getElementById('current-info');
  const searchForm = document.getElementById('search-form');
  const inputQuery = document.getElementById('input-query');

  let currentTabUrl = '';

  if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0] && tabs[0].url) {
        currentTabUrl = tabs[0].url;
        if (currentTabUrl.includes('youtube.com')) {
          infoText.textContent = "YouTube sahifasi aniqlandi! 🎯";
        } else {
          infoText.textContent = "Istalgan YouTube sahifasiga o'ting yoki qidiring";
        }
      }
    });
  }

  btnAnalyze.addEventListener('click', () => {
    if (currentTabUrl && currentTabUrl.includes('youtube.com')) {
      const target = `https://vidoor.vercel.app/?q=${encodeURIComponent(currentTabUrl)}`;
      chrome.tabs.create({ url: target });
    } else {
      chrome.tabs.create({ url: 'https://vidoor.vercel.app' });
    }
  });

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = inputQuery.value.trim();
    if (q) {
      const target = `https://vidoor.vercel.app/?q=${encodeURIComponent(q)}`;
      if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
        chrome.tabs.create({ url: target });
      } else {
        window.open(target, '_blank');
      }
    }
  });
});
