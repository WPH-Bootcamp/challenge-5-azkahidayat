// === CLOCK ===
const clock = document.querySelector('#clock');

function runClock() {
  const timeToday = new Date();
  const hour = String(timeToday.getHours()).padStart(2, '0');
  const minute = String(timeToday.getMinutes()).padStart(2, '0');
  const second = String(timeToday.getSeconds()).padStart(2, '0');

  clock.innerText = `${hour}:${minute}:${second}`;
}

document.addEventListener('DOMContentLoaded', runClock);
setInterval(runClock, 1000);

// === DATE ===
const date = document.querySelector('#date');
const today = new Date();
const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
const monthName = today.toLocaleDateString('en-US', { month: 'long' });

date.innerText = `${dayName}, ${today.getDate()} ${monthName} ${today.getFullYear()}`;

// === CLASS ===
class TodoList {
  constructor() {
    this.todos = [];
  }

  addTodo(newTodo) {
    this.todos.push(newTodo);
  }

  deleteTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
  }

  getAll() {
    return this.todos;
  }
}

class Todo {
  constructor(todo, completed, id) {
    this.todo = todo;
    this.completed = completed ? completed : false;
    this.id = id ? id : Date.now() + Math.random();
  }

  toggleTodo() {
    this.completed = !this.completed;
  }

  editTodo(newTodo) {
    this.todo = newTodo;
  }
}

const todoList = new TodoList();

// === TASK NUMBER ===
const taskNumber = document.querySelector('#task-number');
updateTaskNumber();

function updateTaskNumber() {
  const tasks = todoList.getAll().length;
  taskNumber.innerText = tasks;
}

// === INCOMPLETE TASK NUMBER ===
const incompleteTaskNumber = document.querySelector('#incomplete-task-number');
function updateIncompleteTaskNumber() {
  const incompleteTasks = todoList
    .getAll()
    .filter((todo) => !todo.completed).length;
  incompleteTaskNumber.innerText = incompleteTasks;
}
updateIncompleteTaskNumber();

// === COMPLETE TASK NUMBER ===
const completeTaskNumber = document.querySelector('#complete-task-number');
function updateCompleteTaskNumber() {
  const completeTasks = todoList
    .getAll()
    .filter((todo) => todo.completed).length;

  completeTaskNumber.innerText = completeTasks;
}
updateCompleteTaskNumber();

// === ADD TODO FUNCTIONALITY ===
const todoInput = document.querySelector('#todo-input');
const todoAddButton = document.querySelector('#todo-add-button');
const errorText = document.querySelector('#error-text');
const todoContainer = document.querySelector('#todo-container');

let newTodoUserInput = '';

// 1. Add Todo by pressing Enter button
todoInput.addEventListener('keydown', function (event) {
  newTodoUserInput = todoInput.value.trim();
  event.key === 'Enter' && handleAddTodo();
});

// 2. Add Todo by clicking Add Todo button
todoAddButton.addEventListener('click', function () {
  newTodoUserInput = todoInput.value.trim();
  handleAddTodo();
});

const checkSvg = `
<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 24 24"
fill="#3F9CA1"
class="size-5 "
>
<path
fill-rule="evenodd"
d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
clip-rule="evenodd"
/>
</svg> 

`;

function handleAddTodo() {
  // 1. validation
  if (!newTodoUserInput) {
    showError();
    return;
  }

  hideError();

  // 2. Create object todo
  const todo = new Todo(newTodoUserInput);

  // 3. Add todo
  todoList.addTodo(todo);

  // 4. Render todo
  renderTodos();

  // 5. Update task Number
  updateTaskNumber();

  // 6. Update Incomplete task number
  updateIncompleteTaskNumber();

  // 7. Save local
  saveDataToLocalStorage(todo);

  todoInput.value = '';
  newTodoUserInput = '';
}

function showError() {
  errorText.classList.remove('invisible');
  todoInput.classList.add('border-red-500');
}

function hideError() {
  errorText.classList.add('invisible');
  todoInput.classList.remove('border-red-500');
}

function saveDataToLocalStorage(todo) {
  const saved = localStorage.getItem('todo');
  const data = saved ? JSON.parse(saved) : [];
  data.push(todo);
  localStorage.setItem('todo', JSON.stringify(data));
}

function getDataFromLocalStorage() {
  const saved = localStorage.getItem('todo');
  const data = saved ? JSON.parse(saved) : [];
  console.log(data);
  if (data.length === 0) return;
  data.forEach((d) => {
    const todo = new Todo(d.todo, d.completed, d.id);
    todoList.addTodo(todo);
  });
}

