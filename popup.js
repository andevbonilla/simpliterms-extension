document.addEventListener("DOMContentLoaded", async() => {

  let summaryInfo = {
    privacy: [],
    terms: []
  };



  // not logged pages
  const notloggedPage = document.getElementById('not-logged');

  // logged part

  const errorView = document.getElementById('if-error');
  const successView = document.getElementById('not-error');

  const ErrorMessagDiv = document.getElementById("error-message");

  const subTypeElement = document.getElementById("sub-type");
  const usernameElement = document.getElementById("username-element");

  const loggedPage = document.getElementById('logged');
  const summaryHtmlText = document.getElementById('simpli-summary');
  const defaultText = document.getElementById('default-text');
  const detectedText = document.getElementById('detected-text');
  const defaultHostname = document.getElementById('default-hostname');
  const hostname = document.getElementById('hostname');
  const policyList = document.getElementById('policy-list');
  const termButton = document.getElementById('terms-buttom');
  const privacyButton = document.getElementById('privacy-button');

  termButton.addEventListener('click', ()=>{
    termButton.className = 'selected'
    privacyButton.className = ''
    verifyIfThereArePolicies(summaryInfo.terms)
  })

  const showSummaries = (list) => {
    let html = ''
    for (const keypoint of list) {
      html += `<li>
                 <h3>${keypoint.subtitle}</h3>
                 <p>${keypoint.text}</p>
               </li>`
    }
    return html
  }

  privacyButton.addEventListener('click', ()=>{
    privacyButton.className = 'selected'
    termButton.className = ''
    verifyIfThereArePolicies(summaryInfo.privacy)
  })

  const verifyIfAuthenticated = (auth) => {
    if (auth === false) {
      notloggedPage.style.display = "block";
      loggedPage.style.display = "none";
    }else{
      loggedPage.style.display = "block";
      notloggedPage.style.display = "none";
    }
  }

  const verifyIfThereArePolicies = (terms) => {
    if (terms.length === 0) {
      summaryHtmlText.innerHTML = `<a href="https://simpliterms.com/#pricing" target="_blank">Upgrade to pro</a> plan to be able to generate summaries with AI in real time.`
    }else{
      summaryHtmlText.innerHTML = showSummaries(terms);
    }
  }

  const ifErrorShowIt = (errorMessage) => {
    if (errorMessage === "") {
      // there weren't none one error (different of the auth error) from the backend
      successView.style.display = "block";
      errorView.style.display = "none";
    }else{
      ErrorMessagDiv.innerHTML = `Message: ${errorMessage}`
      successView.style.display = "none";
      errorView.style.display = "block";
    }
  }

  const setUserInfo = (userInfo) => {
    if (userInfo.username && userInfo.planType) {
      subTypeElement.innerHTML = `${userInfo.planType.toUpperCase()}`;
      usernameElement.innerHTML = `${userInfo.username}`;
      if (userInfo.planType === "free") {

          subTypeElement.style.backgroundColor = '#5712DF';

      }else if(userInfo.planType === "basic"){

          subTypeElement.style.backgroundColor = '#32EEB8';

      }else if(userInfo.planType === "pro"){

          subTypeElement.style.backgroundColor = 'black';

      }else{

          subTypeElement.style.backgroundColor = 'gray';

      }
    }
  }

  chrome.storage.sync.get('summary', (obj) => {

    // verify the authentication of user
    verifyIfAuthenticated(obj.summary.isAuthenticate);

    // show the errors from backend or the suscces view in case of no errors
    ifErrorShowIt(obj.summary.errorMessage);

    // validate there are policies to show
    verifyIfThereArePolicies(obj.summary.termsOfUse);

    // set the username info
    setUserInfo(obj.summary.userInfo);

    // set the host
    if (obj.summary.host) {
      hostname.innerHTML = obj.summary.host;
      defaultHostname.innerHTML = obj.summary.host;
    }
    
    if (obj.summary.ifPrivacy) {
        showSummaries(obj.summary.termsOfPrivacy)
        policyList.innerHTML =  `${(obj.summary.ifPrivacy) ? 'Privacy Policy' : ''}, ${(obj.summary.ifTerms) ? 'Terms of Use' : ''}`
        defaultText.style.display = 'none';
        detectedText.style.display = 'block';
    }else{
        if (obj.summary.ifTerms) {
          showSummaries(obj.summary.termsOfUse);
        }
        detectedText.style.display = 'none';
        defaultText.style.display = 'block';
    }
    
    
    summaryInfo = {
      privacy: obj.summary.termsOfPrivacy,
      terms: obj.summary.termsOfUse
    }

  });

});