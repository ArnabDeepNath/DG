const startButton = document.getElementById('product_btn');
const timerContainer = document.querySelector('.timer');
const message = document.getElementById('message');

startButton.addEventListener('click', async () => {
  const wish = document.getElementById('wish').value;
  const duration = parseInt(document.getElementById('delayInput').value);

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
        body: JSON.stringify({ wish, duration }),
      },
    );

    if (response.ok) {
      // Timer started successfully, display countdown
      displayTimer(duration);
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
  const endTime = startTime + duration * 1000; // Calculate endTime in milliseconds

  function updateTimer() {
    const currentTime = Date.now(); // Get the current time in milliseconds
    const remainingTime = endTime - currentTime; // Calculate remaining time in milliseconds

    if (remainingTime <= 0) {
      deleteTimer();
      timerContainer.textContent = 'You can fulfil your wish !';
      return;
    }

    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
    const minutes = Math.floor(
      (remainingTime % (1000 * 60 * 60)) / (1000 * 60),
    );
    const hours = Math.floor(remainingTime / (1000 * 60 * 60));

    timerContainer.textContent = `${hours}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    requestAnimationFrame(updateTimer);
  }

  updateTimer();
}

async function deleteTimer() {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token not found.');
      return;
    }

    const response = await fetch(
      'https://dg-backend-9135cdee7c9e.herokuapp.com/start-timer/delete-timer',
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok) {
      console.log('Timer entry deleted.');
    } else {
      console.error('Failed to delete timer entry.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
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
