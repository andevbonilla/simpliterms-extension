(() => {

      let firstOpened = true;
      let tokenValidator = "";
      let userAccessDate = new Date();
    //   const backendURL = "https://simpliterms-backend-production.up.railway.app";
      const backendURL = "http://localhost:4200";
    //   const simplitermsUrl = "www.simpliterms.com";
      const simplitermsUrl = "http://localhost:3000";

      // utils functions
      const searchAndSetToken = () => {

          const actualHost = location.hostname;
          const ifIsInSimpliterms = (actualHost.toString().trim() === simplitermsUrl);

          tokenValidator = "";
          userAccessDate = new Date();

          const listOfCookies = document.cookie.split(';');
    
          if (listOfCookies) {
            for (const cookie of listOfCookies) {
              if (cookie && cookie.split("=")[0].trim() === 'x-token') {
                tokenValidator = cookie.replace('x-token=', '').replaceAll(' ', '').toString();
              }
              if (cookie && cookie.split("=")[0].trim() === 'plan-type') {
                userAccessDate = cookie.replace('access-date=', '').replaceAll(' ', '').toString();
              }
            }
          };

    
          if (tokenValidator !== '' && ifIsInSimpliterms) {

              chrome.storage.sync.set({
                'xtoken': tokenValidator
              });
    
          };

          if (userAccessDate !== '' && ifIsInSimpliterms) {

              chrome.storage.sync.set({
                'accessType': userAccessDate
              });
    
          };

          if (tokenValidator === '' && ifIsInSimpliterms) {
            
              chrome.storage.sync.set({
                'xtoken': ""
              });

          }

          if (userAccessDate === '' && ifIsInSimpliterms) {
            
              chrome.storage.sync.set({
                'accessType': ""
              });

          }

      };

      const contentScript = async() => {

          // leer cookies y ver si exite la cookie x-token, para poder hacer validationes posteriormente

          let termsOfPrivacy = [];
          let termsOfUse = [];
          let isAuthenticate = false;
          let errorMessage = "";
          let userInfo = {};
          let staticUsername = "";
          let staticDate = "";

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

          // Respond the message as a serverResult
          const respondMESSAGE = (ifPrivacy, ifTerms, nothing, message = 'serverResult') => {

             if (nothing ===  true) {
                  chrome.runtime.sendMessage({
                    message,
                    serverData: {
                      termsOfPrivacy: [], 
                      termsOfUse: [], 
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
                  return;
              }
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

          }


          // REQUESTS TO THE SERVER
          // prepare the info and make the http request to obtain the terms summary
          const requestSummaryInfo = async(posibleWords, politicsType) => {

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
                      const termsData = await requestSummaryInfo( termsPosibilities, "terms");
                      setDataOrShowError(termsData, "terms");

                      if (termsResponseCorrect && privacyResponseCorrect) {
                        firstOpened = false;
                      }

                      respondMESSAGE(false, true, false, 'serverResultTerms');    
                      
                    
                  } else {
                      respondMESSAGE(false, true, false, 'serverResultTerms');
                  }
                
              } catch (error) {
                  console.log(error, "error in respond message function");
                  errorMessage = error.toString();
                  respondMESSAGE(false, false, true, 'serverResultTerms');
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

                        respondMESSAGE(true, false, false, 'serverResultPrivacy');   
                    
                  } else {
                        respondMESSAGE(true, false, false, 'serverResultPrivacy');
                  }
                
              } catch (error) {
                  console.log(error, "error in respond message function");
                  errorMessage = error.toString();
                  respondMESSAGE(false, false, true, 'serverResultPrivacy');
              }

          }

          // messages on runtime
          //=================================================================================
          chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {

              if (request.message === 'popupLoaded') {

                  searchAndSetToken();

                  chrome.storage.sync.get('xtoken', async({xtoken}) => {

                      chrome.storage.sync.get('accessType', async({accessType}) => {

                          tokenValidator = xtoken;

                          if(accessType === "month" || accessType === "year"){

                              const promise1 = respondMessageForTerms();
                              const promise2 = respondMessageForPrivacy();

                              await Promise.all([promise1, promise2]);

                          }else{

                              errorMessage = "To generate a summary of the policies of this page you must have an active plan, in the following link you will be able to acquire a plan: www.simpliterms.com/#pricing";
                              respondMESSAGE(false, false, true, 'serverResult');

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

