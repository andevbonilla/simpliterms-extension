document.addEventListener("DOMContentLoaded", async() => {

  const summaryHtmlText = document.getElementById('simpli-summary');
  const defaultText = document.getElementById('default-text');
  const detectedText = document.getElementById('detected-text');
  const hostname = document.getElementById('hostname');

  chrome.storage.sync.get('summary', (obj) => {

    if (obj.summary.ifPrivacy) {
        defaultText.style.display = 'none';
        detectedText.style.display = 'block';
    }else{
        hostname.innerHTML = obj.summary.host;
        detectedText.style.display = 'none';
        defaultText.style.display = 'block';
    }

    summaryHtmlText.innerHTML = obj.summary.actualSummary;

  });

});