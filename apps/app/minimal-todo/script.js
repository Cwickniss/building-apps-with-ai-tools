'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#todo-form');
  const list = document.querySelector('#todo-list');
  const input = document.querySelector('#todo-input');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (value) {
      const li = document.createElement('li');
      li.textContent = value;
      list.appendChild(li);
      input.value = '';
    }
  });
}); 