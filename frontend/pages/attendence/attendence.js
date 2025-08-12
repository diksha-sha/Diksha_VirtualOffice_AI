const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const departmentInput = document.getElementById("departmentInput");
const checkInBtn = document.getElementById("checkInBtn");
const checkOutBtn = document.getElementById("checkOutBtn");
const onLeaveBtn = document.getElementById("onLeaveBtn");
const attendanceTable = document.getElementById("attendanceTable");
const currentDateSpan = document.getElementById("currentDate");

const today = new Date().toISOString().split("T")[0];
currentDateSpan.textContent = today;

let attendance = {}; // email => { name, department, status, checkIn, checkOut, totalTime }

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function calcTotalTime(checkIn, checkOut) {
  const diffMs = new Date(checkOut) - new Date(checkIn);
  const mins = Math.floor(diffMs / 60000);
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hrs}h ${remMins}m`;
}

function updateTable() {
  attendanceTable.innerHTML = "";

  for (let email in attendance) {
    const record = attendance[email];
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${record.name}</td>
      <td>${record.department}</td>
      <td>${record.status}</td>
      <td>${record.checkIn || "-"}</td>
      <td>${record.checkOut || "-"}</td>
      <td>${record.totalTime || "-"}</td>
    `;

    attendanceTable.appendChild(row);
  }
}

function validateInputs() {
  const name = nameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  const department = departmentInput.value.trim();

  if (!name || !email || !department) {
    alert("Please enter Name, Email, and Department.");
    return null;
  }
  return { name, email, department };
}

checkInBtn.addEventListener("click", () => {
  const info = validateInputs();
  if (!info) return;

  const now = new Date();
  attendance[info.email] = {
    name: info.name,
    department: info.department,
    status: "Checked In",
    checkIn: formatTime(now),
    checkOut: "",
    totalTime: ""
  };

  updateTable();
  nameInput.value = "";
  emailInput.value = "";
  departmentInput.value = "";
});

checkOutBtn.addEventListener("click", () => {
  const info = validateInputs();
  if (!info) return;

  if (!attendance[info.email] || attendance[info.email].status !== "Checked In") {
    alert("This user is not checked in.");
    return;
  }

  const now = new Date();
  attendance[info.email].checkOut = formatTime(now);
  attendance[info.email].status = "Checked Out";
  attendance[info.email].totalTime = calcTotalTime(
    new Date(`${today}T${attendance[info.email].checkIn}`),
    now
  );

  updateTable();
  nameInput.value = "";
  emailInput.value = "";
  departmentInput.value = "";
});

onLeaveBtn.addEventListener("click", () => {
  const info = validateInputs();
  if (!info) return;

  attendance[info.email] = {
    name: info.name,
    department: info.department,
    status: "On Leave",
    checkIn: "",
    checkOut: "",
    totalTime: ""
  };

  updateTable();
  nameInput.value = "";
  emailInput.value = "";
  departmentInput.value = "";
});