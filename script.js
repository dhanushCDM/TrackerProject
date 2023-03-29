let activities = JSON.parse(localStorage.getItem('activities') || '[]');


function requestNotificationPermission() {
  if (Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
}

function displayActivities() {
  const activityTable = document.getElementById('activityTable');
  activityTable.innerHTML = '';

  activities.forEach((activity) => {
    const row = document.createElement('tr');

    const dateCell = document.createElement('td');
    dateCell.classList.add('mdl-data-table__cell--non-numeric');
    dateCell.textContent = activity.date;
    row.appendChild(dateCell);

const startCell = document.createElement('td');
startCell.classList.add('mdl-data-table__cell--non-numeric');
startCell.textContent = formatTime(activity.start);
row.appendChild(startCell);

const endCell = document.createElement('td');
endCell.classList.add('mdl-data-table__cell--non-numeric');
endCell.textContent = formatTime(activity.end);
row.appendChild(endCell);


    const durationCell = document.createElement('td');
    durationCell.classList.add('mdl-data-table__cell--non-numeric');
    durationCell.textContent = formatDuration(activity.duration);
    row.appendChild(durationCell);

    const descriptionCell = document.createElement('td');
    descriptionCell.classList.add('mdl-data-table__cell--non-numeric');
    descriptionCell.textContent = activity.description;
    row.appendChild(descriptionCell);

    activityTable.appendChild(row);
  });
}

function formatTime(time) {
  const hour = parseInt(time.substr(0, 2));
  const minute = time.substr(3);
  return `${hour.toString().padStart(2, '0')}:${minute}`;
}


function formatDuration(duration) {
  const hours = Math.floor(duration / 60);
  const minutes = Math.floor(duration % 60);

  if (hours === 0) {
    return `${minutes} mins`;
  } else if (minutes === 0) {
    return `${hours} hour(s)`;
  } else {
    return `${hours} hour(s) ${minutes} mins`;
  }
}



function addActivity() {
  const activityInput = document.getElementById("activityInput").value;
  const startTime = document.getElementById("startTime").value || getDefaultStartTime();
  const endTime = document.getElementById("endTime").value || getCurrentHour();
  const duration = calculateDuration(startTime, endTime); // Store duration as a number

  const activity = {
    date: getCurrentDate(),
    start: startTime,
    end: endTime,
    duration: duration, // Save duration as a number
    description: activityInput
  };

  activities.push(activity);
  localStorage.setItem('activities', JSON.stringify(activities)); // Save activities to local storage
  displayActivities();
  closeModal();
}


function calculateDuration(startTime, endTime) {
  function convertTo24Hour(time) {
    const [hour, minute, ampm] = time.match(/(\d+):(\d+)\s*(AM|PM)/i).slice(1);
    const hours = ampm.toUpperCase() === 'PM' ? (parseInt(hour) % 12) + 12 : parseInt(hour) % 12;
    return hours * 60 + parseInt(minute);
  }

  const startMinutes = convertTo24Hour(startTime);
  const endMinutes = convertTo24Hour(endTime);

  let duration = endMinutes - startMinutes;
  if (duration < 0) {
    duration += 24 * 60; // Add 1 day (in minutes) if the end time is earlier than the start time
  }

  return duration;
}


function updateDuration() {
  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;

  if (startTime && endTime) {
    const duration = calculateDuration(startTime, endTime);
    document.getElementById("duration").value = formatDuration(duration);
  } else {
    document.getElementById("duration").value = "";
  }
}



function getDefaultStartTime() {
  const currentHour = new Date();
  currentHour.setHours(currentHour.getHours() - 1);
  return currentHour.toISOString().substr(11, 5);
}

function getCurrentHour() {
  const currentHour = new Date();
  return currentHour.toISOString().substr(11, 5);
}

function getCurrentDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[today.getMonth()];
  const year = today.getFullYear();

  return `${day}-${month}-${year}`;
}

function openModal() {
  const activityModal = document.getElementById("activityModal");
  activityModal.style.display = "block";
  
    // Clear input fields when modal is opened
  const activityInput = document.getElementById("activityInput");
  const startTime = document.getElementById("startTime");
  const endTime = document.getElementById("endTime");
  activityInput.value = "";
  startTime.value = "";
  endTime.value = "";
}

