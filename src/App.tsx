import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm/TaskForm';
import { Task } from './interfaces/interfaces';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask: Task) => {
    setTasks([...tasks, newTask]);
  };

  return (
    <div>
      <TaskForm onAddTask={addTask} />
    </div>
  );
};

export default App;
