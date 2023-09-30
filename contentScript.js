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
            'Datenschutz',        // Alemán
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
              'condiciones',         // Español
              'conditions',          // Inglés
              'conditions',          // Francés (mismo en inglés)
              'bedingungen',         // Alemán
              'condizioni',          // Italiano
              'condições',           // Portugués
              'voorwaarden',         // Neerlandés
              'villkor',             // Sueco
              'betingelser',         // Danés
              'betingelser',         // Noruego (mismo en danés)
              'ehdot',               // Finés
              'условия',             // Ruso
              '条款',                // Chino Simplificado
              '條款',                // Chino Tradicional
          ];


          if (listOfCookies) {
            for (const cookie of listOfCookies) {
              if (cookie && cookie.split("=")[0].trim() === 'x-token') {
                tokenValidator = cookie.replace('x-token=', '').replaceAll(' ', '')
              }
            }
          }


          const requestSummaryInfo = (tokenValidator) => {
            return new Promise((resolve, reject) => {
                
                fetch(`http://localhost:4200/api/summary/`, {
                                                        method: 'GET',
                                                        headers: {
                                                            'x-token': tokenValidator,
                                                            'host-petition': window.location.host
                                                        },
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

              for (const tag of linksTag) {  
                    for (const option of privacyPosibilities) {
                      if (tag.innerHTML.replaceAll(' ','').trim().toLocaleLowerCase().includes(option)) {
                        ifPrivacy = true;
                      }
                    }
                    for (const option of termsPosibilities) {
                      if (tag.innerHTML.replaceAll(' ','').trim().toLocaleLowerCase().includes(option)) {
                        ifTerms = true;
                      }
                    }
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

              if (!data) {
                assignValues(isAuthenticate);
                return;
              }

              if (data.msj && (data.msj === "Auth failed")) {
                isAuthenticate = false;
                assignValues(isAuthenticate);
                return;
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
                userInfo = {
                  username: data.userDB.username,
                  planType: data.userDB.planType
                }
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

      contentScript();

      chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.url) {
          contentScript();
        }
      });

})();

