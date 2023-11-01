document.addEventListener("DOMContentLoaded", async() => {

      let summaryInfo = {
        privacy: [],
        terms: [],
        token: '',
        host: '',
        privacyError: "",
        termsError: "",
      };

      let canGiveAlikeODislike = false;
      let actualTabID;
      let isLoadingTerms = false;
      let isLoadingPrivacy = false;
      // const backendURL = "https://simpliterms-backend-production.up.railway.app";
      const backendURL = "http:localhost:4200";

      // not logged pages
      const notloggedPage = document.getElementById('not-logged');

      // logged part
      const loadingContainer = document.getElementById('loading-container');
      const loadingContainerTerms = document.getElementById('loading-container-terms');
      const loadingContainerPrivacy = document.getElementById('loading-container-privacy');
      const subTypeElement = document.getElementById("sub-type");
      const usernameElement = document.getElementById("username-element");
      const greetingElement = document.getElementById("greeting");
      const simplitermsNameElement = document.getElementById("simpliterms-name");
      const loggedPage = document.getElementById('logged');
      const TermsSummaryHtmlText = document.getElementById('simpli-summary-terms');
      const PrivacySummaryHtmlText = document.getElementById('simpli-summary-privacy');
      const defaultText = document.getElementById('default-text');
      const detectedText = document.getElementById('detected-text');
      const defaultHostname = document.getElementById('default-hostname');
      const hostname = document.getElementById('hostname');
      const policyList = document.getElementById('policy-list');
      const termButton = document.getElementById('terms-buttom');
      const privacyButton = document.getElementById('privacy-button');
      const disclaimerMessage = document.getElementById('disclaimer');

      termButton.addEventListener('click', ()=>{
          showTermsWindow();
          setTermsSummary();
      });

      privacyButton.addEventListener('click', ()=>{
          showPrivacyWindow();
          setPrivacySummary();
      });

      // like and dislike functionalities
      const sendFeedBackUrl = `${backendURL}/api/summary`;
      const questionHeader = document.getElementById('question-header');

      const likeButton = document.getElementById('like-button');
      likeButton.addEventListener('click', async(e)=>{

          e.preventDefault();
          questionHeader.style.display = "none";
          if (canGiveAlikeODislike) {
              try {
                
                const res =  await fetch(sendFeedBackUrl, {
                                          method: 'POST',
                                          headers: {
                                              'Content-Type': 'application/json',
                                              'Authorization': `Bearer ${summaryInfo.token}`
                                          },
                                          body: JSON.stringify({...summaryInfo,
                                            policyWebpage: summaryInfo.host,
                                            type: 'like'
                                          })
                                        }
                                    )

                await res.json();                
             
              } catch (error) {
                console.log(error);
                questionHeader.style.display = "flex";
              }
          }
      });

      const dislikeButton = document.getElementById('dislike-button');
      dislikeButton.addEventListener('click', async(e)=>{

          e.preventDefault();
          questionHeader.style.display = "none";
          if (canGiveAlikeODislike) {
              try {
                
                const res =  await fetch(sendFeedBackUrl, {
                                          method: 'POST',
                                          headers: {
                                              'Content-Type': 'application/json',
                                              'Authorization': `Bearer ${summaryInfo.token}`
                                          },
                                          body: JSON.stringify({...summaryInfo,
                                            policyWebpage: summaryInfo.host,
                                            type: 'dislike'
                                          })
                                        }
                                    )

                const result = await res.json();                
             
              } catch (error) {
                console.log(error);
                questionHeader.style.display = "flex";
              }
          }
      });
      
      //functions to set data
      const showSummaries = (list, type) => {
        for (let i = 0; i < list.length; i++) {
          const li = document.createElement('li');
          const h3 = document.createElement('h3');
          h3.textContent = list[i].subtitle;
          const p = document.createElement('p');
          p.textContent = list[i].text;
          li.appendChild(h3);
          li.appendChild(p);
          if (type === "privacy") {
            PrivacySummaryHtmlText.appendChild(li);
          }
          if (type === "terms") {
            TermsSummaryHtmlText.appendChild(li);
          }   
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

      const verifyIfAuthenticated = (auth, userInfo) => {
        if (auth === false) {

          notloggedPage.style.display = "block";
          simplitermsNameElement.style.display = "block";
          loggedPage.style.display = "none";
          greetingElement.style.display = "none";

        }else{
          
          // set the username info
          setUserInfo(userInfo);
          loggedPage.style.display = "block";
          greetingElement.style.display = "block";
          notloggedPage.style.display = "none";
          simplitermsNameElement.style.display = "none";

        }
      }



      const setPrivacySummary = () => {
          PrivacySummaryHtmlText.innerHTML = '';
          if (!isLoadingPrivacy) {
            loadingContainerPrivacy.style.display = "none";
          }
          if (summaryInfo.privacy.length === 0 && summaryInfo.privacyError !== "") {
            PrivacySummaryHtmlText.textContent = summaryInfo.privacyError;
          }else{
            showSummaries(summaryInfo.privacy, "privacy");
          }
      }

      const setTermsSummary = () => {
          TermsSummaryHtmlText.innerHTML = '';
          if (!isLoadingTerms) {
            loadingContainerTerms.style.display = "none";
          }
          if (summaryInfo.terms.length === 0 && summaryInfo.termsError !== "") {
            TermsSummaryHtmlText.textContent = summaryInfo.termsError;
          }else{
            showSummaries(summaryInfo.terms, "terms");
          }
      }



      // functios to simplify the code
      const showTermsWindow = () => {
          if (isLoadingTerms) {
            loadingContainerTerms.style.display = "flex";
          }
          loadingContainerPrivacy.style.display = "none";
          termButton.className = 'selected';
          privacyButton.className = '';
          TermsSummaryHtmlText.style.display = "block";
          PrivacySummaryHtmlText.style.display = "none";
      }

      const ShowdisclaimerAndFeedback = () => {

        disclaimerMessage.style.display = "block";

        disclaimerMessage.textContent = `This summary seeks to summarize the policies of the page you are accessing. 
                                         It is important to note that this summary has been generated with artificial intelligence, 
                                         so it may not be exact, contain errors and erroneous information. We recommend checking the 
                                         official source for this page's policies and only using simpliTerms as an aid.`;

        if (isLoadingTerms === false && isLoadingPrivacy === false) {
          questionHeader.style.display = "flex";
          canGiveAlikeODislike = true;
        }

      }

      const showPrivacyWindow = () => {
          if (isLoadingPrivacy) {
            loadingContainerPrivacy.style.display = "flex";
          }
          loadingContainerTerms.style.display = "none";
          privacyButton.className = 'selected';
          termButton.className = '';
          TermsSummaryHtmlText.style.display = "none";
          PrivacySummaryHtmlText.style.display = "block"; 
      }

      // send a message to the content.js when the popup is opened.
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          actualTabID = tabs[0].id;
          chrome.tabs.sendMessage(actualTabID, {message: 'popupLoaded'});
      });


      // listen the response of the content.js 
      chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

          if (request.message === 'staticResult' && request.serverData) {

              loadingContainer.style.display = "none";

              // set the host
              if (request.serverData.host) {
                hostname.textContent = request.serverData.host;
                defaultHostname.textContent  = request.serverData.host;
              }

              // verify the authentication of user
              verifyIfAuthenticated(request.serverData.isAuthenticate, request.serverData.userInfo);

              // if there was an error obtaining the static summary        
              if(request.serverData.errorMessage !== ""){
                // send a message to the content.js if there is an error different of the auth error.
                isLoadingPrivacy = true;
                isLoadingTerms = true;
                loadingContainerTerms.style.display = "flex";
                chrome.tabs.sendMessage(actualTabID, {message: 'termsAISumary'});
                chrome.tabs.sendMessage(actualTabID, {message: 'privacyAISumary'});
                return;
              }

              summaryInfo = {
                privacy: request.serverData.termsOfPrivacy,
                terms: request.serverData.termsOfUse,
                token: request.serverData.tokenValidator,
                host: request.serverData.host,
                privacyError: "",
                termsError: ""
              }

              // validate there are policies to show
              setTermsSummary(request.serverData.termsOfUse);
              isLoadingTerms = false;
              setPrivacySummary(request.serverData.termsOfPrivacy);
              isLoadingPrivacy = false;

              // show disclaimer message and feedback part if terms and privacy are both loaded
              ShowdisclaimerAndFeedback();
              
              if (request.serverData.ifPrivacy) {
                  policyList.textContent =  `${(request.serverData.ifPrivacy) ? 'Privacy Policy' : ''}, ${(request.serverData.ifTerms) ? 'Terms of Use' : ''}`
                  defaultText.style.display = 'none';
                  detectedText.style.display = 'block';
              }else{
                  detectedText.style.display = 'none';
                  defaultText.style.display = 'block';
              }
                  
          }

          if (request.message === 'termsAIResult' && request.serverData) {

              loadingContainer.style.display = "none";

              // set the host
              if (request.serverData.host) {
                hostname.textContent = request.serverData.host;
                defaultHostname.textContent  = request.serverData.host;
              }

              // verify the authentication of user
              verifyIfAuthenticated(request.serverData.isAuthenticate, request.serverData.userInfo);

              // if there was an error obtaining the summary generated by AI
              if (request.serverData.errorMessage !== "") {
                isLoadingTerms = false;
                loadingContainerTerms.style.display = "none";
                TermsSummaryHtmlText.innerHTML = `😞 ${request.serverData.errorMessage}`;
                summaryInfo = {
                  ...summaryInfo,
                  terms: [],
                  termsError: request.serverData.errorMessage,
                  token: request.serverData.tokenValidator,
                  host: request.serverData.host
                }
                return;
              }

              summaryInfo = {
                  ...summaryInfo,
                  terms: request.serverData.termsOfUse,
                  termsError: "",
                  token: request.serverData.tokenValidator,
                  host: request.serverData.host
              }

              // validate there are policies to show
              loadingContainerTerms.style.display = "none";
              setTermsSummary(request.serverData.termsOfUse);
              isLoadingTerms = false;

              // show the terms
              showTermsWindow();

              // show disclaimer message and feedback part if terms and privacy are both loaded
              ShowdisclaimerAndFeedback();
              
              if (request.serverData.ifTerms) {
                  policyList.textContent = policyList.textContent + 'Terms of Use';
                  defaultText.style.display = 'none';
                  detectedText.style.display = 'block';
              }else{
                  detectedText.style.display = 'none';
                  defaultText.style.display = 'block';
              }
                                
          }

          if (request.message === 'privacyAIResult' && request.serverData) {

              loadingContainer.style.display = "none";

              // set the host
              if (request.serverData.host) {
                hostname.textContent = request.serverData.host;
                defaultHostname.textContent  = request.serverData.host;
              }

              // verify the authentication of user
              verifyIfAuthenticated(request.serverData.isAuthenticate, request.serverData.userInfo);

              // if there was an error obtaining the summary generated by AI
              if (request.serverData.errorMessage !== "") {
                isLoadingPrivacy = false;
                loadingContainerPrivacy.style.display = "none";
                PrivacySummaryHtmlText.innerHTML = `😞 ${request.serverData.errorMessage}`;
                summaryInfo = {
                  ...summaryInfo,
                  privacy: [],
                  privacyError: request.serverData.errorMessage,
                  token: request.serverData.tokenValidator,
                  host: request.serverData.host
                }
                return;
              }

              summaryInfo = {
                  ...summaryInfo,
                  privacy: request.serverData.termsOfPrivacy,
                  privacyError: "",
                  token: request.serverData.tokenValidator,
                  host: request.serverData.host
              }

              // validate there are policies to show
              loadingContainerPrivacy.style.display = "none";
              setPrivacySummary(request.serverData.termsOfPrivacy);
              isLoadingPrivacy = false;
              
              // show privacy when loaded
              showPrivacyWindow();

              // show disclaimer message and feedback part if terms and privacy are both loaded
              ShowdisclaimerAndFeedback();
              
              if (request.serverData.ifPrivacy) {
                  policyList.textContent = policyList.textContent + ' Privacy Policy'
                  defaultText.style.display = 'none';
                  detectedText.style.display = 'block';
              }else{
                  detectedText.style.display = 'none';
                  defaultText.style.display = 'block';
              }
                  
          }

      });

});