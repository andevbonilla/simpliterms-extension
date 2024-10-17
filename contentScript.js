(() => {

      let firstOpened = true;
      let tokenValidator = "";
      let userAccessDate = null;
      //   const backendURL = "https://simpliterms-backend-production.up.railway.app";
      const backendURL = "http://localhost:4200";
      //   const simplitermsUrl = "www.simpliterms.com";
      const simplitermsUrl = "http://localhost:3000";

      // utils functions
      const searchAndSetToken = () => {

          const actualHost = location.hostname;
          const ifIsInSimpliterms = (actualHost.toString().trim() === simplitermsUrl);

          tokenValidator = "";
          userAccessDate = null;

          const listOfCookies = document.cookie.split(';');
    
          if (listOfCookies) {
            for (const cookie of listOfCookies) {
              if (cookie && cookie.split("=")[0].trim() === 'x-token') {
                tokenValidator = cookie.replace('x-token=', '').replaceAll(' ', '').toString();
              }
              if (cookie && cookie.split("=")[0].trim() === 'access-date') {
                userAccessDate = cookie.replace('access-date=', '').replaceAll(' ', '').toString();
              }
            }
          };

    
          if (tokenValidator !== '' && ifIsInSimpliterms) {

              chrome.storage.sync.set({
                'xtoken': tokenValidator
              });
    
          };

          if (tokenValidator === '' && ifIsInSimpliterms) {
            
              chrome.storage.sync.set({
                'xtoken': ""
              });

          }

          if (userAccessDate !== null && ifIsInSimpliterms) {

              chrome.storage.sync.set({
                'accessDate': userAccessDate
              });
    
          };

          if (userAccessDate === null && ifIsInSimpliterms) {
            
              chrome.storage.sync.set({
                'accessDate': null
              });

          }

      };

      const contentScript = async() => {

          // Read cookies and see if the x-token cookie exists, so that validations can be made later.
          let termsOfPrivacy = "";
          let termsOfUse = "";
          let isAuthenticate = false;
          let errorMessage = "";
          let userInfo = {};
          let staticUsername = "";
          let staticDate = "";

          let termsResponseCorrect = false;
          let privacyResponseCorrect = false;

          
          const linksTag = document.querySelectorAll('a');

          const privacyPosibilities = [
            // Español (es)
            "politicadeprivacidad", // es
            "politicasdeprivacidad", // es (plural)
            "avisodeprivacidad", // es
            "avisosdeprivacidad", // es (plural)
            "politicadedatos", // es
            "politicasdedatos", // es (plural)
            "protecciondedatos", // es
            "proteccionesdedatos", // es (plural)
            "seguridadyprivacidad", // es
            "seguridadesyprivacidades", // es (plural)
            "politicadeconfidencialidad", // es
            "politicasdeconfidencialidad", // es (plural)
            "informaciondeprivacidad", // es
            "informacionesdeprivacidad", // es (plural)
            "declaraciondeprivacidad", // es
            "declaracionesdeprivacidad", // es (plural)
            "detallesdeprivacidad", // es
            "notificaciondeprivacidad", // es
            "notificacionesdeprivacidad", // es (plural)

            // Inglés (en)
            "privacypolicy", // en
            "privacypolicies", // en (plural)
            "privacynotice", // en
            "privacynotices", // en (plural)
            "datapolicy", // en
            "datapolicies", // en (plural)
            "dataprotection", // en
            "dataprotections", // en (plural)
            "securityandprivacy", // en
            "confidentialitypolicy", // en
            "confidentialitypolicies", // en (plural)
            "privacyinformation", // en
            "privacyinformations", // en (plural)
            "privacystatement", // en
            "privacystatements", // en (plural)
            "privacydetails", // en
            "privacynotification", // en
            "privacynotifications", // en (plural)

            // Ruso (ru)
            "политикаконфиденциальности", // ru
            "политикиконфиденциальности", // ru (plural)
            "уведомлениеоконфиденциальности", // ru
            "уведомленияоконфиденциальности", // ru (plural)
            "политикаданных", // ru
            "политикиданных", // ru (plural)
            "защитаданных", // ru
            "защитыданных", // ru (plural)
            "безопасностьиконфиденциальность", // ru
            "информацияоконфиденциальности", // ru
            "информацииоконфиденциальности", // ru (plural)
            "заявлениеоконфиденциальности", // ru
            "заявленияоконфиденциальности", // ru (plural)
            "деталиконфиденциальности", // ru
            "уведомлениеоконфиденциальности", // ru
            "уведомленияоконфиденциальности", // ru (plural)

            // Hindi (hi)
            "गोपनीयतानिति", // hi
            "गोपनीयतानीतियाँ", // hi (plural)
            "गोपनीयताअधिसूचना", // hi
            "गोपनीयताअधिसूचनाएँ", // hi (plural)
            "डेटानिति", // hi
            "डेटानीतियाँ", // hi (plural)
            "डेटासुरक्षा", // hi
            "डेटासुरक्षाएँ", // hi (plural)
            "सुरक्षाऔरगोपनीयता", // hi
            "गोपनीयताजानकारी", // hi
            "गोपनीयताजानकारियाँ", // hi (plural)
            "गोपनीयताविवरण", // hi
            "गोपनीयतासूचना", // hi
            "गोपनीयतासूचनाएँ", // hi (plural)

            // Japonés (ja)
            "プライバシーポリシー", // ja
            // El japonés no distingue plural, se mantiene igual
            "プライバシー通知", // ja
            "データポリシー", // ja
            "データ保護", // ja
            "セキュリティとプライバシー", // ja
            "機密性ポリシー", // ja
            "プライバシー情報", // ja
            "プライバシー声明", // ja
            "プライバシー詳細", // ja
            "プライバシー通知", // ja

            // Chino (zh)
            "隐私政策", // zh
            // El chino no distingue plural, se mantiene igual
            "隐私声明", // zh
            "数据政策", // zh
            "数据保护", // zh
            "安全和隐私", // zh
            "保密政策", // zh
            "隐私信息", // zh
            "隐私声明", // zh
            "隐私详情", // zh
            "隐私通知", // zh

            // Portugués (pt)
            "politicadeprivacidade", // pt
            "politicasdeprivacidade", // pt (plural)
            "avisodeprivacidade", // pt
            "avisosdeprivacidade", // pt (plural)
            "politicadedados", // pt
            "politicasdedados", // pt (plural)
            "protecãodedados", // pt
            "protecoesdedados", // pt (plural)
            "segurançaeprivacidade", // pt
            "politicadeconfidencialidade", // pt
            "politicasdeconfidencialidade", // pt (plural)
            "informacaodeprivacidade", // pt
            "informacoesdeprivacidade", // pt (plural)
            "declaracaodeprivacidade", // pt
            "declaracoesdeprivacidade", // pt (plural)
            "detalhesdeprivacidade", // pt
            "notificacaodeprivacidade", // pt
            "notificacoesdeprivacidade", // pt (plural)

            // Francés (fr)
            "politiquedeconfidentialite", // fr
            "politiquesdeconfidentialite", // fr (plural)
            "avisdeconfidentialite", // fr
            "politiquededonnees", // fr
            "politiquesdedonnees", // fr (plural)
            "protectiondesdonnees", // fr
            "securiteetconfidentialite", // fr
            "informationssurlaconfidentialite", // fr
            "declarationdeconfidentialite", // fr
            "declarationsdeconfidentialite", // fr (plural)
            "detailsdeconfidentialite", // fr
            "notificationdeconfidentialite", // fr
            "notificationsdeconfidentialite", // fr (plural)

            // Alemán (de)
            "datenschutzrichtlinie", // de
            "datenschutzrichtlinien", // de (plural)
            "datenschutzhinweis", // de
            "datenschutzhinweise", // de (plural)
            "datenrichtlinie", // de
            "datenrichtlinien", // de (plural)
            "datenschutz", // de
            "sicherheitunddatenschutz", // de
            "vertraulichkeitspolitik", // de
            "vertraulichkeitspolitiken", // de (plural)
            "datenschutzinformationen", // de
            "datenschutzerklaerung", // de
            "datenschutzerklaerungen", // de (plural)
            "datenschutzdetails", // de
            "datenschutzbenachrichtigung", // de
            "datenschutzbenachrichtigungen", // de (plural)
          ];

          const termsPosibilities = [
              // Español (es)
              "terminosdeuso", // es
              "terminoslegales", // es
              "politicasdeuso", // es
              "politicasdelservicio", // es
              "condicionesdeuso", // es
              "condicionesdelservicio", // es
              "terminosycondiciones", // es
              "avisolegal", // es
              "politicasdelservicio", // es
              "condicionesgenerales", // es

              // Inglés (en)
              "termsofuse", // en
              "legalterms", // en
              "usagepolicy", // en
              "servicepolicy", // en
              "termsofservice", // en
              "termsandconditions", // en
              "legalnotice", // en
              "serviceconditions", // en
              "legalterms", // en
              "legalpolicy", // en

              // Ruso (ru)
              "условияиспользования", // ru
              "правовыеусловия", // ru
              "политикаиспользования", // ru
              "политикасервиса", // ru
              "условияобслуживания", // ru
              "правилаиусловия", // ru
              "правоваяинформация", // ru
              "правоваяполитика", // ru
              "условиясервиса", // ru
              "общиеусловия", // ru

              // Hindi (hi)
              "उपयोगकीशर्तें", // hi
              "कानूनीशर्तें", // hi
              "उपयोगनीति", // hi
              "सेवानीति", // hi
              "सेवाकेशर्तें", // hi
              "नियमऔरशर्तें", // hi
              "कानूनीनोटिस", // hi
              "कानूनीनीति", // hi
              "सेवाकीशर्तें", // hi
              "सामान्यशर्तें", // hi

              // Japonés (ja)
              "利用規約", // ja
              "法的条件", // ja
              "使用ポリシー", // ja
              "サービスポリシー", // ja
              "サービス利用規約", // ja
              "規約と条件", // ja
              "法的通知", // ja
              "法的ポリシー", // ja
              "サービス条件", // ja
              "一般条件", // ja

              // Chino (zh)
              "使用条款", // zh
              "法律条款", // zh
              "使用政策", // zh
              "服务政策", // zh
              "服务条款", // zh
              "条款和条件", // zh
              "法律声明", // zh
              "法律政策", // zh
              "服务条件", // zh
              "一般条件", // zh

              // Portugués (pt)
              "termosdeuso", // pt
              "termoslegais", // pt
              "politicasdeuso", // pt
              "politicasdoservico", // pt
              "condicoesdeuso", // pt
              "condicoesdoservico", // pt
              "termoscondicoes", // pt
              "avisolegal", // pt
              "politicasdoservico", // pt
              "condicoesgerais", // pt

              // Francés (fr)
              "conditionsdutilisation", // fr
              "termeslegaux", // fr
              "politiquedutilisation", // fr
              "politiqueduservice", // fr
              "conditionsduservice", // fr
              "termesetconditions", // fr
              "mentionlegale", // fr
              "politiqueleservice", // fr
              "termeslegaux", // fr
              "conditionsgenerales", // fr

              // Alemán (de)
              "nutzungsbedingungen", // de
              "rechtlichebedingungen", // de
              "nutzungspolitik", // de
              "servicepolitik", // de
              "servicebedingungen", // de
              "agb", // de (Allgemeine Geschäftsbedingungen)
              "rechtlicherhinweis", // de
              "rechtlichepolitik", // de
              "dienstleistungsbedingungen", // de
              "allgemeinebedingungen", // de
          ];

          // Respond the message as a serverResult
          const respondMESSAGE = (ifPrivacy, ifTerms, message) => {
             if (message === "serverResultError") {
                  chrome.runtime.sendMessage({
                    message,
                    serverData: {
                      termsOfPrivacy: "", 
                      termsOfUse: "", 
                      ifPrivacy: false, 
                      ifTerm: false, 
                      host: window.location.host,
                      isAuthenticate,
                      userInfo,
                      errorMessage,
                      tokenValidator,
                      staticUsername,
                      staticDate
                    }
                  });
              }else {
                  chrome.runtime.sendMessage({
                          message,
                          serverData: {
                            termsOfPrivacy, 
                            termsOfUse, 
                            ifPrivacy, 
                            ifTerms, 
                            host: window.location.host,
                            isAuthenticate,
                            userInfo,
                            errorMessage,
                            tokenValidator,
                            staticUsername,
                            staticDate
                          }
                  });
              };
          };

          // REQUESTS TO THE SERVER
          // prepare the info and make the http request to obtain the terms summary
          const requestSummaryInfo = async(posibleWords, politicsType) => {

                const politicsURLs = [`${window.location.href}`];
                const regexUrlComplete = /^(http:|https:)/i;

                for (const tag of linksTag) {
                    //extract terms of use policies links from any page 
                    for (const option of posibleWords) {
                      if (tag.textContent.toString().replaceAll(' ','').toLowerCase().includes(option)) {
                        
                        if (!politicsURLs.includes(tag.getAttribute("href")) && !politicsURLs.includes(`${window.location.protocol}//${window.location.host}${tag.getAttribute("href")}`)) {
                           
                          if (regexUrlComplete.test(tag.getAttribute("href").toString().trim())) {

                              politicsURLs.push(tag.getAttribute("href"));

                          } else {
                              politicsURLs.push(`${window.location.protocol}//${window.location.host}${tag.getAttribute("href")}`);                           
                          }

                        }

                      }
                    }
                }

                return new Promise((resolve, reject) => {

                    fetch(`${backendURL}/api/summary/generate`, {
                                                            method: 'POST',
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                                'Authorization': `Bearer ${tokenValidator}`,
                                                                'host-petition': window.location.host
                                                            },
                                                            body: JSON.stringify({ urlList: politicsURLs, politicsType })
                                                        })
                    .then(response => {
                        if (response) {
                          return response.json();
                        } else {
                          console.error("error making the json")
                          return;
                        }
                    })
                    .then(data => {
                        resolve(data)
                    })
                    .catch(error => {
                        reject(error)
                    });
                    
                })
          }
          
          // SETTING THE DATA
          // set the data for summaries or the errors
          const setDataOrShowError = (data, type) => {

              if (!data) {
                  thereWasResponse = true;
                  return false;
              }

              if (data.msj && (data.msj === "Auth failed")) {
                  isAuthenticate = false;
                  userInfo = {}
                  thereWasResponse = true;
                  return false;
              }


              if (data.userDB.username){
                  userInfo = {
                    username: data.userDB.username,
                    accessType: data.userDB.accessType
                  }
                  isAuthenticate = true;
              }else{
                  isAuthenticate = false;
                  userInfo = {};
                  thereWasResponse = true;
                  return false;
              }

              if (data.res === false) {
                  errorMessage = data.message;
                  isAuthenticate = true;
                  thereWasResponse = true;
                  return false;
              }
              
              if (type === "terms" && data.policiesSummary) {
                    termsOfUse = data.policiesSummary;
                    termsResponseCorrect = true;
                    errorMessage = "";
                    isAuthenticate = true;
                    thereWasResponse = true;
              }
              
              if (type === "privacy" && data.policiesSummary) {
                    termsOfPrivacy = data.policiesSummary;
                    privacyResponseCorrect = true;
                    errorMessage = "";
                    isAuthenticate = true;
                    thereWasResponse = true;
              }

          }

          // RESPONSES ---------------------------------------------------------------------------------------
          // -------------------------------------------------------------------------------------------------

          // repond message with AI terms summary
          const respondMessageForTerms = async() => {
            
              try {

                  if (firstOpened) {

                      // request terms 
                      const termsData = await requestSummaryInfo(termsPosibilities, "terms");
                      setDataOrShowError(termsData, "terms");

                      if (termsResponseCorrect && privacyResponseCorrect) {
                        firstOpened = false;
                      }

                      respondMESSAGE(false, true, 'serverResultTerms');    
                      
                    
                  } else {
                      respondMESSAGE(false, true, 'serverResultTerms');
                  }
                
              } catch (error) {
                  console.log(error, "error in respond message function");
                  errorMessage = error.toString();
                  respondMESSAGE(false, false, 'serverResultTerms');
              }

          }
          // repond message with AI privacy summary
          const respondMessageForPrivacy = async() => {
            
              try {

                  if (firstOpened) {

                        const privacyData = await requestSummaryInfo( privacyPosibilities, "privacy");
                        setDataOrShowError(privacyData, "privacy");

                        if (termsResponseCorrect && privacyResponseCorrect) {
                              firstOpened = false;
                        }

                        respondMESSAGE(true, false, 'serverResultPrivacy');   
                    
                  } else {
                        respondMESSAGE(true, false, 'serverResultPrivacy');
                  }
                
              } catch (error) {
                  console.log(error, "error in respond message function");
                  errorMessage = error.toString();
                  respondMESSAGE(false, false, 'serverResultPrivacy');
              }

          }

          // messages on runtime
          //=================================================================================
          chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {

              if (request.message === 'popupLoaded') {

                  searchAndSetToken();

                  chrome.storage.sync.get('xtoken', async({xtoken}) => {

                      chrome.storage.sync.get('accessDate', async({accessDate}) => {

                          tokenValidator = xtoken;

                          const currentDate = new Date();

                          if(new Date(accessDate) > currentDate){

                              const promise1 = respondMessageForTerms();
                              const promise2 = respondMessageForPrivacy();

                              await Promise.all([promise1, promise2]);

                          }else{

                              errorMessage = "You do not have access to purchase a plan, purchase one here at a discount: www.simpliterms.com/#pricing";
                              respondMESSAGE(false, false, 'serverResultError');

                          }

                      });

                  });

              }
              
          });
             
      }

      setTimeout(() => {
        searchAndSetToken();
        contentScript();
      }, 400);
      
})();

