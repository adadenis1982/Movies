const form = document.querySelector('#formLogin');
const feedback = document.querySelector('#feedback');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const {
    email: { value: email },
    password: { value: password },
  } = event.target;

  const response = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  console.log(data);

  if (data.login) {
    window.location = '/';
  } else {
    feedback.textContent = data.message;
    feedback.style.display = 'block';
  }
});
