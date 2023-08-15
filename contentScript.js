(() => {
  console.log("Sadasdasd")
  const url = 'https://rickandmortyapi.com/api/character';

  // Realizar la solicitud usando la Fetch API
  fetch(url)
    .then(response => {
      if (response) {
        return response.json();
      } else {
        console.error("error")
        return;
      }
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
})();

