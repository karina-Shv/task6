
const startBtn = document.querySelector("[data-start]");
const dateTimePicker = document.querySelector("#datetime-picker");
const daysSpan = document.querySelector("[data-days]");
const hoursSpan = document.querySelector("[data-hours]");
const minutesSpan = document.querySelector("[data-minutes]");
const secondsSpan = document.querySelector("[data-seconds]");

let userSelectedDate = null;
let countdownInterval = null;

startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selected = selectedDates[0];
    if (selected <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight'
      });
      startBtn.disabled = true;
    } else {
      userSelectedDate = selected;
      startBtn.disabled = false;
    }
  }
};

flatpickr(dateTimePicker, options);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimerDisplay({ days, hours, minutes, seconds }) {
  daysSpan.textContent = addLeadingZero(days);
  hoursSpan.textContent = addLeadingZero(hours);
  minutesSpan.textContent = addLeadingZero(minutes);
  secondsSpan.textContent = addLeadingZero(seconds);
}

function startCountdown() {
  startBtn.disabled = true;
  dateTimePicker.disabled = true;

  countdownInterval = setInterval(() => {
    const now = new Date();
    const timeDiff = userSelectedDate - now;

    if (timeDiff <= 0) {
      clearInterval(countdownInterval);
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      dateTimePicker.disabled = false;
      return;
    }

    const timeLeft = convertMs(timeDiff);
    updateTimerDisplay(timeLeft);
  }, 1000);
}

startBtn.addEventListener("click", startCountdown);
