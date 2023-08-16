document.addEventListener("DOMContentLoaded", async() => {

  let summaryInfo = {
    privacy: '',
    terms: '',
    cookies: ''
  };

  const summaryHtmlText = document.getElementById('simpli-summary');
  const defaultText = document.getElementById('default-text');
  const detectedText = document.getElementById('detected-text');
  const hostname = document.getElementById('hostname');

  const termButton = document.getElementById('terms-buttom')
  const privacyButton = document.getElementById('privacy-button')

  termButton.addEventListener('click', ()=>{
    termButton.className = 'selected'
    privacyButton.className = ''
    summaryHtmlText.innerHTML = summaryInfo.terms;
  })

  privacyButton.addEventListener('click', ()=>{
    privacyButton.className = 'selected'
    termButton.className = ''
    summaryHtmlText.innerHTML = summaryInfo.privacy;
  })

  chrome.storage.sync.get('summary', (obj) => {

    if (obj.summary.ifTerms) {
        defaultText.style.display = 'none';
        detectedText.style.display = 'block';
    }else{
        hostname.innerHTML = obj.summary.host;
        detectedText.style.display = 'none';
        defaultText.style.display = 'block';
    }

    summaryHtmlText.innerHTML = obj.summary.termsSummary;
    summaryInfo = {
      privacy: obj.summary.privacySummary,
      terms: obj.summary.termsSummary,
      cookies: obj.summary.cookiesSummary
    }

  });

});