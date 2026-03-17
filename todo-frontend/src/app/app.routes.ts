import { Routes } from '@angular/router';
import { TodosComponent } from './todos/todos.component';
import { UsersComponent } from './users/users.component';

export const routes: Routes = [
  { path: '', redirectTo: 'todos', pathMatch: 'full' },
  { path: 'todos', component: TodosComponent },
  { path: 'users', component: UsersComponent },
];
