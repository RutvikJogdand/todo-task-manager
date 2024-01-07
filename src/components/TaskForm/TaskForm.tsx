import React, { useState, FormEvent, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority } from '../../interfaces/interfaces';
import toast from 'react-hot-toast';

type TaskFormProps = {
  onAddTask: (task: Task) => void;
  onUpdateTask?: (task: Task) => void;
  task?: Task; 
};

const TaskForm: React.FC<TaskFormProps> = ({onAddTask, onUpdateTask, task }) => {
  const [title, setTitle] = useState<string>(task ? task.title : '');
  const [description, setDescription] = useState<string>(task ? task.description : '');
  const [status, setStatus] = useState<TaskStatus>(task ? task.status : 'Added');
  const [priority, setPriority] = useState<TaskPriority>(task ? task.priority : 'Medium');

  useEffect(() => {
    // Update form fields if the task prop changes
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setPriority(task.priority);
    }
  }, [task]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return toast.error('Please enter title.');;

    const formTask: Task = {
      id: task ? task.id : Date.now().toString(),
      title,
      description,
      status,
      dates: task ? task.dates : { added: new Date().toISOString(), started: status === "Started" || status === "Completed" ? new Date().toISOString() :  null, completed: status === "Completed" ? new Date().toISOString() : null },
      priority
    };
  
    task ? onUpdateTask?.(formTask) : onAddTask(formTask);
  
    !task && toast.success('Task Added');
    if (!task) {
      // Reset the form fields only if we're adding a new task
      setTitle('');
      setDescription('');
      setStatus('Added');
      setPriority('Medium');
    }
  };

  return (
    <form className='form-control p-4' onSubmit={handleSubmit}>
      <label className="form-label m-2">Title</label>
      <input 
        type="text"
        placeholder="Title"
        value={title}
        className='form-control m-2'
        onChange={(e) => setTitle(e.target.value)}
      />
      <label className="form-label m-2">Description</label>
      <textarea 
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className='form-control m-2'
      />
      <label className="form-label m-2">Select Task Status</label>
      <select className='form-control m-2' value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
        <option value="Added">Added</option>
        <option value="Started">Started</option>
        <option value="Completed">Completed</option>
      </select>
      <label className="form-label m-2">Select Task Priority</label>
      <select className='form-control m-2' value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <button className='btn btn-primary m-2' type="submit">  {task ? 'Update Task' : 'Add Task'}</button>
    </form>
  );
};

export default TaskForm;
