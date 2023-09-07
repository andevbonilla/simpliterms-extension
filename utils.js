export const requestSummaryInfo = (tokenValidator) => {
        console.log("tytytytyt")
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