function updateDataLocalStorage(updateType, id, newTodoName = '') {
  const saved = localStorage.getItem('todo');
  const data = saved ? JSON.parse(saved) : [];
  if (data.length === 0) return;

  const update = updateType;
  switch (update) {
    case 'delete':
      const remainingTodos = data.filter((d) => {
        d.id !== id;
      });

      localStorage.setItem('todo', JSON.stringify(remainingTodos));
      break;
    case 'toggle':
      data.forEach((d) => {
        if (d.id === id) {
          d.completed = !d.completed;
        }
      });
      localStorage.setItem('todo', JSON.stringify(data));
      break;
    case 'edit':
      if (newTodoName.trim() === '') return;
      data.forEach((d) => {
        if (d.id === id) {
          d.todo = newTodoName;
        }
      });
      localStorage.setItem('todo', JSON.stringify(data));
      break;
  }
}

console.log(todoList.getAll());

// === TOGGLE, DELETE, EDIT TODO FUNCTIONALITY ===
const modal = document.querySelector('.modal');
const modalInput = modal.querySelector('.modal-input');
let selectedEditTodoObject;
let newTodoName = '';

document.addEventListener('click', function (event) {
  // === TOGGLE FUNCTIONALITY ===
  const isToggleTodo = event.target.closest('.toggle-todo');
  if (isToggleTodo) {
    // 1. Access element id
    const selectedToggleTodoElement = isToggleTodo.closest('.todo');
    const selectedToggleTodoElementId = selectedToggleTodoElement.dataset.id;

    // 2. Find the todo object that matches the selected toggle element id
    const selectedToggleTodoObject = todoList.todos.find(
      (todo) => String(todo.id) === selectedToggleTodoElementId
    );

    // 3. Toggle
    selectedToggleTodoObject.toggleTodo();

    // 4. Render todo
    renderTodos();

    // 5. Update incomplete task number
    updateIncompleteTaskNumber();

    // 6. Update complete task number
    updateCompleteTaskNumber();

    // 7. Update Local Data
    updateDataLocalStorage('toggle', Number(selectedToggleTodoElementId));
  }

  // === DELETE FUNCTIONALITY ===
  const isDeleteButton = event.target.closest('.delete-button');
  if (isDeleteButton) {
    // 1. Access element id
    const selectedDeleteTodoElement = isDeleteButton.closest('.todo');
    const selectedDeleteTodoElementId = selectedDeleteTodoElement.dataset.id;

    // 2. Delete
    todoList.deleteTodo(Number(selectedDeleteTodoElementId));

    // 3. Render todo
    renderTodos();

    // 4. Update task number
    updateTaskNumber();

    // 5. Update incomplete task number
    updateIncompleteTaskNumber();

    // 6. Update complete task number
    updateCompleteTaskNumber();

    // 7. Update Local Data
    updateDataLocalStorage('delete', Number(selectedDeleteTodoElementId));
  }

  // === EDIT FUNCTIONALITY ===

  const isEditButton = event.target.closest('.edit-button');
  if (isEditButton) {
    openModal();

    // 1. Access element id
    const selectedEditTodoElement = isEditButton.closest('.todo');
    const selectedEditTodoElementId = selectedEditTodoElement.dataset.id;

    // 2. Find the todo object that matches the selected edit element id
    selectedEditTodoObject = todoList.todos.find(
      (todo) => String(todo.id) === selectedEditTodoElementId
    );

    // 3. Fill input with previous todo name
    modalInput.value = selectedEditTodoObject.todo;
  }

  // Click overlay = close modal
  const isOverlay = event.target.closest('.overlay');
  if (isOverlay) {
    closeModal();
  }
});

const modalForm = document.querySelector('.modal-form');
modalForm.addEventListener('submit', function (event) {
  event.preventDefault();

  // 1. Get new name from input
  newTodoName = modalInput.value.trim();

  // 2. Validation
  if (!newTodoName) {
    modalInput.classList.add('border-red-500');
    return;
  }

  modalInput.classList.remove('border-red-500');

  // 3. Edit
  selectedEditTodoObject.editTodo(newTodoName);

  // 4. Render todo
  renderTodos();

  // 5. Close Modal
  closeModal();

  // 6. Update local data
  updateDataLocalStorage('edit', selectedEditTodoObject.id, newTodoName);
});

function openModal() {
  modal.classList.add('opacity-100');
  modal.classList.remove('invisible');
}

function closeModal() {
  modal.classList.remove('opacity-100');
  modal.classList.add('invisible');
}

