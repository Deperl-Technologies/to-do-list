// DOM Elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const totalTasksEl = document.getElementById("totalTasks");
const completedTasksEl = document.getElementById("completedTasks");
const filterBtns = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const emptyState = document.getElementById("emptyState");

// State
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Initialize app
function init() {
  renderTasks();
  updateStats();

  // Event listeners
  addTaskBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
  });

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });

  clearCompletedBtn.addEventListener("click", clearCompleted);
}

// Add new task
function addTask() {
  const content = taskInput.value.trim();
  if (content === "") return;

  const newTask = {
    id: Date.now(),
    content,
    completed: false,
    priority: "medium", // Can be extended to allow user selection
    createdAt: new Date().toISOString(),
  };

  tasks.unshift(newTask);
  saveTasks();
  renderTasks();
  updateStats();

  // Reset input
  taskInput.value = "";
  taskInput.focus();
}

// Render tasks based on filter
function renderTasks() {
  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  // Update empty state
  emptyState.style.display = filteredTasks.length ? "none" : "block";

  // Render tasks
  taskList.innerHTML = "";
  filteredTasks.forEach((task) => {
    const taskEl = document.createElement("li");
    taskEl.className = `task-item ${task.completed ? "completed" : ""}`;
    taskEl.dataset.id = task.id;

    // Generate random priority for demo (in a real app, this would be user-defined)
    const priorities = ["low", "medium", "high"];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];

    taskEl.innerHTML = `
                <div class="task-details">
                    <div class="priority-indicator priority-${priority}"></div>
                    <div class="task-check"></div>
                    <div class="task-content" contenteditable="true">${task.content}</div>
                    <div class="task-actions">
                        <button class="btn-edit"><i class="fas fa-edit"></i></button>
                        <button class="btn-delete"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
            `;

    taskList.appendChild(taskEl);

    // Add event listeners to the task
    const taskCheck = taskEl.querySelector(".task-check");
    const taskContent = taskEl.querySelector(".task-content");
    const editBtn = taskEl.querySelector(".btn-edit");
    const deleteBtn = taskEl.querySelector(".btn-delete");

    taskCheck.addEventListener("click", () => toggleTask(task.id));

    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    taskContent.addEventListener("blur", () => {
      updateTaskContent(task.id, taskContent.textContent);
    });

    taskContent.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        taskContent.blur();
      }
    });

    editBtn.addEventListener("click", () => {
      taskContent.focus();
      document.execCommand("selectAll", false, null);
    });
  });
}

// Toggle task completion
function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
  updateStats();
}

// Delete task
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
  updateStats();
}

// Update task content
function updateTaskContent(id, content) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, content: content.trim() } : task
  );
  saveTasks();
  renderTasks();
}

// Clear completed tasks
function clearCompleted() {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
  updateStats();
}

// Update statistics
function updateStats() {
  totalTasksEl.textContent = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  completedTasksEl.textContent = completed;
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Initialize the app
init();
