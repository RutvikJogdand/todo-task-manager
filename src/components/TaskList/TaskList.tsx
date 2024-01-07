import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../../interfaces/interfaces';
import './TaskList.css'

type TaskListProps = {
  tasks: Task[];
  // onTaskUpdate: (taskId: string, newStatus: Task['status']) => void;
  onTaskEditInitiation: (task: Task) => void;
  onTaskDeleteConfirmation: (task: Task) => void;
  onDragEnd: (result: any) => void; 
};

const TaskList: React.FC<TaskListProps> = ({ tasks,  onTaskEditInitiation, onTaskDeleteConfirmation, onDragEnd }) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className='tasks-box d-flex'>
        {['Added', 'Started', 'Completed'].map((status, index) => (
            <div className='task-card card m-2' key={uuidv4()}>
                <Droppable droppableId={status}>
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                    <h3 className='status'>{status}</h3>
                    {/* Filter tasks based on current status */}
                    {tasks.filter(task => task.status === status).map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                            <div 
                            ref={provided.innerRef} 
                            {...provided.draggableProps} 
                            {...provided.dragHandleProps}
                            className='card m-2'
                            >
                            <h4 className='card-header'>{task.title} <span className={task.priority === 'Low' ? 'badge bg-primary' : task.priority === 'Medium' ? 'badge bg-warning text-dark' : 'badge bg-danger' }>{task.priority} Priority</span></h4>
                            <div className='card-body'>
                              <div className='d-flex flex-wrap'>
                              <div className='date-box'><b> Added on: </b> <br/> {task.dates.added && new Date(task.dates.added).toDateString()} </div> 
                              <div className='date-box'> <b> Started on: </b> <br/> {task.dates.started && task.dates.started ? new Date(task.dates.started).toDateString(): 'Not started yet'} </div> 
                              <div className='date-box'> <b> Completed on: </b> <br/> {task.dates.completed && task.dates.completed ? new Date(task.dates.completed).toDateString(): 'Not completed yet'}  </div> 
                              </div>
                              <div className='card-body'>
                                {task.description ? <p>{task.description}</p> : <p>No description provided.</p>}
                              </div>
                              {/* <button onClick={() => onTaskUpdate(task.id, task.status)}>Update</button> */}
                              <button onClick={() => onTaskEditInitiation(task)}>Edit</button>
                              <button onClick={() => onTaskDeleteConfirmation(task)}>Delete</button>
                            </div>
                            </div>
                        )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                    </div>
                )}
                </Droppable>
            </div>
        ))}
    </div>
    </DragDropContext>
  );
};

export default TaskList;
