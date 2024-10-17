document.addEventListener("DOMContentLoaded", async() => {

      let summaryInfo = {
        privacy: "",
        terms: "",
        token: '',
        host: '',
        privacyError: "",
        termsError: "",
      };

      let actualTabID;
      let isLoadingTerms = false;
      let isLoadingPrivacy = false;

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

      const defaultHostname = document.getElementById('default-hostname');
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
      
      const setUserInfo = (userInfo) => {

        if (userInfo.username !== null && 
            userInfo.accessType !== null && 
            userInfo.username !== undefined && 
            userInfo.accessType !== undefined)  
        {
          subTypeElement.textContent = `${userInfo.accessType.toUpperCase()}`;
          usernameElement.textContent = `${userInfo.username}`;
          if (userInfo.accessType === "free") {

              subTypeElement.style.backgroundColor = '#5712DF';

          }else if(userInfo.accessType === "basic"){

              subTypeElement.style.backgroundColor = '#32EEB8';

          }else if(userInfo.accessType === "pro"){

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
          return false;

        }else{
          
          // set the username info
          setUserInfo(userInfo);
          loggedPage.style.display = "block";
          greetingElement.style.display = "block";
          notloggedPage.style.display = "none";
          simplitermsNameElement.style.display = "none";
          return true;

        }
      }


      const setPrivacySummary = () => {
          PrivacySummaryHtmlText.textContent = '';
          if (!isLoadingPrivacy) {
            loadingContainerPrivacy.style.display = "none";
          }
          if (summaryInfo.privacy.length === 0 && summaryInfo.privacyError !== "") {
            PrivacySummaryHtmlText.textContent = summaryInfo.privacyError;
          }else{
            PrivacySummaryHtmlText.textContent = summaryInfo.privacy;
          }
      }

      const setTermsSummary = () => {
          TermsSummaryHtmlText.textContent = '';
          if (!isLoadingTerms) {
            loadingContainerTerms.style.display = "none";
          }
          if (summaryInfo.terms.length === 0 && summaryInfo.termsError !== "") {
            TermsSummaryHtmlText.textContent = summaryInfo.termsError;
          }else{
            TermsSummaryHtmlText.textContent = summaryInfo.terms;
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
      };

      const showPrivacyWindow = () => {
          if (isLoadingPrivacy) {
            loadingContainerPrivacy.style.display = "flex";
          }
          loadingContainerTerms.style.display = "none";
          privacyButton.className = 'selected';
          termButton.className = '';
          TermsSummaryHtmlText.style.display = "none";
          PrivacySummaryHtmlText.style.display = "block"; 
      };

      const ShowdisclaimerAndFeedback = () => {

        disclaimerMessage.style.display = "block";

        disclaimerMessage.textContent = `This summary seeks to summarize the policies of the page you are accessing. 
                                         It is important to note that this summary has been generated with artificial intelligence, 
                                         so it may not be exact, contain errors and erroneous information. We recommend checking the 
                                         official source for this page's policies and only using simpliTerms as an aid.`;

      };

      // send a message to the content.js when the popup is opened.
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          actualTabID = tabs[0].id;
          chrome.tabs.sendMessage(actualTabID, {message: 'popupLoaded'});
      });


      // listen the response of the content.js 
      chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

          if (request.message === 'serverResultError' && request.serverData) {

              isLoadingTerms = false;
              isLoadingPrivacy = false;
              loadingContainerTerms.style.display = "none";
              loadingContainerPrivacy.style.display = "none";
              TermsSummaryHtmlText.textContent = `${request.serverData.errorMessage}`;
              PrivacySummaryHtmlText.textContent = `${request.serverData.errorMessage}`;
              summaryInfo = {
                ...summaryInfo,
                terms: "",
                privacy: "",
                termsError: request.serverData.errorMessage,
                privacyError: request.serverData.errorMessage,
                token: request.serverData.tokenValidator,
                host: request.serverData.host
              }
                      
          }

          if (request.message === 'serverResultTerms' && request.serverData) {

              loadingContainer.style.display = "none";
              loadingContainerTerms.style.display = "flex";

              // set the host
              if (request.serverData.host) {
                defaultHostname.textContent = request.serverData.host;
              }

              // verify the authentication of user
              const isAuth = verifyIfAuthenticated(request.serverData.isAuthenticate, request.serverData.userInfo);
              if (!isAuth) {
                  isLoadingTerms = false;
                  loadingContainerTerms.style.display = "none";
                  return;
              }

              if (request.serverData.errorMessage !== "") {
                  isLoadingTerms = false;
                  loadingContainerTerms.style.display = "none";
                  TermsSummaryHtmlText.textContent = `${request.serverData.errorMessage}`;
                  summaryInfo = {
                    ...summaryInfo,
                    terms: "",
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
              isLoadingTerms = false;
              setTermsSummary(request.serverData.termsOfUse);

              // show the terms
              showTermsWindow();

              // show disclaimer message and feedback part if terms and privacy are both loaded
              ShowdisclaimerAndFeedback();
                  
          }

          if (request.message === 'serverResultPrivacy' && request.serverData) {

              loadingContainer.style.display = "none";
              loadingContainerPrivacy.style.display = "flex";

              // set the host
              if (request.serverData.host) {
                defaultHostname.textContent  = request.serverData.host;
              }

              // verify the authentication of user
              const isAuth = verifyIfAuthenticated(request.serverData.isAuthenticate, request.serverData.userInfo);
              if (!isAuth) {
                  isLoadingPrivacy = false;
                  loadingContainerPrivacy.style.display = "none";
                  return;
              };

              if (request.serverData.errorMessage !== "") {
                  isLoadingPrivacy = false;
                  loadingContainerPrivacy.style.display = "none";
                  PrivacySummaryHtmlText.textContent = `😞 ${request.serverData.errorMessage}`;
                  summaryInfo = {
                      ...summaryInfo,
                      privacy: "",
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
              isLoadingPrivacy = false;
              setPrivacySummary(request.serverData.termsOfPrivacy);
                    
              // show privacy when loaded
              showPrivacyWindow();

              // show disclaimer message and feedback part if terms and privacy are both loaded
              ShowdisclaimerAndFeedback();
                      
          }

      });

});