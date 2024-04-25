const startButton = document.getElementById('product_btn');
const timerContainer = document.querySelector('.timer');
const message = document.getElementById('message');

startButton.addEventListener('click', async () => {
  const wish = document.getElementById('wish').value;
  const delayTime = parseInt(document.getElementById('delayInput').value);

  try {
    // Get the token from localStorage
    const token = localStorage.getItem('token');

    // Send request to start the timer
    const response = await fetch(
      'https://dg-backend-9135cdee7c9e.herokuapp.com/start-timer/start-timer',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
        body: JSON.stringify({ wish, duration: delayTime, token: token }),
      },
    );

    if (response.ok) {
      // Timer started successfully, display countdown
      displayTimer(delayTime);
      message.textContent = 'Timer started successfully.';
    } else {
      message.textContent = 'Failed to start timer.';
    }
  } catch (error) {
    console.error('Error:', error);
    message.textContent = 'An error occurred. Please try again.';
  }
});

function displayTimer(startTime, duration) {
  const endTime = startTime + duration; // Duration is already in milliseconds

  function updateTimer() {
    const currentTime = Date.now();
    const remainingTime = endTime - currentTime;

    if (remainingTime <= 0) {
      timerContainer.textContent = 'Timer expired!';
      return;
    }

    const seconds = Math.floor((remainingTime / 1000) % 60);
    const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
    const hours = Math.floor(remainingTime / (1000 * 60 * 60));

    timerContainer.textContent = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    requestAnimationFrame(updateTimer);
  }

  updateTimer();
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      // Redirect to login page if token is not present
      window.location.href = '/login.html';
      return;
    }

    console.log('token:', token);

    const response = await fetch(
      'https://dg-backend-9135cdee7c9e.herokuapp.com/start-timer/get-timer',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok) {
      const timerData = await response.json();
      console.log(timerData);
      displayTimer(timerData.startTime, timerData.duration);
    } else {
      console.error('Failed to fetch timer data');
    }
  } catch (error) {
    console.error('Error:', error);
  }
});
