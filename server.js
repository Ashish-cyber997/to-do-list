 let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentFilter = 'All';

    function saveAndRender() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    }

    function addTask() {
      let title = document.getElementById("taskInput").value;
      let priority = document.getElementById("priorityInput").value;
      let category = document.getElementById("categoryInput").value;
      let rawTime = document.getElementById("timeInput").value;

      if (!title) { alert("Please enter a task name!"); return; }

      // Pretty Display Time
      let timeDisplay = rawTime ? new Date(rawTime).toLocaleString([], {hour: '2-digit', minute:'2-digit', month: 'short', day: 'numeric'}) : "No Deadline";

      let newTask = {
        id: Date.now(),
        title,
        priority,
        category,
        time: timeDisplay,
        rawDate: rawTime,  // Saving RAW format for Reminder Check
        completed: false,
        notified: false    // To prevent multiple alerts
      };

      tasks.push(newTask);
      document.getElementById("taskInput").value = "";
      saveAndRender();
    }

    function filterTasks(priority) {
        currentFilter = priority;
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`btn-${priority}`).classList.add('active');
        renderTasks();
    }

    function renderTasks() {
      let activeContainer = document.getElementById("taskList");
      let historyContainer = document.getElementById("historyList");
      activeContainer.innerHTML = "";
      historyContainer.innerHTML = "";

      tasks.forEach((task) => {
        if (currentFilter !== 'All' && task.priority !== currentFilter && !task.completed) return;

        let html = `
          <div class="task-card p-${task.priority}">
            <div class="task-details">
              <h4>${task.title}</h4>
              <div class="task-meta">
                <span class="badge">${task.category}</span>
                <span><i class="far fa-clock"></i> ${task.time}</span>
              </div>
            </div>
            <div class="actions">
                <button onclick="toggleComplete(${task.id})" class="icon-btn check">
                    <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                </button>
                <button onclick="deleteTask(${task.id})" class="icon-btn trash">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
          </div>
        `;
        task.completed ? historyContainer.innerHTML += html : activeContainer.innerHTML += html;
      });

      if(activeContainer.innerHTML === "") activeContainer.innerHTML = "<div style='text-align:center; color:#444; margin-bottom:15px; font-size:13px;'>No active tasks. Relax!</div>";
    }

    function toggleComplete(id) {
      let task = tasks.find(t => t.id === id);
      if (task) { task.completed = !task.completed; saveAndRender(); }
    }

    function deleteTask(id) {
      if(confirm("Delete this mission?")) { tasks = tasks.filter(t => t.id !== id); saveAndRender(); }
    }

    // --- REMINDER SYSTEM (NEW & FIXED) ---
    setInterval(() => {
        let now = new Date();
        // Create a string that matches the input format: YYYY-MM-DDTHH:MM
        let currentString = now.getFullYear() + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0') + 'T' +
            String(now.getHours()).padStart(2, '0') + ':' +
            String(now.getMinutes()).padStart(2, '0');

        tasks.forEach(task => {
            // Check: if time exists + not done + not already notified + time matches
            if (task.rawDate && !task.completed && !task.notified && task.rawDate === currentString) {
                alert(`⏰ REMINDER: ${task.title}\nCategory: ${task.category}`);
                task.notified = true; // Mark as notified
                saveAndRender();
            }
        });
    }, 1000); // Checks every 1 second

    renderTasks();