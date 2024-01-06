import React, { useState, FormEvent } from 'react';
import { Task, TaskStatus, TaskPriority } from '../../interfaces/interfaces';

type TaskFormProps = {
  onAddTask: (task: Task) => void;
};

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [status, setStatus] = useState<TaskStatus>('Added');
  const [priority, setPriority] = useState<TaskPriority>('Medium');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      status,
      dates: {
        added: new Date().toISOString(),
        started: null,
        completed: null
      },
      priority
    };

    onAddTask(newTask);
    // Reset the form fields
    setTitle('');
    setDescription('');
    setStatus('Added');
    setPriority('Medium');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea 
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
        <option value="Added">Added</option>
        <option value="Started">Started</option>
        <option value="Completed">Completed</option>
      </select>
      <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
