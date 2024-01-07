import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../../interfaces/interfaces';
import './TaskList.css'

type TaskListProps = {
  tasks: Task[];
  // onTaskUpdate: (taskId: string, newStatus: Task['status']) => void;
  onTaskEditInitiation: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onDragEnd: (result: any) => void; 
};

const TaskList: React.FC<TaskListProps> = ({ tasks,  onTaskEditInitiation, onTaskDelete, onDragEnd }) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className='tasks-box d-flex'>
        {['Added', 'Started', 'Completed'].map((status, index) => (
            <div className='task-card card m-2' key={uuidv4()}>
                <Droppable droppableId={status}>
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                    <h3>{status}</h3>
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
                            <h4 className='card-header'>{task.title}</h4>
                            {task.description && <p>{task.description}</p>}
                            {/* <button onClick={() => onTaskUpdate(task.id, task.status)}>Update</button> */}
                            <button onClick={() => onTaskEditInitiation(task)}>Edit</button>
                            <button onClick={() => onTaskDelete(task.id)}>Delete</button>
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
