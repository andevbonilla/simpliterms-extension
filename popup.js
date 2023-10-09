document.addEventListener("DOMContentLoaded", async() => {

      let summaryInfo = {
        privacy: [],
        terms: []
      };

      // not logged pages
      const notloggedPage = document.getElementById('not-logged');

      // logged part

      const loadingContainer = document.getElementById('loading-container');
      const loadingMessage = document.getElementById('loading-message');

      const errorView = document.getElementById('if-error');
      const successView = document.getElementById('not-error');

      const ErrorMessagDiv = document.getElementById("error-message");

      const subTypeElement = document.getElementById("sub-type");
      const usernameElement = document.getElementById("username-element");

      const greetingElement = document.getElementById("greeting");
      const simplitermsNameElement = document.getElementById("simpliterms-name");

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
          simplitermsNameElement.style.display = "block";
          loggedPage.style.display = "none";
          greetingElement.style.display = "none";

        }else{
          
          loggedPage.style.display = "block";
          greetingElement.style.display = "block";
          notloggedPage.style.display = "none";
          simplitermsNameElement.style.display = "none";

        }
      }

      const verifyIfThereArePolicies = (terms) => {
        if (terms.length === 0) {
          summaryHtmlText.textContent = `loading...`
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
          ErrorMessagDiv.textContent = `Message: ${errorMessage}`
          successView.style.display = "none";
          errorView.style.display = "block";
        }
      }

      const setUserInfo = (userInfo) => {

        if (userInfo.username !== null && 
            userInfo.planType !== null && 
            userInfo.username !== undefined && 
            userInfo.planType !== undefined)  
        {
          subTypeElement.textContent = `${userInfo.planType.toUpperCase()}`;
          usernameElement.textContent = `${userInfo.username}`;
          if (userInfo.planType === "free") {

              subTypeElement.style.backgroundColor = '#5712DF';

          }else if(userInfo.planType === "basic"){

              subTypeElement.style.backgroundColor = '#32EEB8';

          }else if(userInfo.planType === "pro"){

              subTypeElement.style.backgroundColor = 'black';

          }else{

              subTypeElement.textContent = "NONE"
              subTypeElement.style.backgroundColor = 'gray';

          }
        }

      }

      // send a message to the content.js when the popup is opened.
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {message: 'popupLoaded'});
      });


      // listen the response of the content.js 
      chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
          if (request.message === 'serverResult' && request.serverData) {

              loadingContainer.style.display = "none";
              // verify the authentication of user
              verifyIfAuthenticated(request.serverData.isAuthenticate);

              // show the errors from backend or the suscces view in case of no errors
              ifErrorShowIt(request.serverData.errorMessage);

              // validate there are policies to show
              verifyIfThereArePolicies(request.serverData.termsOfUse);

              // set the username info
              setUserInfo(request.serverData.userInfo);

              // set the host
              if (request.serverData.host) {
                hostname.textContent = request.serverData.host;
                defaultHostname.textContent  = request.serverData.host;
              }
              
              if (request.serverData.ifPrivacy) {
                  showSummaries(request.serverData.termsOfPrivacy)
                  policyList.textContent =  `${(request.serverData.ifPrivacy) ? 'Privacy Policy' : ''}, ${(request.serverData.ifTerms) ? 'Terms of Use' : ''}`
                  defaultText.style.display = 'none';
                  detectedText.style.display = 'block';
              }else{
                  if (request.serverData.ifTerms) {
                    showSummaries(request.serverData.termsOfUse);
                  }
                  detectedText.style.display = 'none';
                  defaultText.style.display = 'block';
              }
              
              
              summaryInfo = {
                privacy: request.serverData.termsOfPrivacy,
                terms: request.serverData.termsOfUse
              }
              // Envía el contenido del popup al script de contenido
              sendResponse({content: document.body.innerHTML});
          }
      });


      // chrome.storage.sync.get('summary', (obj) => {

      //   // verify the authentication of user
      //   verifyIfAuthenticated(obj.summary.isAuthenticate);

      //   // show the errors from backend or the suscces view in case of no errors
      //   ifErrorShowIt(obj.summary.errorMessage);

      //   // validate there are policies to show
      //   verifyIfThereArePolicies(obj.summary.termsOfUse);

      //   // set the username info
      //   setUserInfo(obj.summary.userInfo);

      //   // set the host
      //   if (obj.summary.host) {
      //     hostname.textContent = obj.summary.host;
      //     defaultHostname.textContent  = obj.summary.host;
      //   }
        
      //   if (obj.summary.ifPrivacy) {
      //       showSummaries(obj.summary.termsOfPrivacy)
      //       policyList.textContent =  `${(obj.summary.ifPrivacy) ? 'Privacy Policy' : ''}, ${(obj.summary.ifTerms) ? 'Terms of Use' : ''}`
      //       defaultText.style.display = 'none';
      //       detectedText.style.display = 'block';
      //   }else{
      //       if (obj.summary.ifTerms) {
      //         showSummaries(obj.summary.termsOfUse);
      //       }
      //       detectedText.style.display = 'none';
      //       defaultText.style.display = 'block';
      //   }
        
        
      //   summaryInfo = {
      //     privacy: obj.summary.termsOfPrivacy,
      //     terms: obj.summary.termsOfUse
      //   }

      // });

});