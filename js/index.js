// index.js

const startButton = document.querySelector('.product_btn');
const timerContainer = document.querySelector('.timer');
const message = document.getElementById('message');

window.addEventListener('load', () => {
  const token = localStorage.getItem('token');
  if (token) {
    console.log('Token:', token);
  } else {
    console.log('Token not found');
  }
});

startButton.addEventListener('click', async () => {
  const wish = document.querySelector('input[name="wish"]').value;
  const delayTime = parseInt(
    document.querySelector('input[name="delayTime"]').value,
  );

  try {
    const token = localStorage.getItem('token');

    const response = await fetch(
      'https://dg-backend-9135cdee7c9e.herokuapp.com/start-timer/start-timer',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ duration: delayTime }),
      },
    );

    if (response.ok) {
      displayTimer(delayTime);
      message.textContent = 'Timer started successfully.';
      localStorage.setItem('token', token);
    } else {
      message.textContent = 'Failed to start timer.';
    }
  } catch (error) {
    console.error('Error:', error);
    message.textContent = 'An error occurred. Please try again.';
  }
});

function displayTimer(duration) {
  const startTime = Date.now();
  const endTime = startTime + duration * 1000;

  function updateTimer() {
    const currentTime = Date.now();
    const remainingTime = endTime - currentTime;

    if (remainingTime <= 0) {
      timerContainer.textContent = 'Timer expired!';
      return;
    }

    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
    const minutes = Math.floor(
      (remainingTime % (1000 * 60 * 60)) / (1000 * 60),
    );
    const hours = Math.floor(remainingTime / (1000 * 60 * 60));

    timerContainer.textContent = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    requestAnimationFrame(updateTimer);
  }

  updateTimer();
}
