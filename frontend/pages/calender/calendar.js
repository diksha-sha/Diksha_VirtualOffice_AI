const monthYear = document.getElementById("monthYear");
const calendarDays = document.getElementById("calendarDays");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");
const addEventBtn = document.getElementById("addEventBtn");
const eventList = document.getElementById("eventList");

let currentDate = new Date();
let events = {};

function formatDate(y, m, d) {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function renderCalendar(date) {
  calendarDays.innerHTML = "";
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  monthYear.textContent = date.toLocaleString("default", { month: "long", year: "numeric" });

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    calendarDays.appendChild(empty);
  }

  for (let day = 1; day <= lastDate; day++) {
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("date");
    dayDiv.textContent = day;

    const fullDate = formatDate(year, month + 1, day);

    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      dayDiv.classList.add("today");
    }

    if (events[fullDate] && events[fullDate].length > 0) {
      const dot = document.createElement("div");
      dot.classList.add("event-dot");
      dayDiv.appendChild(dot);
    }

    dayDiv.addEventListener("click", () => {
      const title = prompt("Enter event title:");
      if (title) {
        if (!events[fullDate]) {
          events[fullDate] = [];
        }
        events[fullDate].push(title);
        updateEventList();
        renderCalendar(currentDate);
      }
    });

    calendarDays.appendChild(dayDiv);
  }
}

function updateEventList() {
  eventList.innerHTML = "";

  const sortedDates = Object.keys(events).sort();

  for (const date of sortedDates) {
    events[date].forEach((event, index) => {
      const li = document.createElement("li");
      li.textContent = `${date}: ${event}`;

      li.addEventListener("click", () => {
        const remove = confirm("Remove this event?");
        if (remove) {
          events[date].splice(index, 1);
          if (events[date].length === 0) delete events[date];
          updateEventList();
          renderCalendar(currentDate);
        }
      });

      eventList.appendChild(li);
    });
  }
}

prevMonth.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});

nextMonth.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

addEventBtn.addEventListener("click", () => {
  const date = prompt("Enter date (YYYY-MM-DD):");
  const title = prompt("Enter event title:");
  if (date && title) {
    if (!events[date]) {
      events[date] = [];
    }
    events[date].push(title);
    updateEventList();
    renderCalendar(currentDate);
  }
});

renderCalendar(currentDate);