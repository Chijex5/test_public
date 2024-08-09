const circle = document.querySelector('.progress-ring__circle');
const radius = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;
circle.style.strokeDasharray = circumference;

let percentage = 5;

function updateLoader() {
  const offset = circumference - (percentage / 100) * circumference;
  circle.style.strokeDasharray = offset;
  
  percentage += 5;
  if (percentage > 100) {
    percentage = 5;
  }
}

setInterval(updateLoader, 500); // Update every second
