import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm/TaskForm';
import { Task, TaskStatus } from './interfaces/interfaces';
import TaskList from './components/TaskList/TaskList';
import Modal from './components/Modal/Modal';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

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

  const handleTaskEditInitiation = (task: Task) => {
    // Opening modal 
    setEditingTask(task);
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    setEditingTask(null); // Closing modal and reset editing task
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const closeModal = () => {
    setEditingTask(null);
  };

  // On dragging a task
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
  
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;
    const sourceStatus = result.source.droppableId as TaskStatus;
    const destinationStatus = result.destination.droppableId as TaskStatus;
  
    // if (sourceStatus === 'Added' && destinationStatus !== 'Started') return;
    // if (sourceStatus === 'Started' && destinationStatus !== 'Completed') return;
  
    const startTasks = tasks.filter(task => task.status === sourceStatus);
    const finishTasks = sourceStatus === destinationStatus ? startTasks : tasks.filter(task => task.status === destinationStatus);

    const [removedTask] = startTasks.splice(sourceIndex, 1); //Task being moved
    finishTasks.splice(destIndex, 0, removedTask); //Insert task being moved into the array of updated task with updated status
    
    removedTask.status = destinationStatus;
    if(destinationStatus === 'Completed'){
      removedTask.dates.completed = new Date().toISOString(); 
    }
    if(destinationStatus === 'Started'){
      removedTask.dates.started =  new Date().toISOString();
      removedTask.dates.completed = null;
    }
    const newTasks = tasks.map(task => {
      if (task.id === removedTask.id) return removedTask;
      return task;
    });
  
    setTasks(newTasks);
  
  };

  return (
    <div>
        {editingTask ? (
           <Modal isOpen={!!editingTask} onClose={closeModal}>
            <TaskForm onAddTask={addTask} onUpdateTask={handleTaskUpdate} task={editingTask} />
          </Modal>
        ) : (
          <TaskForm onAddTask={addTask} />
        )}
      <TaskList 
        tasks={tasks}
        onTaskEditInitiation={handleTaskEditInitiation}
        onTaskDelete={handleTaskDelete}
        onDragEnd={onDragEnd}
      />
    </div>
  );
};

export default App;
