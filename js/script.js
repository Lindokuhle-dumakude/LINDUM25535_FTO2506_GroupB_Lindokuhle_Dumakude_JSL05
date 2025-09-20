// Assumes you have: export const initialTasks = [...] in js/initialData.js
import { initialTasks } from "./initialData.js";

const STORAGE_KEY = "tasks";

/**
 * Load tasks from localStorage. If none are saved, fall back to initialTasks.
 * @returns {Array<Object>} list of task objects
 */
function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [...initialTasks]; // return copy of initial tasks
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to parse tasks from localStorage", error);
    return [...initialTasks];
  }
}

/**
 * Save tasks array into localStorage.
 * @param {Array<Object>} tasks
 */
function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/**
 * Return the DOM container element for a status.
 * @param {"todo"|"doing"|"done"} status
 * @returns {HTMLElement|null}
 */
function getTaskContainer(status) {
  return document.querySelector(`.${status}-container`);
}

/**
 * Find a task in tasks array by id.
 * @param {Array<Object>} tasks
 * @param {number|string} id
 * @returns {Object|undefined}
 */
function findTaskById(tasks, id) {
  return tasks.find((t) => String(t.id) === String(id));
}

/**
 * Create a single task card element and attach click handler to open edit modal.
 * @param {Object} task
 * @param {number} task.id
 * @param {string} task.title
 * @param {string} task.description
 * @param {string} task.status
 * @returns {HTMLElement}
 */
function createTaskCard(task) {
  const card = document.createElement("div");
  card.className = "card";
  card.textContent = task.title;
  card.dataset.id = task.id;

  // open modal in edit mode when clicked
  card.addEventListener("click", () => {
    openTaskModal(task);
  });

  return card;
}

/**
 * Render all tasks into their appropriate columns and update counts.
 * @param {Array<Object>} tasks
 */
function renderTasks(tasks) {
  // clear containers
  ["todo", "doing", "done"].forEach((status) => {
    const container = getTaskContainer(status);
    if (container) container.innerHTML = "";
  });

  // create and append cards
  tasks.forEach((task) => {
    const container = getTaskContainer(task.status);
    if (container) {
      const card = createTaskCard(task);
      container.appendChild(card);
    } else {
      console.warn("Missing container for status:", task.status);
    }
  });

  updateColumnCounts(tasks);
}

/**
 * Update the column heading counts (TODO / DOING / DONE).
 * @param {Array<Object>} tasks
 */
function updateColumnCounts(tasks) {
  const map = {
    todo: tasks.filter((t) => t.status === "todo").length,
    doing: tasks.filter((t) => t.status === "doing").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  const todoHeading = document.querySelector(".todo-heading");
  const doingHeading = document.querySelector(".doing-heading");
  const doneHeading = document.querySelector(".done-heading");

  if (todoHeading) todoHeading.textContent = `TODO (${map.todo})`;
  if (doingHeading) doingHeading.textContent = `DOING (${map.doing})`;
  if (doneHeading) doneHeading.textContent = `DONE (${map.done})`;
}

/**
 * Open modal. If `task` is provided, open in Edit mode. If null, open Add mode.
 * @param {Object|null} task
 */
function openTaskModal(task = null) {
  const modal = document.getElementById("taskModal");
  if (!modal) return;

  // populate fields
  const modalTitle = document.getElementById("modalTitle");
  const idField = document.getElementById("taskId");
  const titleField = document.getElementById("taskTitle");
  const descField = document.getElementById("taskDescription");
  const statusField = document.getElementById("taskStatus");

  if (task) {
    modalTitle.textContent = "Edit Task";
    idField.value = task.id;
    titleField.value = task.title;
    descField.value = task.description || "";
    statusField.value = task.status;
  } else {
    modalTitle.textContent = "Add New Task";
    idField.value = "";
    titleField.value = "";
    descField.value = "";
    statusField.value = "todo";
  }

  modal.classList.add("show");
  // focus title
  titleField.focus();
}

/** Close modal */
function closeTaskModal() {
  const modal = document.getElementById("taskModal");
  if (!modal) return;
  modal.classList.remove("show");
}