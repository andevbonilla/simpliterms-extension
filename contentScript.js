(() => {

      const contentScript = () => {
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
          ];


          if (listOfCookies) {
            for (const cookie of listOfCookies) {
              if (cookie && cookie.split("=")[0].trim() === 'x-token') {
                tokenValidator = cookie.replace('x-token=', '').replaceAll(' ', '')
              }
            }
          }


          const requestSummaryInfo = async(tokenValidator) => {

            // analyse if there are links realted to terms of use or privacy policies
            const privacyURLs = [];
            const termsUseURLs = [];

            let privacyBody = "";
            let termsBody = "";

            let PrivacyHtmlWebpage = "";
            let TermsHtmlWebpage = "";

            for (const tag of linksTag) {
                //extract privacy policies links from any page  
                for (const option of privacyPosibilities) {
                  if (tag.innerHTML.replaceAll(' ','').toLowerCase().includes(option.trim().toLowerCase())) {
                    if (!privacyURLs.includes(tag.getAttribute("href"))) {
                      privacyURLs.push(tag.getAttribute("href"));
                    }
                    ifPrivacy = true;
                  }
                }
                //extract terms of use policies links from any page 
                for (const option of termsPosibilities) {
                  if (tag.innerHTML.replaceAll(' ','').toLowerCase().includes(option.trim().toLowerCase())) {
                    if (!termsUseURLs.includes(tag.getAttribute("href"))) {
                      termsUseURLs.push(tag.getAttribute("href"));
                    }
                    ifTerms = true;
                  }
                }
            }

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

            //convert the html of PRIVACY WEBPAGE to string to will be sent towards the backend
            if (privacyURLs.length > 0) {
              const responseOfprivacy = await fetch(privacyURLs[0])
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
              console.log("PRIVACY", privacyBody)  
              
            }

            //convert the html of TERMS OF USE WEBPAGE to string to will be sent towards the backend
            if (termsUseURLs.length > 0) {
              const responseOfterms = await fetch(termsUseURLs[0])
              TermsHtmlWebpage = await responseOfterms.text()
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
              console.log("TERMS", termsBody)
            
            }


            return new Promise((resolve, reject) => {
                
                fetch(`http://localhost:4200/api/summary/`, {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            'x-token': tokenValidator,
                                                            'host-petition': window.location.host
                                                        },
                                                        body: JSON.stringify({
                                                                              privacyBody: privacyBody.toString(), 
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

          const assignValues = (auth) => {

              if (auth === false) {
                chrome.storage.sync.set({
                'summary': {
                              termsOfPrivacy: [], 
                              termsOfUse: [], 
                              ifPrivacy: false, 
                              ifTerms: false, 
                              host: window.location.host,
                              isAuthenticate,
                              userInfo: {},
                              errorMessage
                          }
                });
                return;
              }

              chrome.storage.sync.set({
                'summary': {
                              termsOfPrivacy, 
                              termsOfUse, 
                              ifPrivacy, 
                              ifTerms, 
                              host: window.location.host,
                              isAuthenticate,
                              userInfo,
                              errorMessage
                          }
              });

          }

          const setDataOrShowError = (data) => {

              console.log("spisodioi", data)

              if (!data) {
                assignValues(isAuthenticate);
                return;
              }

              if (data.msj && (data.msj === "Auth failed")) {
                isAuthenticate = false;
                userInfo = {}
                assignValues(isAuthenticate);
                return;
              }

              if (data.userDB.username !== null && 
                  data.userDB.planType !== null && 
                  data.userDB.username !== undefined && 
                  data.userDB.planType !== undefined) 
              {
                console.log("sssssssssssssssssssh")
                userInfo = {
                  username: data.userDB.username,
                  planType: data.userDB.planType
                }
              }

              if (data.res === false) {
                errorMessage = data.message;
                isAuthenticate = true;
                assignValues(isAuthenticate);
                return;
              }

              if (data.summaryDB) {
                termsOfPrivacy = data.summaryDB.privacyTerms;
                termsOfUse = data.summaryDB.conditionsTerms;
                errorMessage = "";
                isAuthenticate = true;
                assignValues(isAuthenticate);
                return;
              }

          }
          
          if (tokenValidator !== '') {

            

            chrome.storage.sync.set({
              'xtoken': tokenValidator
            });
            requestSummaryInfo(tokenValidator).then(data=>{
                                                  setDataOrShowError(data);
                                              })
                                              .catch(err=> {
                                                console.log(err, "uyuyuyuyuyuyyuyuyuyuy");
                                                assignValues(isAuthenticate);
                                              })
            
          }else{

            chrome.storage.sync.get('xtoken', ({xtoken}) => {
              tokenValidator = xtoken;
              requestSummaryInfo(tokenValidator).then(data=>{  
                                                    setDataOrShowError(data);
                                                })
                                                .catch(err=> {
                                                  console.log(err, "popdofpsdofpo");
                                                  assignValues(isAuthenticate);
                                                })
            });

          }

      }

      setTimeout(() => {
        contentScript();
      }, 200);
      
      chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.url) {
          contentScript();
        }
      });

})();

