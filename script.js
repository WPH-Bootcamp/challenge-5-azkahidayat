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

  removeTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
  }

  getAll() {
    return this.todos;
  }
}

class Todo {
  constructor(todo, completed, id) {
    this.todo = todo;
    this.completed = completed ? complete : false;
    this.id = id ? id : Date.now() + Math.random().toString(10).slice(2);
  }

  toggleTodo() {
    this.completed = !this.completed;
  }

  editTodo(newTodo) {
    this.todo = newTodo;
  }
}

const todoList = new TodoList();

// === ADD TODO ===
const todoInput = document.querySelector('#input-todo');
const todoAddButton = document.querySelector('#todo-add-button');
const errorText = document.querySelector('#error-text');
const todoContainer = document.querySelector('#todo-container');

let newTodoUserInput = '';

todoInput.addEventListener('input', function (event) {
  newTodoUserInput = todoInput.value.trim();
});

todoInput.addEventListener('keydown', function (event) {
  event.key === 'Enter' && handleAddTodo();
});

todoAddButton.addEventListener('click', function () {
  handleAddTodo();
});

function showError() {
  errorText.classList.remove('invisible');
  todoInput.classList.remove('border-[#3F9CA1]');
  todoInput.classList.add('border-red-500');
}

function hideError() {
  errorText.classList.add('invisible');
  todoInput.classList.remove('border-red-500');
}

function updateUI(todo, id) {
  const todoElement = `
  <li class="todo flex justify-between items-center px-1 py-2" data-id=${id}>
  <div class="toggle-todo flex gap-2 items-center w-full cursor-pointer">
    <div class="mark-todo size-4 flex justify-center items-center md:size-5 rounded-md border cursor-pointer"></div>
    <p class="text-todo md:text-lg capitalize pointer-events-none">${todo}</p>
  </div>
  <div class="flex gap-2">
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
</li>
  
  `;
  todoContainer.insertAdjacentHTML('beforeend', todoElement);
}

function handleAddTodo() {
  if (!newTodoUserInput) {
    showError();
    return;
  }

  hideError();

  const todo = new Todo(newTodoUserInput);
  todoList.addTodo(todo);

  updateUI(todo.todo, todo.id);

  todoInput.value = '';
}

document.addEventListener('click', function (event) {
  // === TOGGLE TODO ===
  const isToggleTodo = event.target.closest('.toggle-todo');
  if (isToggleTodo) {
    const markTodo = isToggleTodo.querySelector('.mark-todo');
    // 1. Access id
    const clickedElementTodo = isToggleTodo.closest('.todo');
    const idTodo = clickedElementTodo.dataset.id;

    // 2. Find todo in object todos with the same id
    const clickedObjectTodo = todoList.todos.find((todo) => todo.id === idTodo);

    // 3. Toggle
    clickedObjectTodo.toggleTodo();

    // 4. Update UI only the clicked todo
    updateToggleTodoUI(markTodo, clickedElementTodo, clickedObjectTodo);
  }
});

function updateToggleTodoUI(markTodo, clickedElementTodo, clickedObjectTodo) {
  const textTodo = clickedElementTodo.querySelector('.text-todo');

  if (clickedObjectTodo.completed) {
    clickedElementTodo.classList.add('bg-[#E8F3F5]');
    markTodo.classList.remove('border');
    textTodo.classList.add('line-through', 'text-gray-500');

    markTodo.innerHTML = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="#3F9CA1"
  class="size-5"
>
  <path
    fill-rule="evenodd"
    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
    clip-rule="evenodd"
  />
</svg>
      `;
  } else {
    clickedElementTodo.classList.remove('bg-[#E8F3F5]');
    markTodo.classList.add('border');
    textTodo.classList.remove('line-through', 'text-gray-500');
    markTodo.innerHTML = '';
  }
}

// === DELETE TODO ===
// === EDIT TODO ===

// document.addEventListener('DOMContentLoaded', async function () {
//   const data = await fetchData();
//   const todos = data.todos;
//   const todosList = new TodoList();

//   todos.forEach((t) => {
//     const todo = new Todo(t.id, t.todo, t.completed);
//     todosList.addTodo(todo);
//   });

//   console.log(todosList.getAll());
// });

// async function fetchData() {
//   try {
//     const res = await fetch('https://dummyjson.com/todo');
//     if (!res.ok) {
//       throw new Error(`Status: ${res.status}`);
//     }
//     const data = await res.json();

//     return data;
//   } catch (err) {
//     return err;
//   }
// }
