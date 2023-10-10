document.addEventListener("DOMContentLoaded", async() => {


      let summaryInfo = {
        privacy: [],
        terms: [],
        token: ''
      };

      // not logged pages
      const notloggedPage = document.getElementById('not-logged');

      // logged part

      const loadingContainer = document.getElementById('loading-container');

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
        verifyIfThereArePolicies(summaryInfo.terms, 'terms')
      });

      privacyButton.addEventListener('click', ()=>{
        privacyButton.className = 'selected'
        termButton.className = ''
        verifyIfThereArePolicies(summaryInfo.privacy, 'privacy')
      });
      

      const showSummaries = (list, type) => {
        
        let sendFeedBackUrl = (type === 'terms') ? "" : "";

        for (let i = 0; i < list.length; i++) {

          const li = document.createElement('li');
          const h3 = document.createElement('h3');
          h3.textContent = list[i].subtitle;
          const p = document.createElement('p');
          p.textContent = list[i].text;
          
          if (i === 0) {

            const questionDIV = document.createElement('div');
            questionDIV.classList = 'question-header'

            const questionText = document.createElement('p');
            questionText.textContent = "Did you find this summary useful?";

            const likeButton = document.createElement('button');
            likeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2H464c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48H294.5c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3V320 272 247.1c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192H96c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V224c0-17.7 14.3-32 32-32z"/></svg>`;
            likeButton.addEventListener('click', ()=>{
              fetch(sendFeedBackUrl, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'x-token': summaryInfo.token
                                        },
                                        body: JSON.stringify({...summaryInfo,
                                          policyWebpage: window.location.host,
                                          type: 'like'
                                        })
                                      }
              )
            });
      

            const dislikeButton = document.createElement('button');
            dislikeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M313.4 479.1c26-5.2 42.9-30.5 37.7-56.5l-2.3-11.4c-5.3-26.7-15.1-52.1-28.8-75.2H464c26.5 0 48-21.5 48-48c0-18.5-10.5-34.6-25.9-42.6C497 236.6 504 223.1 504 208c0-23.4-16.8-42.9-38.9-47.1c4.4-7.3 6.9-15.8 6.9-24.9c0-21.3-13.9-39.4-33.1-45.6c.7-3.3 1.1-6.8 1.1-10.4c0-26.5-21.5-48-48-48H294.5c-19 0-37.5 5.6-53.3 16.1L202.7 73.8C176 91.6 160 121.6 160 153.7V192v48 24.9c0 29.2 13.3 56.7 36 75l7.4 5.9c26.5 21.2 44.6 51 51.2 84.2l2.3 11.4c5.2 26 30.5 42.9 56.5 37.7zM32 384H96c17.7 0 32-14.3 32-32V128c0-17.7-14.3-32-32-32H32C14.3 96 0 110.3 0 128V352c0 17.7 14.3 32 32 32z"/></svg>`;
            dislikeButton.addEventListener('click', ()=>{
              fetch(sendFeedBackUrl, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'x-token': summaryInfo.token
                                        },
                                        body: JSON.stringify({...summaryInfo,
                                          policyWebpage: window.location.host,
                                          type: 'dislike'
                                        })
                                      }
              )
            });


            questionDIV.appendChild(questionText);
            questionDIV.appendChild(likeButton);
            questionDIV.appendChild(dislikeButton);

            li.appendChild(questionDIV);
            li.appendChild(h3);
            li.appendChild(p);
            summaryHtmlText.appendChild(li);

          }else{
            li.appendChild(h3);
            li.appendChild(p);
            summaryHtmlText.appendChild(li);
          }
           
        }
      }

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

      const verifyIfThereArePolicies = (terms, type) => {
        if (terms.length === 0) {
          summaryHtmlText.textContent = `loading...`
        }else{
          summaryHtmlText.innerHTML = '';
          showSummaries(terms, type);
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
                terms: request.serverData.termsOfUse,
                token: request.serverData.tokenValidator
              }
              
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