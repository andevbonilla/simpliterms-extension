(() => {

      let firstOpened = true;
      let tokenValidator = "";
      const backendURL = "https://simpliterms-backend-production.up.railway.app";
      // const backendURL = "http:localhost:4200";

      // utils functions
      const searchAndSetToken = () => {

          console.log("se ejecuto");
          tokenValidator = "";

          const listOfCookies = document.cookie.split(';');

          if (listOfCookies) {
            for (const cookie of listOfCookies) {
              if (cookie && cookie.split("=")[0].trim() === 'x-token') {
                 tokenValidator = cookie.replace('x-token=', '').replaceAll(' ', '').toString();
              }
            }
          }

          if (tokenValidator !== '') {

            chrome.storage.sync.set({
              'xtoken': tokenValidator
            });

          }

      }

      const contentScript = async() => {

          // leer cookies y ver si exite la cookie x-token, para poder hacer validationes posteriormente

          let termsOfPrivacy = [];
          let termsOfUse = [];
          let ifPrivacy =  false;
          let ifTerms =  false;
          let isAuthenticate = false;
          let errorMessage = "";
          let userInfo = {};

          let termsResponseCorrect = false;
          let privacyResponseCorrect = false;

          
          const linksTag = document.querySelectorAll('a');

          const privacyPosibilities = [
            'privacidad',         // Español
            'privacy',            // Inglés
            'vie privée',         // Francés
            'datenschutz',        // Alemán
            'privacy',            // Italiano
            'privacidade',        // Portugués
            'privacy',            // Neerlandés
            'integritet',         // Sueco
            'privatliv',          // Danés
            'personvern',         // Noruego
            'yksityisyys',        // Finés
            'конфиденциальность', // Ruso
            '隐私',               // Chino Simplificado
            '隱私',
            "política de tratamiento de datos personales", // Español
            "política de tratamento de dados pessoais", // Portugués (Brasil)
            "politique de traitement des données personnelles", // Francés
            "politik zur verarbeitung personenbezogener daten", // Alemán
            "政策個人資料處理", // Chino (Simplificado)
            "политика обработки персональных данных", // Ruso
            "πολιτική επεξεργασίας προσωπικών δεδομένων", // Griego
            "سياسة معالجة البيانات الشخصية", // Árabe
            "პერსონალურ მონაცემთა დამუშავების პოლიტიკა", // Georgiano
            "política de manipulare a datelor personale", // Rumano
            "politika o rukovanju ličnim podacima", // Serbio
            "politiikka henkilötietojen käsittelystä", // Finés
            "מדיניות לטיפול בנתונים אישיים", // Hebreo
            "personu datu apstrādes politika", // Letón
            "politika o obradi osobnih podataka", // Croata
            "politika o spracovaní osobných údajov", // Eslovaco
            "politica di trattamento dei dati personali", // Italiano
            "polityka przetwarzania danych osobowych", // Polaco
            "política de processamento de dados pessoais", // Portugués (Portugal)
            "politika o procesiranju osobnih podataka", // Bosnio
            "політика обробки персональних даних", // Ucraniano
            "политика за обработка на лични данни", // Búlgaro
            "पर्सनल डेटा प्रसंस्करण नीति", // Hindi
            "trattamento dati personali politica", // Italiano
            "politika apie asmens duomenų tvarkymą", // Lituano
            "politica de prelucrare a datelor cu caracter personal", // Rumano
            "política de processament de dades personals", // Catalán
            "politika obdelave osebnih podatkov", // Esloveno
            "politika o obdelavi osebnih podatkov", // Esloveno
            "politika za obdelavo osebnih podatkov", // Esloveno
          ];
          const termsPosibilities = [
              'términos',            // Español
              'terms',               // Inglés
              'termes',              // Francés
              'bedingungen',         // Alemán
              'termini',             // Italiano
              'termos',              // Portugués
              'voorwaarden',         // Neerlandés
              'villkor',             // Sueco
              'vilkår',              // Danés
              'betingelser',         // Noruego
              'ehdot',               // Finés
              'условия',             // Ruso
              '条款',                // Chino Simplificado
              '條款',                // Chino Tradicional
              "acuerdo legal",       // Español
              "accord légal",        // Francés
              "juristische Vereinbarung", // Alemán
              "法律協議",                  // Chino (Simplificado)
              "юридическое соглашение",   // Ruso
              "νομική συμφωνία",          // Griego
              "اتفاق قانوني",            // Árabe
              "სამართალი ხელშეკრულება", // Georgiano
              "acord legal",             // Rumano
              "pravni sporazum",          // Serbio
              "oikeudellinen sopimus",   // Finés
              "הסכם משפטי",             // Hebreo
              "juridiskais līgums",      // Letón
              "pravna suglasnost",       // Croata
              "právna dohoda",           // Eslovaco
              "accordo legale",          // Italiano
              "umowa prawna",            // Polaco
              "acordo legal",            // Portugués
              "condiciones",             // Español
              "condições",               // Portugués
              "conditions",              // Inglés
              "条件",                    // Chino (Simplificado)
              "συνθήκες",               // Griego
              "شروط",                   // Árabe
              "პირობები",               // Georgiano
              "condiții",               // Rumano
              "uslovi",                 // Serbio
              "תנאים",                  // Hebreo
              "nosacījumi",             // Letón
              "uvjeti",                 // Croata
              "podmienky",              // Eslovaco
              "condizioni",             // Italiano
              "warunki",                // Polaco
              "légal",                  // French
              "legal",                  // English
              "legale",                 // Italian
              "légale",                 // french other option
              "安全",                   // Chino (mandarín)
              "políticas de uso",      // Español
              "سياسات الاستخدام",      // Árabe
              "使用政策",               // Chino (Simplificado)
              "使用政策",               // Chino (Tradicional)
              "politiques d'utilisation", // Francés
              "Nutzungsbedingungen",      // Alemán
              "उपयोग की नीतियाँ",           // Hindi
              "politiche di utilizzo",    // Italiano
              "사용 정책",                 // Coreano
              "Seguridad", // spanish
              "Security", // Inglés
              "セキュリティ", // Japonés
              "安全", // Chino (Simplificado)
              "安全", // Chino (Tradicional)
              "Segurança", // Portugués
              "Sécurité", // Francés
              "Sicherheit", // Alemán
              "सुरक्षा", // Hindi
              "보안", // Coreano
              "أمان", // Árabe
              "Sicurezza", // Italiano
              "GTs&Cs"
          ];


          // REQUESTS TO THE SERVER
          // prepare the info and make the http request to obtain the terms summary
          const requestSummaryInfo = async( posibleWords, politicsType) => {

                const politicsURLs = [`${window.location.href}`];
                const regexUrlComplete = /^(http:|https:)/i;

                for (const tag of linksTag) {
                    //extract terms of use policies links from any page 
                    for (const option of posibleWords) {
                      if (tag.textContent.toString().replaceAll(' ','').toLowerCase().includes(option.replaceAll(' ','').toLowerCase())) {
                        
                        if (!politicsURLs.includes(tag.getAttribute("href")) && !politicsURLs.includes(`${window.location.protocol}//${window.location.host}${tag.getAttribute("href")}`)) {
                           
                          if (regexUrlComplete.test(tag.getAttribute("href").toString().trim())) {

                              politicsURLs.push(tag.getAttribute("href"));

                          } else {
                              politicsURLs.push(`${window.location.protocol}//${window.location.host}${tag.getAttribute("href")}`);                           
                          }

                        }

                        if (politicsType === "terms") {
                          ifTerms = true;
                        } else {
                          ifPrivacy = true
                        }

                      }
                    }
                }

                return new Promise((resolve, reject) => {

                    fetch(`${backendURL}/api/summary/${(politicsType==="terms")?"terms":"privacy"}`, {
                                                            method: 'POST',
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                                'Authorization': `Bearer ${tokenValidator}`,
                                                                'host-petition': window.location.host
                                                            },
                                                            body: JSON.stringify({ urlList: politicsURLs })
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
          // prepare the info and make the http request to obtain the terms summary
          const requestStaticSummaryInfo = async() => {
                return new Promise((resolve, reject) => {
                    fetch(`${backendURL}/api/summary/static`, {
                                                            method: 'GET',
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                                'Authorization': `Bearer ${tokenValidator}`,
                                                                'host-petition': window.location.host
                                                            }
                                                        })
                    .then(response => {
                        if (response) {
                          return response.json();
                        } else {
                          console.error("error making the json static")
                          return;
                        }
                    })
                    .then(data => {
                        resolve(data)
                    })
                    .catch(error => {
                        reject(error)
                    });
                    
                });

          }


          // SETTING THE DATA
          // set the data for static summaries or the errors
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
                    planType: data.userDB.planType
                  }
                  isAuthenticate = true;
              }else{
                  isAuthenticate = false;
                  thereWasResponse = true;
                  return false;
              }

              if (data.res === false) {
                  errorMessage = data.message;
                  isAuthenticate = true;
                  thereWasResponse = true;
                  return false;
              }
              
              if (type === "static" && data.summaryDB) {
                    termsOfPrivacy = data.summaryDB.privacyTerms;
                    termsOfUse = data.summaryDB.conditionsTerms;
                    errorMessage = "";
                    isAuthenticate = true;
                    thereWasResponse = true;
                    return true;
              }

              if (type === "terms" && data.termSummary) {
                    termsOfUse = data.termSummary;
                    termsResponseCorrect = true;
                    errorMessage = "";
                    isAuthenticate = true;
                    thereWasResponse = true;
                    return true;
              }
              
              if (type === "privacy" && data.privacySummary) {
                    termsOfPrivacy = data.privacySummary;
                    privacyResponseCorrect = true;
                    errorMessage = "";
                    isAuthenticate = true;
                    thereWasResponse = true;
                    return true;
              }

          }

          // RESPONSES
          // repond message with static summary
          const respondMessageStatic = async() => {
            
              try {

                  if (firstOpened) {

                      const staticData = await requestStaticSummaryInfo();
                      const resInStatic = setDataOrShowError(staticData, "static");

                      if (resInStatic) {
                        firstOpened = false;
                      }

                      chrome.runtime.sendMessage({
                                  message: 'staticResult',
                                  serverData: {
                                    termsOfPrivacy, 
                                    termsOfUse, 
                                    ifPrivacy, 
                                    ifTerms, 
                                    host: window.location.host,
                                    isAuthenticate,
                                    userInfo,
                                    errorMessage,
                                    tokenValidator
                                  }
                      });
                      

                  }else {
                      // only send info saved to don't repeat request in the same page
                      chrome.runtime.sendMessage({
                                    message: 'staticResult',
                                    serverData: {
                                      termsOfPrivacy, 
                                      termsOfUse, 
                                      ifPrivacy, 
                                      ifTerms, 
                                      host: window.location.host,
                                      isAuthenticate,
                                      userInfo,
                                      errorMessage,
                                      tokenValidator
                                    }
                      });
                  }
                
              } catch (error) {
                  console.log(error, "error in respond message function");
                  chrome.runtime.sendMessage({
                    message: 'staticResult',
                    serverData: {
                      termsOfPrivacy: [], 
                      termsOfUse: [], 
                      ifPrivacy: false, 
                      ifTerm: false, 
                      host: window.location.host,
                      isAuthenticate,
                      userInfo,
                      errorMessage: error.toString(),
                      tokenValidator
                    }
                  });
              }

          }
          // repond message with AI terms summary
          const respondMessageForTerms = async() => {
            
              try {

                  if (firstOpened) {

                      // request terms 
                      const termsData = await requestSummaryInfo( termsPosibilities, "terms");
                      setDataOrShowError(termsData, "terms");

                      if (termsResponseCorrect && privacyResponseCorrect) {
                        firstOpened = false;
                      }

                      
                        chrome.runtime.sendMessage({
                                  message: 'termsAIResult',
                                  serverData: {
                                    termsOfPrivacy, 
                                    termsOfUse, 
                                    ifPrivacy, 
                                    ifTerms, 
                                    host: window.location.host,
                                    isAuthenticate,
                                    userInfo,
                                    errorMessage,
                                    tokenValidator
                                  }
                        });      
                      
                    
                  } else {
                      chrome.runtime.sendMessage({
                                    message: 'termsAIResult',
                                    serverData: {
                                      termsOfPrivacy, 
                                      termsOfUse, 
                                      ifPrivacy, 
                                      ifTerms, 
                                      host: window.location.host,
                                      isAuthenticate,
                                      userInfo,
                                      errorMessage,
                                      tokenValidator
                                    }
                      });
                  }
                
              } catch (error) {
                  console.log(error, "error in respond message function");
                  chrome.runtime.sendMessage({
                    message: 'serverResult',
                    serverData: {
                      termsOfPrivacy: [], 
                      termsOfUse: [], 
                      ifPrivacy: false, 
                      ifTerm: false, 
                      host: window.location.host,
                      isAuthenticate,
                      userInfo,
                      errorMessage: error.toString(),
                      tokenValidator
                    }
                  });
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

                          chrome.runtime.sendMessage({
                                    message: 'privacyAIResult',
                                    serverData: {
                                      termsOfPrivacy, 
                                      termsOfUse, 
                                      ifPrivacy, 
                                      ifTerms, 
                                      host: window.location.host,
                                      isAuthenticate,
                                      userInfo,
                                      errorMessage,
                                      tokenValidator
                                    }
                          });      
                    
                  } else {
                      chrome.runtime.sendMessage({
                                message: 'privacyAIResult',
                                serverData: {
                                  termsOfPrivacy, 
                                  termsOfUse, 
                                  ifPrivacy, 
                                  ifTerms, 
                                  host: window.location.host,
                                  isAuthenticate,
                                  userInfo,
                                  errorMessage,
                                  tokenValidator
                                }
                      });
                  }
                
              } catch (error) {
                  console.log(error, "error in respond message function");
                  chrome.runtime.sendMessage({
                    message: 'privacyAIResult',
                    serverData: {
                      termsOfPrivacy: [], 
                      termsOfUse: [], 
                      ifPrivacy: false, 
                      ifTerm: false, 
                      host: window.location.host,
                      isAuthenticate,
                      userInfo,
                      errorMessage: error.toString(),
                      tokenValidator
                    }
                  });
              }

          }

          // messages on runtime
          //=================================================================================
          chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {

              if (request.message === 'popupLoaded') {

                  searchAndSetToken();

                  if (tokenValidator !== '') {

                      await respondMessageStatic();
                      
                  }else{

                    chrome.storage.sync.get('xtoken', async({xtoken}) => {
                        tokenValidator = xtoken;
                        await respondMessageStatic();
                    });

                  }

              }

              if (request.message === 'termsAISumary') {

                  searchAndSetToken();

                  if (tokenValidator !== '') {

                      chrome.storage.sync.set({
                        'xtoken': tokenValidator
                      });

                      await respondMessageForTerms();
                      

                  }else{

                    chrome.storage.sync.get('xtoken', async({xtoken}) => {
                        tokenValidator = xtoken;
                        await respondMessageForTerms();
                    });

                  }

              }

              if (request.message === 'privacyAISumary') {

                  searchAndSetToken();

                  if (tokenValidator !== '') {

                      chrome.storage.sync.set({
                        'xtoken': tokenValidator
                      });

                      await respondMessageForPrivacy();
                      

                  }else{

                    chrome.storage.sync.get('xtoken', async({xtoken}) => {
                        tokenValidator = xtoken;
                        await respondMessageForPrivacy();
                    });

                  }

              }
              
          });
             
      }

      setTimeout(() => {
        searchAndSetToken();
        contentScript();
      }, 200);
      
})();

