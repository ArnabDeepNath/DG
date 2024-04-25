const startButton = document.querySelector('.product_btn');
const timerContainer = document.querySelector('.timer');
const message = document.getElementById('message');

startButton.addEventListener('click', async () => {
  const wish = document.querySelector('input[name="wish"]').value;
  const delayTime = parseInt(
    document.querySelector('input[name="delayTime"]').value,
  );

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
        body: JSON.stringify({ wish, duration: delayTime }), // Include the wish in the request body
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

function displayTimer(duration) {
  let endTime = localStorage.getItem('endTime');
  const currentTime = Date.now();

  if (!endTime) {
    endTime = currentTime + duration * 1000;
    localStorage.setItem('endTime', endTime);
  }

  function updateTimer() {
    const remainingTime = endTime - currentTime;

    if (remainingTime <= 0) {
      timerContainer.textContent = 'Timer expired!';
      localStorage.removeItem('endTime'); // Remove the end time from local storage
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

// Call displayTimer function when the page loads
window.addEventListener('load', () => {
  const duration = parseInt(localStorage.getItem('duration'), 10);
  if (duration) {
    displayTimer(duration);
  }
});
