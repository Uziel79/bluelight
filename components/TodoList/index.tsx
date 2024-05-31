'use client'

import { useState } from 'react';
import { addTodo, saveTodo, deleteTodo, toggleComplete } from './actions';

interface TODO {
  id: string;
  title: string;
  task: string;
  user_id: string | null | undefined;
  color: string | null | undefined;
  is_complete: boolean | null | undefined;
}

export default function TodoList({ initialTodos }: { initialTodos: TODO[] }) {
  const [todos, setTodos] = useState(initialTodos);
  const [newTitle, setNewTitle] = useState('');
  const [newTask, setNewTask] = useState('');
  const [color, setColor] = useState<undefined | null | string>(null);
  const [isComplete, setIsComplete] = useState<undefined | null | boolean>(null);
  const [editing, setEditing] = useState<null | string>(null);

  async function handleAddTodo() {
    if (newTitle && newTask.trim().length) {
      const task = await addTodo({ title: newTitle, task: newTask, color });

      if (task) {
        setTodos([task, ...todos]);
      }

      setNewTitle('');
      setNewTask('');
      setColor(null);
      setIsComplete(null);
    }
  }

  async function handleEditTodo(id: string) {
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
      setNewTitle(todo.title);
      setNewTask(todo.task);
      setColor(todo.color);
      setIsComplete(todo.is_complete);
      setEditing(id);
    }
  }

  async function handleSaveEdit() {
    if (newTitle && newTask.trim().length && editing) {
      const task = await saveTodo({ id: editing, title: newTitle, task: newTask, color, is_complete: isComplete })

      if (task) {
        setTodos(todos.map((todo) => (todo.id === editing ? task : todo)));
        setNewTitle('');
        setNewTask('');
        setColor(null);
        setIsComplete(null);
        setEditing(null);
      }
    }
  }

  async function handleDeleteTodo(id: string) {
    try {
      await deleteTodo({ id });
      setTodos(todos.filter((x) => x.id !== id));
    } catch (error) {
      console.log('error', error);
    }
  }

  async function handleToggleComplete(id: string) {
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
      const updatedTodo = await toggleComplete(todo);

      if (updatedTodo) {
        setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
      }
    }
  }

  return (
    <div className="p-4">
      <input
        type="text"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder="New title"
        className="p-2 bg-neutral-900 border border-neutral-800 rounded mb-2 w-full"
      />
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="New task"
        className="p-2 bg-neutral-900 border border-neutral-800 rounded mb-2 w-full"
      />
      <div className="flex items-center">
        <label className="text-white mb-1 mr-2">Color:</label>
        <input
          type="color"
          value={color || ''}
          onChange={(e) => setColor(e.target.value)}
          className="p-0 bg-neutral-900 border border-neutral-800 rounded mb-2 w-[30px] h-[34px]"
        />
      </div>
      <button onClick={editing ? handleSaveEdit : handleAddTodo} className={`p-2 text-white rounded mb-2 w-full ${editing ? 'bg-blue-500' : 'bg-green-500'}`}>
        {editing ? 'Save' : 'Add'}
      </button>
      <ul className="list-none pl-0">
        {todos.map((todo) => (
          <li key={todo.id} className={`mb-2 p-4 ${todo.color ? `bg-[${todo.color}]` : 'bg-neutral-900'} rounded-lg border border-neutral-800`}>
            <span className="text-lg text-white font-bold block mb-2">
              {todo.title}
            </span>
            <p className="mb-2 text-white">{todo.task}</p>
            <div className="flex space-x-2">
            <button onClick={() => handleToggleComplete(todo.id)} className={`py-1 px-4 text-white rounded ${todo.is_complete ? 'bg-green-500' : 'bg-gray-500'}`}>
              {todo.is_complete ? 'Completed' : 'Mark as Complete'}
            </button>
              <button onClick={() => handleEditTodo(todo.id)} className="py-1 px-4 bg-yellow-500 text-white rounded">Edit</button>
              <button onClick={() => handleDeleteTodo(todo.id)} className="py-1 px-4 bg-red-500 text-white rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
