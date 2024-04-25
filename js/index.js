const form = document.querySelector('.product');
const timerContainer = document.querySelector('.timer');
const message = document.getElementById('message');
const startButton = document.querySelector('.product_btn');

startButton.addEventListener('click', async () => {
  const formData = new FormData(form);
  const wish = formData.get('wish');
  const delayTime = parseInt(formData.get('delayTime'));

  try {
    // Send request to start the timer
    const response = await fetch(
      'https://dg-backend-9135cdee7c9e.herokuapp.com/start-timer',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wish: wish, delayTime: delayTime }), // Sending wish and delayTime in the body
      },
    );

    if (response.ok) {
      // Timer started successfully, display countdown
      displayTimer(delayTime);
      message.textContent = 'Timer started successfully.';
      form.reset();
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
  const endTime = startTime + duration * 1000; // Convert seconds to milliseconds

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
