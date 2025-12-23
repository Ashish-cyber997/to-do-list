let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function displayTasks() {
  document.getElementById("taskList").innerHTML = "";

  tasks.forEach((task, index) => {
    let priorityClass =
      task.priority === "High"
        ? "priority-high"
        : task.priority === "Medium"
        ? "priority-medium"
        : "priority-low";

    let taskCard = `
      <div class="task">
        <div>
          <div><strong>${task.title}</strong></div>
          <div>Category: ${task.category}</div>
          <div class="${priorityClass}">${task.priority}</div>
          <div>Reminder: ${task.time}</div>
        </div>
        <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
      </div>
    `;

    document.getElementById("taskList").innerHTML += taskCard;
  });
}

function addTask() {
  let title = document.getElementById("taskInput").value;
  let priority = document.getElementById("priorityInput").value;
  let category = document.getElementById("categoryInput").value;
  let rawTime = document.getElementById("timeInput").value;

  if (title === "" || rawTime === "") {
    alert("Please enter all details!");
    return;
  }

  // Convert to correct format (YYYY-MM-DDTHH:MM)
  let time = rawTime.replace(" ", "T").slice(0, 16);

  let newTask = { title, priority, category, time };
  tasks.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  displayTasks();
}

function deleteTask(i) {
  tasks.splice(i, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
}

// Reminder system
setInterval(() => {
  let now = new Date();
  let currentTime =
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0") +
    "T" +
    String(now.getHours()).padStart(2, "0") +
    ":" +
    String(now.getMinutes()).padStart(2, "0");

  tasks.forEach(task => {
    let taskTime = task.time.replace(" ", "T").slice(0, 16);
    if (taskTime === currentTime) {
      alert("Reminder: " + task.title + "\nCategory: " + task.category);
;
    }
  });
}, 5000);

displayTasks();

