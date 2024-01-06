import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm/TaskForm';
import { Task, TaskStatus } from './interfaces/interfaces';
import TaskList from './components/TaskList/TaskList';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

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

  const handleTaskUpdate = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          status: newStatus,
          dates: {
            ...task.dates,
            started: newStatus === 'Started' ? new Date().toISOString() : task.dates.started,
            completed: newStatus === 'Completed' ? new Date().toISOString() : task.dates.completed
          }
        };
      }
      return task;
    }));
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
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

    const [removedTask] = startTasks.splice(sourceIndex, 1);
    finishTasks.splice(destIndex, 0, removedTask);
    
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
      <TaskForm onAddTask={addTask} />
      <TaskList 
        tasks={tasks}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
        onDragEnd={onDragEnd}
      />
    </div>
  );
};

export default App;
