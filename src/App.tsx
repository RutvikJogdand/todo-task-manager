import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm/TaskForm';
import { Task, TaskStatus } from './interfaces/interfaces';
import TaskList from './components/TaskList/TaskList';
import Modal from './components/Modal/Modal';
import Navbar from './components/Navbar/Navbar';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

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
    // Opening Edit Modal 
    setEditingTask(task);
  };

  const handleTaskDeleteConfirmation = (task: Task) => {
    // Open Delete Modal:
    setTaskToDelete(task);
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    setEditingTask(null); // Closing modal and reset editing task
  };

  const handleTaskDelete = () => {
    // Confirm Deletion
    if (taskToDelete) {
      setTasks(tasks.filter(task => task.id !== taskToDelete.id));
      setTaskToDelete(null); // Close the confirmation modal
    }
  };

  const closeDeleteModal = () => {
    setTaskToDelete(null);
  };
  
  // Close Edit Modal:
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
    if(destinationStatus === "Added"){
      removedTask.dates.started =  null;
      removedTask.dates.completed = null;
    }
    const newTasks = tasks.map(task => {
      if (task.id === removedTask.id) return removedTask;
      return task;
    });
  
    setTasks(newTasks);
  
  };

  return (
    <>
      <Navbar/>
      <div className='main-container'>
          {editingTask ? (
            <Modal title={'Edit Task'} isOpen={!!editingTask} onClose={closeModal}>
              <TaskForm onAddTask={addTask} onUpdateTask={handleTaskUpdate} task={editingTask} />
            </Modal>
          ) : (
            <TaskForm onAddTask={addTask} />
          )}
        <TaskList 
          tasks={tasks}
          onTaskEditInitiation={handleTaskEditInitiation}
          onTaskDeleteConfirmation={handleTaskDeleteConfirmation} 
          onDragEnd={onDragEnd}
        />
      </div>
      {/* Modal for task deletion confirmation: */}
      {taskToDelete && (
      <Modal isOpen={!!taskToDelete} onClose={closeDeleteModal} title="Confirm Delete">
        <div>
          <p>Are you sure you want to delete this task?</p>
          <button onClick={handleTaskDelete}>Confirm Delete</button>
          <button onClick={closeDeleteModal}>Cancel</button>
        </div>
      </Modal>
)}
    </>
  );
};

export default App;
