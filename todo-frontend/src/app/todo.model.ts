import { User } from './user.model';

export interface Todo {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  dueDate: string;
  userId?: number;
  user?: User;
}
