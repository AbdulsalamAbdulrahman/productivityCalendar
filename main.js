const currentYear = 2020;
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
// const colors = ['#2d6b5f', '#72e3a6', '#dff4c7', '#edbf98', '#ea3d36'];
const defaultColor = '#888';
let activeColor = '';

const calendar = document.getElementById('calendar');
const productivities = document.querySelectorAll('.pro');

if('serviceWorker' in navigator){
    try {
      navigator.serviceWorker.register('serviceWorker.js');
      console.log("Service Worker Registered");
    } catch (error) {
      console.log("Service Worker Registration Failed");
    }
  }


productivities.forEach(pro => {
    pro.addEventListener('click', () => {
        // if is already selected, deselect it
        if (pro.classList.contains('selected')) {
            pro.classList.remove('selected');
            activeColor = defaultColor;
        } else {
            productivities.forEach(pro => {
                pro.classList.remove('selected');
            });

            pro.classList.add('selected');
            activeColor = getComputedStyle(pro).getPropertyValue('color');
        }
    });
});

const getAllDays = year => {
    // First day of the year - 1st January
    const firstDay = new Date(`January 1 ${year}`);
    // Last day of the year - 31st December - used to stop adding days to the array
    const lastDay = new Date(`December 31 ${year}`);

    // Add first day
    const days = [firstDay];

    // Used to keep track of the day
    let lastDayInArray = firstDay;

    // Loop while there are new days to be added in the current year
    while (lastDayInArray.getTime() !== lastDay.getTime()) {
        days.push(addDays(lastDayInArray, 1));
        lastDayInArray = days[days.length - 1];
    }

    return days;
};

const dates = getAllDays(currentYear);

let monthsHTML = '';

// Loop over the months and create a div for each month
months.forEach((month, idx) => {
    monthsHTML += `
    <div class="months month_${idx}">
        <h3>${month}</h3>
        <div class="week_days_container">
            ${weekDays
							.map(day => `<div class="week_days">${day}</div>`)
							.join('')}
        </div>
        <div class="days_container"></div>
    </div>`;
});

calendar.innerHTML = monthsHTML;

// Loop over each day and
dates.forEach(date => {
    const month = date.getMonth();
    const monthEl = document.querySelector(`.month_${month} .days_container`);

    // create extra day slots if needed before day 1
    if (date.getDate() === 1 && date.getDay() !== 0) {
        for (let i = 0; i < date.getDay(); i++) {
            const emptySpot = createEmptySpot();

            monthEl.appendChild(emptySpot);
        }
    }

    const dateEl = createDateEl(date);

    monthEl.appendChild(dateEl);
});

// Add click event to all the .circles
const circles = document.querySelectorAll('.circle');
circles.forEach(circle => {
    circle.addEventListener('click', () => {
        circle.style.backgroundColor = activeColor;
    });
});


function createDateEl(date) {
    const day = date.getDate();
    const dateEl = document.createElement('div');
    dateEl.classList.add('days');
    dateEl.innerHTML = `<span class="circle">${day}</span>`;

    return dateEl;
}

function createEmptySpot() {
    const emptyEl = document.createElement('div');
    emptyEl.classList.add('days');

    return emptyEl;
}

// function from StackOverflow: https://stackoverflow.com/questions/563406/add-days-to-javascript-date
function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}