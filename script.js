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
  constructor(id, todo, completed) {
    this.id = id;
    this.todo = todo;
    this.completed = completed;
  }

  toggleTodo() {
    this.completed = !this.completed;
  }

  editTodo(newTodo) {
    this.todo = newTodo;
  }
}

document.addEventListener('DOMContentLoaded', async function () {
  const data = await fetchData();
  const todos = data.todos;
  const todosList = new TodoList();

  todos.forEach((t) => {
    const todo = new Todo(t.id, t.todo, t.completed);
    todosList.addTodo(todo);
  });

  console.log(todosList.getAll());
});

async function fetchData() {
  try {
    const res = await fetch('https://dummyjson.com/todo');
    if (!res.ok) {
      throw new Error(`Status: ${res.status}`);
    }
    const data = await res.json();

    return data;
  } catch (err) {
    return err;
  }
}
