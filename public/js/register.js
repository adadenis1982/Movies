const form = document.querySelector('#formRegistration');
const exampleInputPassword1 = document.querySelector('#exampleInputPassword1');
const exampleInputConfirmPassword = document.querySelector('#exampleInputConfirmPassword');
const feedback = document.querySelector('#feedback');

function correctPassword() {
  if (exampleInputPassword1.value !== exampleInputConfirmPassword.value) {
    feedback.textContent = 'Пароли не совпадают';
    feedback.style.display = 'block';
    return false;
  }

  feedback.style.display = 'none';
  return true;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (correctPassword()) {
    const {
      username: { value: username },
      email: { value: email },
      password: { value: password },
    } = event.target;

    const response = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (data.registration) {
      window.location = '/main';
    } else {
      feedback.textContent = data.message;
      feedback.style.display = 'block';
    }
  }
});
