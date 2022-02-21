const searchFilmsByNameForm = document.getElementById('searchByNameForm');
const searchByTypeForm = document.getElementById('searchByTypeForm');

if (searchFilmsByNameForm) {
  searchFilmsByNameForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const { filmInput: { value: filmInput }, method, action } = event.target;

    const response = await fetch(action, {
      method,
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ filmInput }),
    });

    const isResults = await response.json();

    console.log(isResults);

    if (isResults.didFindResults) {
      window.location = '/search/results';
    } else {
      window.location = '/notfound';
    }
  });
}

if (searchByTypeForm) {
  searchByTypeForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const { type: { value: type }, method, action } = event.target;

    console.log(type);

    const response = await fetch(action, {
      method,
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ type }),
    });
    const isResults = await response.json();

    if (isResults) {
      window.location = '/search/results';
    } else {
      window.location = '/notfound';
    }
  });
}
