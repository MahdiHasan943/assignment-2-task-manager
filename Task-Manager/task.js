// Get references to DOM elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const alertPlaceholder = document.getElementById("alertPlaceholder");

// Load tasks from localStorage, or initialize empty array if none found
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Function to save tasks to localStorage
function updateLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to show Bootstrap alert messages
function showAlert(message, type = "success") {
  const alert = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
  alertPlaceholder.innerHTML = alert;

  // Automatically hide alert after 3 seconds
  setTimeout(() => (alertPlaceholder.innerHTML = ""), 3000);
}

// Function to update the total number of tasks shown
function updateTaskCount() {
  taskCount.textContent = tasks.length;
}

// Function to render all tasks in the list
function renderTasks() {
  // Clear the current task list before re-rendering
  taskList.innerHTML = "";

  // Loop through tasks and create HTML elements for each
  tasks.forEach((task, index) => {
    // Create list item for the task
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";

    // Create span to hold the task text
    const taskText = document.createElement("span");
    taskText.innerText = task.text;

    // If the task is completed, apply strikethrough style
    if (task.completed) {
      taskText.classList.add("text-decoration-line-through", "text-muted");
    }

    // Create a container for action buttons
    const btnGroup = document.createElement("div");

    // Create 'Complete' button
    const doneBtn = document.createElement("button");
    doneBtn.className = "btn btn-sm btn-success me-2";
    doneBtn.innerText = "✔";
    doneBtn.onclick = () => {
      // Toggle the task's completed state
      tasks[index].completed = !tasks[index].completed;
      updateLocalStorage(); // Save changes
      renderTasks(); // Re-render the list
    };

    // Create 'Delete' button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-sm btn-danger";
    deleteBtn.innerText = "🗑";
    deleteBtn.onclick = () => {
      // Remove the task from the array
      tasks.splice(index, 1);
      updateLocalStorage(); // Save updated list
      renderTasks(); // Re-render the list
      showAlert("Task deleted!", "danger"); // Show alert
    };

    // Append buttons to button group
    btnGroup.appendChild(doneBtn);
    btnGroup.appendChild(deleteBtn);

    // Append task text and buttons to list item
    li.appendChild(taskText);
    li.appendChild(btnGroup);

    // Append list item to the task list
    taskList.appendChild(li);
  });

  // Update the displayed task count
  updateTaskCount();
}

// Event listener for the "Add Task" button
addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();

  // Prevent adding empty tasks
  if (text === "") {
    showAlert("Task cannot be empty!", "warning");
    return;
  }

  // Add new task to array
  tasks.push({ text, completed: false });

  // Save and re-render
  updateLocalStorage();
  renderTasks();

  // Clear input field
  taskInput.value = "";

  // Show success alert
  showAlert("Task added successfully!");
});

// Initial rendering of tasks on page load
renderTasks();
