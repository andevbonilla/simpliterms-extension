(() => {

      let firstOpened = true;

      const contentScript = async() => {
          // leer cookies y ver si exite la cookie x-token, para poder hacer validationes posteriormente
          const listOfCookies = document.cookie.split(';');
          let tokenValidator = '';

          let termsOfPrivacy = [];
          let termsOfUse = [];
          let ifPrivacy =  false;
          let ifTerms =  false;
          let isAuthenticate = false;
          let errorMessage = "";
          let userInfo = {};

          
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
              "políticas de uso"          // Portugués
          ];


          if (listOfCookies) {
            for (const cookie of listOfCookies) {
              if (cookie && cookie.split("=")[0].trim() === 'x-token') {
                tokenValidator = cookie.replace('x-token=', '').replaceAll(' ', '')
              }
            }
          }

          // decides if a tag is important to be readed or not
          const ifIsImportantTag = (tag) => {
                switch (tag.toString()) {
                  case "SPAN":
                    
                    return true;
                  case "H1":
                    
                    return true;
                  case "H2":
                    
                    return true;
                  case "H3":
                    
                    return true;
                  case "H4":
                    
                    return true;
                  case "H5":
                    
                    return true;
                  case "H6":
                    
                    return true;
                  case "P":
                    
                    return true;
                
                  default:
                    return false;
                }
          }

          // prepare the info and make the http request to obtain the privacy summary
          const requestPrivacySummaryInfo = async(tokenValidator) => {

            const privacyURLs = [];
            let privacyBody = "";
            let PrivacyHtmlWebpage = "";

            for (const tag of linksTag) {
                //extract privacy policies links from any page  
                for (const option of privacyPosibilities) {
                  if (tag.textContent.replaceAll(' ','').toLowerCase().includes(option.replaceAll(' ','').toLowerCase())) {
                    if (!privacyURLs.includes(tag.getAttribute("href"))) {
                      privacyURLs.push(tag.getAttribute("href"));
                    }
                    ifPrivacy = true;
                  }
                }
            }

            //convert the html of PRIVACY WEBPAGE to string to will be sent towards the backend
            if (privacyURLs.length > 0) {
              const responseOfprivacy = await fetch(privacyURLs[0], {mode: 'no-cors'})
              PrivacyHtmlWebpage = await responseOfprivacy.text();
              // Crear un elemento HTML temporal para analizar el HTML
              const parser = new DOMParser();
              const doc = parser.parseFromString(PrivacyHtmlWebpage, 'text/html');

              // only select the text of the important elements
              
              const elements = doc.querySelectorAll('*');

              // iterte whole html elements
              for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                if (ifIsImportantTag(element.tagName)) {
                  privacyBody = privacyBody + " " + element.textContent;
                }
              }
              console.log("PRIVACY", privacyBody, privacyURLs[0])  
              
            }

            return new Promise((resolve, reject) => {
                
                fetch(`http://localhost:4200/api/summary/privacy`, {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            'x-token': tokenValidator,
                                                            'host-petition': window.location.host
                                                        },
                                                        body: JSON.stringify({
                                                                               privacyBody: privacyBody.toString()
                                                                             })
                                                    })
                .then(response => {
                    if (response) {
                      return response.json();
                    } else {
                      console.error("PRIVACY77777")
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
          const requestTermsSummaryInfo = async(tokenValidator) => {

            const termsUseURLs = [];
            let termsBody = "";
            let TermsHtmlWebpage = "";

            for (const tag of linksTag) {
                //extract terms of use policies links from any page 
                for (const option of termsPosibilities) {
                  if (tag.textContent.replaceAll(' ','').toLowerCase().includes(option.replaceAll(' ','').toLowerCase())) {
                    if (!termsUseURLs.includes(tag.getAttribute("href"))) {
                      termsUseURLs.push(tag.getAttribute("href"));
                    }
                    ifTerms = true;
                  }
                }
            }

            //convert the html of TERMS OF USE WEBPAGE to string to will be sent towards the backend
            if (termsUseURLs.length > 0) {
                const responseOfterms = await fetch(termsUseURLs[0], {mode: 'no-cors'})
                TermsHtmlWebpage = await responseOfterms.text();
                // Crear un elemento HTML temporal para analizar el HTML
                const parser = new DOMParser();
                const doc = parser.parseFromString(TermsHtmlWebpage, 'text/html');

                // only select the text of the important elements
                const elements = doc.querySelectorAll('*');

                // iterte whole html elements
                for (let i = 0; i < elements.length; i++) {
                  const element = elements[i];
                  if (ifIsImportantTag(element.tagName)) {
                    termsBody = termsBody + " " + element.textContent;
                  }
                }
                console.log("TERMS", termsBody, termsUseURLs[0]);
            }


            return new Promise((resolve, reject) => {
                
                fetch(`http://localhost:4200/api/summary/terms`, {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            'x-token': tokenValidator,
                                                            'host-petition': window.location.host
                                                        },
                                                        body: JSON.stringify({ 
                                                                                termsBody: termsBody.toString()
                                                                             })
                                                    })
                .then(response => {
                    if (response) {
                      return response.json();
                    } else {
                      console.error("777777777777777777777777777777")
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

          // const assignValues = (auth) => {

          //     if (auth === false) {
          //       chrome.storage.sync.set({
          //       'summary': {
          //                     termsOfPrivacy: [], 
          //                     termsOfUse: [], 
          //                     ifPrivacy: false, 
          //                     ifTerms: false, 
          //                     host: window.location.host,
          //                     isAuthenticate,
          //                     userInfo: {},
          //                     errorMessage
          //                 }
          //       });
          //       return;
          //     }

          //     chrome.storage.sync.set({
          //       'summary': {
          //                     termsOfPrivacy, 
          //                     termsOfUse, 
          //                     ifPrivacy, 
          //                     ifTerms, 
          //                     host: window.location.host,
          //                     isAuthenticate,
          //                     userInfo,
          //                     errorMessage
          //                 }
          //     });

          // }

          const setDataOrShowError = (data) => {

              console.log("spisodioi", data)

              if (!data) {
                  console.log("noooo dataaa")
                  thereWasResponse = true;
                  return;
              }

              if (data.msj && (data.msj === "Auth failed")) {
                  isAuthenticate = false;
                  userInfo = {}
                  // assignValues(isAuthenticate);
                  thereWasResponse = true;
                  return;
              }

              if (data.res === false) {
                  errorMessage = data.message;
                  isAuthenticate = true;
                  // assignValues(isAuthenticate);
                  thereWasResponse = true;
                  return;
              }

              if ( data.userDB.username && data.userDB.planType ){
                  userInfo = {
                    username: data.userDB.username,
                    planType: data.userDB.planType
                  }
                  isAuthenticate = true;
              }else{
                  isAuthenticate = false;
                  // assignValues(isAuthenticate);
                  thereWasResponse = true;
                  return;
              }

              if (data.summaryDB) {
                  termsOfPrivacy = data.summaryDB.privacyTerms;
                  termsOfUse = data.summaryDB.conditionsTerms;
                  errorMessage = "";
                  isAuthenticate = true;
                  // assignValues(isAuthenticate);
                  thereWasResponse = true;
                  return;
              }

              if (data.termSummary) {
                  termsOfUse = data.termSummary;
                  errorMessage = "";
                  isAuthenticate = true;
                  // assignValues(isAuthenticate);
                  thereWasResponse = true;
                  return;
              }

              if (data.privacySummary) {
                  termsOfPrivacy = data.privacySummary;
                  errorMessage = "";
                  isAuthenticate = true;
                  // assignValues(isAuthenticate);
                  thereWasResponse = true;
                  return;
              }

          }

          const respondMessage = async() => {
            
              try {

                if (firstOpened === true) {
                    // request privacy
                    const privacyData = await requestPrivacySummaryInfo(tokenValidator);
                    setDataOrShowError(privacyData);
                    // request terms 
                    const termsData = await requestTermsSummaryInfo(tokenValidator);
                    setDataOrShowError(termsData);
                    // if both petition were made 
                    if (privacyData && termsData) {
                          firstOpened = false;
                          chrome.runtime.sendMessage({
                                message: 'serverResult',
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

                }else {
                    console.log("ssssad000000000000")
                    // only send info saved to don't repeat request in the same page
                    chrome.runtime.sendMessage({
                                  message: 'serverResult',
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


          chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
              
              if (request.message === 'popupLoaded') {

                if (tokenValidator !== '') {

                    chrome.storage.sync.set({
                      'xtoken': tokenValidator
                    });

                    await respondMessage();
                    

                }else{

                  chrome.storage.sync.get('xtoken', async({xtoken}) => {
                      tokenValidator = xtoken;
                      await respondMessage();
                  });

                }

              }

          });
             
      }

      
      setTimeout(() => {
        contentScript();
      }, 200);
      
      // chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      //   if (request.url && !request.message) {
      //     chrome.runtime.restart()
      //   }
      // });

})();

