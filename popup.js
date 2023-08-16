document.addEventListener("DOMContentLoaded", async() => {

  const summaryHtmlText = document.getElementById('simpli-summary');
  const defaultText = document.getElementById('default-text');
  const detectedText = document.getElementById('detected-text');

  chrome.storage.sync.get('summary', (obj) => {
    console.log(obj.summary.isDetected, "ddddd")
    if (obj.summary.isDetected) {
        defaultText.style.display = 'none';
        detectedText.style.display = 'block'
    }else{
        detectedText.style.display = 'none'
        defaultText.style.display = 'block'
    }
    summaryHtmlText.innerHTML = obj.summary.actualSummary
  });

});