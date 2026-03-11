import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from './todo.model';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  todos: Todo[] = [];

  newTitle = '';
  newDescription = '';
  newDueDate = '';
  showForm = false;

  titleError = '';
  dueDateError = '';

  editingId: number | null = null;
  editTitle = '';
  editDescription = '';
  editDueDate = '';
  editTitleError = '';
  editDueDateError = '';

  errorMessage = '';
  loading = false;

  constructor(private todoService: TodoService, private ngZone: NgZone) { }

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.loading = true;
    this.todoService.getAll().subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          this.todos = data;
          this.loading = false;
        });
      },
      error: () => {
        this.ngZone.run(() => {
          this.errorMessage = 'Failed to load todos. Is the backend running?';
          this.loading = false;
        });
      }
    });
  }

  validateAdd(): boolean {
    let valid = true;
    this.titleError = '';
    this.dueDateError = '';

    if (!this.newTitle.trim()) {
      this.titleError = 'Title is required.';
      valid = false;
    } else if (this.newTitle.trim().length < 3) {
      this.titleError = 'Title must be at least 3 characters.';
      valid = false;
    }

    if (!this.newDueDate) {
      this.dueDateError = 'Due date is required.';
      valid = false;
    } else if (new Date(this.newDueDate) < new Date(new Date().toDateString())) {
      this.dueDateError = 'Due date cannot be in the past.';
      valid = false;
    }

    return valid;
  }

  addTodo(): void {
    if (!this.validateAdd()) return;
    this.todoService.create({
      title: this.newTitle.trim(),
      description: this.newDescription.trim(),
      dueDate: this.newDueDate
    }).subscribe({
      next: (todo) => {
        this.ngZone.run(() => {
          this.todos.push(todo);
          this.newTitle = '';
          this.newDescription = '';
          this.newDueDate = '';
          this.titleError = '';
          this.dueDateError = '';
          this.showForm = false;
        });
      },
      error: () => {
        this.errorMessage = 'Failed to create todo.';
      }
    });
  }

  toggleComplete(todo: Todo): void {
    this.todoService.update(todo.id, { isCompleted: !todo.isCompleted }).subscribe({
      next: (updated) => {
        this.ngZone.run(() => {
          const index = this.todos.findIndex(t => t.id === todo.id);
          this.todos[index] = updated;
        });
      },
      error: () => {
        this.errorMessage = 'Failed to update todo.';
      }
    });
  }

  startEdit(todo: Todo): void {
    this.editingId = todo.id;
    this.editTitle = todo.title;
    this.editDescription = todo.description;
    this.editDueDate = todo.dueDate;
    this.editTitleError = '';
    this.editDueDateError = '';
  }

  validateEdit(): boolean {
    let valid = true;
    this.editTitleError = '';
    this.editDueDateError = '';

    if (!this.editTitle.trim()) {
      this.editTitleError = 'Title is required.';
      valid = false;
    } else if (this.editTitle.trim().length < 3) {
      this.editTitleError = 'Title must be at least 3 characters.';
      valid = false;
    }

    if (!this.editDueDate) {
      this.editDueDateError = 'Due date is required.';
      valid = false;
    }

    return valid;
  }

  saveEdit(todo: Todo): void {
    if (!this.validateEdit()) return;
    this.todoService.update(todo.id, {
      title: this.editTitle.trim(),
      description: this.editDescription.trim(),
      dueDate: this.editDueDate
    }).subscribe({
      next: (updated) => {
        this.ngZone.run(() => {
          const index = this.todos.findIndex(t => t.id === todo.id);
          this.todos[index] = updated;
          this.editingId = null;
        });
      },
      error: () => {
        this.errorMessage = 'Failed to update todo.';
      }
    });
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  deleteTodo(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.todoService.delete(id).subscribe({
        next: () => {
          this.ngZone.run(() => {
            this.todos = this.todos.filter(t => t.id !== id);
          });
        },
        error: () => {
          this.errorMessage = 'Failed to delete todo.';
        }
      });
    }
  }
}