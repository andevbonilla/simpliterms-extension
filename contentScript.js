(() => {

  setTimeout(() => {
      // hacer peticion al backend para poder recibir la lista de summaries estaticos
      const listUrls = [
          {
            name: 'google',
            policyWebpage: 'accounts.google.com',
            privacyTerms: `Información y Privacidad Los términos y condiciones de Google resaltan la recopilación de información para mejorar sus servicios y proporcionar contenido personalizado. Se recopilan datos sobre su actividad en apps, navegadores y dispositivos, incluyendo preferencias, interacciones y ubicación. Google también recopila contenido creado por usted, como correos electrónicos, fotos y comentarios. La información se utiliza para personalizar servicios, contenido y anuncios, así como para desarrollar nuevos productos. Google comparte información con afiliados y socios de confianza para fines comerciales y legales. Se implementan medidas de seguridad para proteger su información y se ofrecen controles para administrar su privacidad, incluyendo la exportación y eliminación de datos. La política de privacidad no se aplica a servicios con políticas independientes y excluye la información compartida por otras empresas. Se destaca la importancia de entender cómo se utiliza su información y cómo gestionar su privacidad en los servicios de Google.`,
            vigencyOfPrivacy: '5 de enero de 2022',
            conditionsTerms: `Estos Términos definen su relación con Google al usar sus servicios. Destacan: Uso de Servicios: Google ofrece diversos servicios bajo estas reglas. Contenido: Usted retiene ciertos derechos sobre su contenido, pero Google tiene licencia limitada para usarlo. Uso Responsable: Respete las leyes, privacidad y derechos de otros al usar los servicios. Problemas: Google busca brindar calidad y resolver problemas razonablemente. Eliminación y Suspensión: Contenido infractor puede ser eliminado, y cuentas suspendidas en casos graves. Garantías y Limitaciones: Google ofrece servicios competentes, pero ciertas pérdidas están excluidas. Resolución de Disputas: Ley de California rige, con tribunales en California, EE.UU. Cambios: Google puede actualizar términos; debe aceptar cambios o dejar de usar servicios. Antes de usar servicios de Google, comprenda y acepte estos términos, ya que indican su acuerdo y responsabilidades.`,
            vigencyofUseTerms: '1 de julio de 2023',
            cookiesTerms: '',
            vigencyOfCookies: ''
        },
        {
            name: 'facebook',
            policyWebpage: 'facebook.com',
            privacyTerms: `Meta values transparency and user understanding. The Privacy Policy explains data collection, usage, and rights with clarity. Some data is essential for product use, while optional info affects user experience. Meta uses data for personalization, security, and research. Information may be shared within Meta and with partners responsibly. No user data selling. Collaboration across Meta products enhances protection and understanding. Users accept these practices.`,
            vigencyOfPrivacy: '15 de junio de 2023',
            conditionsTerms: `Here are the key points to consider when accepting Meta's terms of service: Personalized Experience: Meta tailors your experience based on preferences and activities. Personalized Advertising: You'll see relevant ads using your data, but it's not sold directly. Privacy and Data: Meta uses your data for ads and services, but doesn't sell it. Security and Behavior: Harmful behavior may lead to account suspension. Advanced Technologies: Meta employs AI and AR for secure services. Permissions and Licenses: Your content can be used for ads and sponsored content. Intellectual Property: Respect Meta's IP rights and get permission for use. Proper Use: Commit to responsible use; breaches can result in action. By accepting, you join the Meta user community and agree to these guidelines.`,
            vigencyofUseTerms: '26 de julio de 2022',
            cookiesTerms: `This policy addresses the use of cookies, which are text fragments employed to store information on web browsers and devices. Similar technologies are included under the term "cookies." These apply when you have a Facebook account, use Meta Products (website, apps), or visit sites and apps that utilize Meta Products. Cookies are essential for delivering, enhancing, and safeguarding Meta Products. They enable content personalization, ad customization, performance measurement, and provision of a secure experience. They are categorized into session cookies (deleted upon closing the browser) and persistent cookies (remaining until expiration or deletion). They are employed in various contexts, including products from other members of the Meta community and third-party sites/apps using Meta technologies. Other companies also employ cookies in Meta Products for advertising, analysis, and enhanced functionalities. This impacts personalized ads within and beyond Meta Products. You can control your data and ad preferences using the provided tools.`,
            vigencyOfCookies: '16 de junio de 2023'
        },
        {
            name: 'instagram',
            policyWebpage: 'instagram.com',
            privacyTerms: `Effective from June 15, 2023, Meta's Privacy Policy explains data collection, usage, and sharing. It empowers users with data control through product settings. Information is pseudonymized for privacy. Usage includes personalization, safety, business services, and innovation. Collaboration occurs among Meta companies. Data is shared with partners and service providers, not sold. Tools enable data management, and policy changes are notified. For privacy inquiries, contact Meta. Noteworthy details include: Personalized experiences based on user preferences and interests, Creation and maintenance of accounts and profiles, Providing functions and services, including messaging and content sharing, Enhancing security and integrity across Meta's products, Sharing information worldwide for operational purposes.`,
            vigencyOfPrivacy: '15 de junio de 2023',
            conditionsTerms: `Instagram's Terms of Use govern your use of the platform. By using Instagram, you accept these terms. The platform offers personalized experiences and aims to create a safe and inclusive environment. Your data is used for tailored ads and content. While Instagram doesn't claim ownership of your content, it's granted a license to use it. Global data storage is essential for the platform's operation. Violations of guidelines may result in account disablement. The Privacy Policy outlines data practices. Disputes are resolved based on your country's laws. Feedback is welcome, but Instagram can use it without obligations.`,
            vigencyofUseTerms: '26 de julio de 2022',
            cookiesTerms: `Meta (formerly Facebook) has updated its policies, including Terms of Use and Data Policy, to reflect the new name. Despite the change, data usage remains unaffected. Instagram employs cookies, pixels, and local storage to enhance services, user protection, and ad personalization. These technologies remember preferences, improve browsing, and track device activity. Third-party cookies are used for advertising and analysis. Users can manage privacy settings in their Instagram accounts or through browser settings. Disabling cookies might affect product functionality`,
            vigencyOfCookies: '4 de enero de 2022'
        },
        {
            name: 'twitter',
            policyWebpage: 'twitter.com',
            privacyTerms: `In Twitter's data collection, users provide account details like name, username, email, etc., and payment info for services. Usage data includes activity, interactions, and purchases. Third-party data comes from partners and advertisers. Data is processed for service improvement and safety. Data is shared with service providers, advertisers, and third-party content. Data retention varies based on account activity and legal needs. Suspended accounts may keep identifiers. Users should understand their data's collection, processing, and sharing on Twitter.`,
            vigencyOfPrivacy: '18 de mayo de 2023',
            conditionsTerms: `Eligibility: To use the Services, you must be at least 13 or 16 years old (depending on the platform), capable of forming a binding contract, and not barred from receiving services under applicable laws. Privacy: Using the services implies consent to data collection and transfer outlined in the Privacy Policy. Content Responsibility: Users are accountable for their shared content and its legality. Platform doesn't endorse user-generated content. Service Usage: Adherence to platform rules is required. Services can change, and accounts/content can be suspended or terminated. License and Rights: Users retain content ownership but grant Twitter a license to use it. Termination: Users can end use, but accounts can be suspended/terminated by Twitter. Liability Limits: Twitter is not liable for certain damages, with limitations depending on jurisdiction. General: Terms can change, but changes won't apply retroactively. Users must meet responsibilities and understand potential consequences.`,
            vigencyofUseTerms: '18 de mayo de 2023',
            cookiesTerms: `Twitter employs cookies, pixels, and local storage to enhance user experience, security, and service functionality. These technologies enable session continuity, feature provision, preference retention, content personalization, spam prevention, relevant ad display, subscription services, and more. They're integral for authentication, security, functionality, user preference storage, analytics, custom content, targeted ads, and cross-device consistency. These tools are used across Twitter services, integrated third-party platforms, and advertising collaborations, such as interest-based web ads. Privacy options include adjusting content visibility settings, personalized ad preferences, and browser cookie settings. Understanding and managing these technologies empowers users to tailor their privacy preferences on Twitter.`,
            vigencyOfCookies: ''
        },
      ]

      // leer cookies y ver si exite la cookie x-token, para poder hacer validationes posteriormente
      const listOfCookies = document.cookie.split(';');
      let tokenValidator = '';

      if (listOfCookies) {
        for (const cookie of listOfCookies) {
          if (cookie && cookie.split("=")[0].trim() === 'x-token') {
            tokenValidator = cookie.replace('x-token=', '').replaceAll(' ', '')
          }
        }
      }
      
      if (tokenValidator !== '') {

        chrome.storage.sync.set({
          'xtoken': tokenValidator
        });

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
            console.log(data, "desde el servidorrr");
          })
          .catch(error => {
            console.error('Error:', error);
          });

      }else{

        chrome.storage.sync.get('xtoken', ({xtoken}) => {
          tokenValidator = xtoken;
          console.log(tokenValidator)
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
              console.log(data, "desde el servidorrr");
            })
            .catch(error => {
              console.error('Error:', error);
            });
        });

      }
      
      let termsSummary = '';
      let privacySummary = '';
      let cookiesSummary = '';
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

      
      for (const summaryObj of listUrls) {
        if (window.location.host.includes(summaryObj.policyWebpage)) {

          termsSummary = summaryObj.conditionsTerms;
          privacySummary = summaryObj.privacyTerms;
          cookiesSummary = summaryObj.cookiesTerms;
          
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
          
        }
      }

      chrome.storage.sync.set({
        'summary': {
                      termsSummary, 
                      privacySummary, 
                      cookiesSummary, 
                      ifPrivacy, 
                      ifTerms, 
                      host: window.location.host, 
                      policyToAccept
                  }
      });
      
  }, 400);

  
    
})();