function closeModal() {
  const activityModal = document.getElementById("activityModal");
  activityModal.style.display = "none";
}

function showNotification() {
  // ... (existing showNotification function code)
 if (!("Notification" in window)) {
    alert("This browser does not support desktop notifications.");
  } else if (Notification.permission === "granted") {
    const notification = new Notification("Time to log your activity!", {
      body: "Click here to enter your activity.",
    });
    notification.onclick = () => {
      window.parent.focus();
      showModal();
      notification.close(); 
    };
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        const notification = new Notification("Time to log your activity!", {
          body: "Click here to enter your activity.",
        });
        notification.onclick = () => {
          window.parent.focus();
          showModal();
          notification.close();
        };
      }
    });
  }
    if (!("Notification" in window)) {
    alert("This browser does not support desktop notifications.");
  } else if (Notification.permission === "granted") {
    const notification = new Notification("Time to log your activity!", {
      body: "Click here to enter your activity.",
    });
    notification.onclick = () => {
      window.parent.focus(); // Change this line
    };
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        const notification = new Notification("Time to log your activity!", {
          body: "Click here to enter your activity.",
        });
        notification.onclick = () => {
          window.parent.focus(); // Change this line
        };
      }
    });
  }
}

function checkTime() {
  // ... (existing checkTime function code)
 const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  // Check if the current time is between 11:00 AM and 11:00 PM
  if (hour >= 11 && hour <= 23) {
    // Check if the current minute is 0 (top of the hour)
    if (minute === 0) {
      showNotification();
    }
  }
}

function handleKeyboardShortcut(event) {
  // ... (existing handleKeyboardShortcut function code)
const controlKeyPressed = event.ctrlKey || event.metaKey;
  const altKeyPressed = event.altKey;
  const sKeyPressed = event.key === 's' || event.key === 'S';

  if (controlKeyPressed && altKeyPressed && sKeyPressed) {
    event.preventDefault();
    showNotification();
  }
}

function displayCurrentDayDate() {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const day = days[now.getDay()];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const month = monthNames[now.getMonth()];
  const date = now.getDate();
  const year = now.getFullYear();
  const formattedDate = `${date} ${month} ${year}, ${day}`;


  document.getElementById('currentDayDate').innerText = formattedDate;
}



function resetActivities() {
  if (confirm('Are you sure you want to reset all activities? This action cannot be undone.')) {
    activities = [];
    localStorage.setItem('activities', JSON.stringify(activities));
    displayActivities();
  }
}




document.getElementById('activityInput').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    addActivity();
  }
});

window.addEventListener('keydown', handleKeyboardShortcut);

const activityModal = document.getElementById("activityModal");
const addActivityBtn = document.getElementById("addActivityBtn");
const closeModalBtn = document.querySelector(".close");

addActivityBtn.addEventListener("click", () => {
  activityModal.style.display = "block";
});

closeModalBtn.addEventListener("click", () => {
  activityModal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target == activityModal) {
    activityModal.style.display = "none";
  }
});


document.getElementById("activitySubmitBtn").addEventListener("click", addActivity);

document.getElementById("currentDayDate").innerHTML = new Date().toLocaleDateString();
document.getElementById('addActivityBtn').addEventListener('click', openModal);


// Export to CSV
function exportToCsv() {
  let csvContent = 'Date,Start Time,End Time,Duration,Activity\n';
  activities.forEach(activity => {
    csvContent += `${activity.date},${activity.start},${activity.end},${activity.duration},${activity.description.replace(/,/g, ';')}\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', 'activities.csv');
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


document.getElementById('exportBtn').addEventListener('click', exportToCsv);

displayActivities();
document.addEventListener('DOMContentLoaded', requestNotificationPermission);
setInterval(checkTime, 60000); // Check the time every 60,000 milliseconds (1 minute)
document.getElementById('resetBtn').addEventListener('click', resetActivities);
document.getElementById('testNotificationBtn').addEventListener('click', showNotification);
document.getElementById("startTime").addEventListener("input", updateDuration);
document.getElementById("endTime").addEventListener("input", updateDuration);
document.addEventListener('DOMContentLoaded', displayCurrentDayDate);
