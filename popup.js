document.addEventListener("DOMContentLoaded", async() => {

  let summaryInfo = {
    privacy: '',
    terms: '',
    cookies: ''
  };

  const summaryHtmlText = document.getElementById('simpli-summary');
  const defaultText = document.getElementById('default-text');
  const detectedText = document.getElementById('detected-text');
  const defaultHostname = document.getElementById('default-hostname');
  const hostname = document.getElementById('hostname');
  const policyList = document.getElementById('policy-list');

  const termButton = document.getElementById('terms-buttom')
  const privacyButton = document.getElementById('privacy-button')

  termButton.addEventListener('click', ()=>{
    termButton.className = 'selected'
    privacyButton.className = ''
    verifyIfThereArePolicies(summaryInfo.terms)
  })

  privacyButton.addEventListener('click', ()=>{
    privacyButton.className = 'selected'
    termButton.className = ''
    verifyIfThereArePolicies(summaryInfo.privacy)
  })

  const verifyIfThereArePolicies = (terms) => {
    if (terms.length === 0) {
      summaryHtmlText.innerHTML = `<a href="https://simpliterms.com/#pricing" target="_blank">Upgrade to pro</a> plan to be able to generate summaries with AI in real time.`
    }else{
      summaryHtmlText.innerHTML = terms;
    }
  }

  chrome.storage.sync.get('summary', (obj) => {

    verifyIfThereArePolicies(obj.summary.termsSummary)

    if (obj.summary.host) {
      hostname.innerHTML = obj.summary.host;
      defaultHostname.innerHTML = obj.summary.host;
    }
    
    if (obj.summary.ifPrivacy) {
        policyList.innerHTML =  `${obj.summary.policyToAccept.join(', ')}`
        defaultText.style.display = 'none';
        detectedText.style.display = 'block';
    }else{
        detectedText.style.display = 'none';
        defaultText.style.display = 'block';
    }
    
    summaryInfo = {
      privacy: obj.summary.privacySummary,
      terms: obj.summary.termsSummary,
      cookies: obj.summary.cookiesSummary
    }

  });

});