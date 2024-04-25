const form = document.getElementById('registerForm');
const message = document.getElementById('message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const username = formData.get('username');
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const response = await fetch(
      'https://dg-backend-9135cdee7c9e.herokuapp.com/auth/register',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      },
    );
    const data = await response.json();
    if (response.ok) {
      message.textContent = 'Registration successful. Please log in.';
      form.reset();
    } else {
      message.textContent = data.message;
    }
  } catch (error) {
    console.error('Error:', error);
    message.textContent = 'An error occurred. Please try again.';
  }
});
