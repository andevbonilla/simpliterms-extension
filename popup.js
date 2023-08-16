document.addEventListener("DOMContentLoaded", async() => {

  const summaryHtmlText = document.getElementById('simpli-summary');

  chrome.storage.sync.get('summary', (obj) => {
    console.log(obj)
    summaryHtmlText.innerHTML = obj.summary
  });

});