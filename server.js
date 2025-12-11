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
  let time = document.getElementById("timeInput").value;

  if (title === "" || time === "") {
    alert("Please enter all details!");
    return;
  }

  let newTask = { title, priority, time };
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
  let now = new Date().toISOString().slice(0, 16);

  tasks.forEach(task => {
    if (task.time === now) {
      alert("Reminder: " + task.title);
    }
  });
}, 60000);

displayTasks();
