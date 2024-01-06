export type TaskStatus = 'Added' | 'Started' | 'Completed';
export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dates: {
    added: string | null;
    started: string | null;
    completed: string | null;
  };
  priority: TaskPriority;
}
