(() => {

  setTimeout(() => {

      // leer cookies y ver si exite la cookie x-token, para poder hacer validationes posteriormente
      const listOfCookies = document.cookie.split(';');
      let tokenValidator = '';
      let termsOfPrivacy = [];
      let termsOfUse = [];
      let policyToAccept = []

      let ifPrivacy =  false;
      let ifTerms =  false;
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
        console.log("entrannndoooo")
        return new Promise((resolve, reject) => {

            let webpageName = ''
            if (window.location.host.split('.') > 1) {
               webpageName = window.location.host.split('.')[window.location.host.split('.').length-2].trim();
            }
            
            fetch(`http://localhost:4200/api/summary/google`, {
                                                    method: 'GET',
                                                    headers: {
                                                        'x-token': tokenValidator,
                                                    },
                                                })
            .then(response => {
                if (response) {
                return response.json();
                } else {
                console.error("error")
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

      const assignValues = () => {
          for (const tag of linksTag) {  
    
                for (const option of privacyPosibilities) {
      
                  if (tag.innerHTML.replaceAll(' ','').trim().toLocaleLowerCase().includes(option)) {
                    if (!policyToAccept.includes(tag.innerHTML)) {
                      policyToAccept.push(tag.innerHTML)
                    }
                    ifPrivacy = true;
                  }
                }
                for (const option of termsPosibilities) {
                  if (tag.innerHTML.replaceAll(' ','').trim().toLocaleLowerCase().includes(option)) {
                    if (!policyToAccept.includes(tag.innerHTML)) {
                      policyToAccept.push(tag.innerHTML)
                    }
                    ifTerms = true;
                  }
                }
          }
          console.log({
                          termsOfPrivacy, 
                          termsOfUse, 
                          ifPrivacy, 
                          ifTerms, 
                          host: window.location.host, 
                          policyToAccept
                      }, "perrooooo")
          chrome.storage.sync.set({
            'summary': {
                          termsOfPrivacy, 
                          termsOfUse, 
                          ifPrivacy, 
                          ifTerms, 
                          host: window.location.host, 
                          policyToAccept
                      }
          });
      }
      
      if (tokenValidator !== '') {

        chrome.storage.sync.set({
          'xtoken': tokenValidator
        });
        requestSummaryInfo(tokenValidator).then(data=>{termsOfPrivacy = data.summaryDB.privacyTerms
                                                       termsOfUse = data.summaryDB.conditionsTerms
                                                       assignValues() })
                                          .catch(err=> console.log(err, 'errrrrrrrrrr'))
        
      }else{

        chrome.storage.sync.get('xtoken', ({xtoken}) => {
          tokenValidator = xtoken;
          requestSummaryInfo(tokenValidator).then(data=>{termsOfPrivacy = data.summaryDB.privacyTerms
                                                         termsOfUse = data.summaryDB.conditionsTerms
                                                         assignValues() })
                                            .catch(err=> console.log(err, 'errrrrrrrrrr'))
        });

      }
            
  }, 400);
   
})();