// === RENDER TODO LIST ===
let isLoadingData = false;
let isError = false;
let errorMessage;
function renderTodos() {
  todoContainer.innerHTML = '';

  if (isError) {
    todoContainer.innerHTML = `
    <p class="text-center">${errorMessage}</p>
    `;
    return;
  }
  if (isLoadingData) {
    todoInput.disabled = true;
    todoAddButton.disabled = true;
    todoContainer.innerHTML = `
    <div>
      <p class="text-center">Loading data...</p>
      <p class="text-center">Please wait or refresh the page</p>
    </div>
        `;
    return;
  }

  if (todoList.todos.length === 0) {
    todoContainer.innerHTML = `
    <p class="text-center">No todos yet</p>
    `;
    return;
  }

  todoInput.disabled = false;
  todoAddButton.disabled = false;
  todoList.todos.forEach((todo) => {
    updateTodoListUI(todo.todo, todo.id, todo.completed);
  });
}

// === UPDATE TODO LIST UI ===
function updateTodoListUI(todo, id, completed) {
  const todoElement = `
  <li class="todo flex justify-between items-center px-1 py-2 hover:bg-[#E8F3F5] ${completed ? 'bg-[#E8F3F5]' : ''}" data-id="${id}">
  <div class="toggle-todo flex gap-2 items-center w-full cursor-pointer">
    <div
      class="mark-todo size-4 flex justify-center items-center rounded-md border cursor-pointer ${completed ? 'border-0' : 'border'}"
    >${completed ? checkSvg : ''}</div>
    <p class="text-todo md:text-lg capitalize pointer-events-none ${completed ? 'line-through text-gray-500' : ''}">${todo}</p>
  </div>
  <div class="flex gap-2">
    <button class="delete-button">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-5 cursor-pointer"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
        />
      </svg>
    </button>

    <div class="edit-button">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-5 cursor-pointer"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
        />
      </svg>
    </div>
  </div>
</li>
  
  `;
  todoContainer.insertAdjacentHTML('beforeend', todoElement);
}

// === FETCH API ===
let startIndex = 25;
const todosPerLoad = 5;

document.addEventListener('DOMContentLoaded', async function () {
  // 1. Get data
  const data = await fetchData();
  const todos = data.todos;

  // 2. Add visible todos to the todo list
  const visibleTodos = getVisibleTodos(todos);

  visibleTodos.forEach((t) => {
    const todo = new Todo(t.todo, t.completed, t.id);
    todoList.addTodo(todo);
  });

  getDataFromLocalStorage();

  // 3. Render todo
  renderTodos();

  // 4. Update task number
  updateTaskNumber();

  // 5. Update incomplete task number
  updateIncompleteTaskNumber();

  // 6. Update complete task number
  updateCompleteTaskNumber();
});

function getVisibleTodos(todos) {
  const visibleTodos = todos.slice(startIndex, startIndex + todosPerLoad);
  startIndex = todosPerLoad;
  return visibleTodos;
}

async function fetchData() {
  try {
    isLoadingData = true;
    renderTodos();
    const res = await fetch('https://dummyjson.com/todo');
    if (!res.ok) {
      const err = new Error('Request failed');
      err.status = res.status;
      throw err;
    }
    const data = await res.json();

    return data;
  } catch (err) {
    isError = true;
    if (err.status === 404) {
      errorMessage = 'Data not found';
    } else {
      errorMessage = 'Something went wrong. Please try again';
    }
  } finally {
    isLoadingData = false;
    renderTodos();
  }
}

/* =============================================
      STORAGE 
============================================= */
// const isModalChangeButton = event.target.closest('.modal-change-button');
// if (isModalChangeButton) {
//   newTodoName = modalInput.value;

//   if (!newTodoName) {
//     modalInput.classList.add('border-red-500');
//     return;
//   }

//   modalInput.classList.remove('border-red-500');

//   // 3. Edit
//   selectedEditTodoObject.editTodo(newTodoName);

//   // 4. Render todo
//   renderTodos();

//   // 5. Close Modal
//   closeModal();
// }

//========================================================================

// function updateToggleTodoUI(markTodo, clickedElementTodo, clickedObjectTodo) {
//   const textTodo = clickedElementTodo.querySelector('.text-todo');

//   if (clickedObjectTodo.completed) {
//     // clickedElementTodo.classList.add('bg-[#E8F3F5]');
//     // markTodo.classList.remove('border');
//     // textTodo.classList.add('line-through', 'text-gray-500');
//     //     markTodo.innerHTML = `
//     // <svg
//     //   xmlns="http://www.w3.org/2000/svg"
//     //   viewBox="0 0 24 24"
//     //   fill="#3F9CA1"
//     //   class="size-5 "
//     // >
//     //   <path
//     //     fill-rule="evenodd"
//     //     d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
//     //     clip-rule="evenodd"
//     //   />
//     // </svg>
//     //     `;
//   } else {
//     // clickedElementTodo.classList.remove('bg-[#E8F3F5]');
//     // markTodo.classList.add('border');
//     // markTodo.innerHTML = '';
//     // textTodo.classList.remove('line-through', 'text-gray-500');
//   }
// }
