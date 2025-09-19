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