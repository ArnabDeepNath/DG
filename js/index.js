// index.js

// Function to fetch timer data from the backend
async function fetchTimerData() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      'https://dg-backend-9135cdee7c9e.herokuapp.com/start-timer/start-timer',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (response.ok) {
      const data = await response.json();
      return data.timerData;
    } else {
      console.error('Failed to fetch timer data');
      return null;
    }
  } catch (error) {
    console.error('Error fetching timer data:', error);
    return null;
  }
}

// Function to display the timer
function displayTimer(duration) {
  const timerContainer = document.querySelector('.timer');
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

// On page load, fetch timer data and display the timer
document.addEventListener('DOMContentLoaded', async () => {
  const timerData = await fetchTimerData();
  if (timerData) {
    displayTimer(timerData.duration);
  }
});
