const form = document.getElementById('loginForm');
const message = document.getElementById('message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const response = await fetch(
      'https://dg-backend-9135cdee7c9e.herokuapp.com/auth/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: password }),
      },
    );
    const data = await response.json();
    if (response.ok) {
      // Store the token in local storage or session storage
      localStorage.setItem('token', data.token);
      message.textContent = 'Login successful.';
      window.location.href = 'https://dg-delta.vercel.app/';
      form.reset();
    } else {
      message.textContent = data.message;
    }
  } catch (error) {
    console.error('Error:', error);
    message.textContent = 'An error occurred. Please try again.';
  }
});
