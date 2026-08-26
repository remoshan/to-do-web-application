import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TodoService } from './todo.service';
import { Todo } from './todo.model';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzBadgeModule } from 'ng-zorro-antd/badge';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzDatePickerModule,
    NzTagModule,
    NzPopconfirmModule,
    NzSpinModule,
    NzLayoutModule,
    NzTypographyModule,
    NzDividerModule,
    NzCheckboxModule,
    NzIconModule,
    NzSpaceModule,
    NzCardModule,
    NzStatisticModule,
    NzGridModule,
    NzBadgeModule,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  providers: [NzMessageService],
})
export class App implements OnInit {
  todos: Todo[] = [];
  loading = false;

  isModalVisible = false;
  isEditMode = false;
  editingTodo: Todo | null = null;

  todoForm!: FormGroup;

  constructor(
    private todoService: TodoService,
    private ngZone: NgZone,
    private fb: FormBuilder,
    private message: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadTodos();
  }

  initForm(): void {
    this.todoForm = this.fb.group({
      title: [null, [Validators.required, Validators.minLength(3)]],
      description: [null],
      dueDate: [null, [Validators.required]],
    });
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
          this.message.error('Failed to load todos. Is the backend running?');
          this.loading = false;
        });
      },
    });
  }

  get totalCount(): number {
    return this.todos.length;
  }
  get completedCount(): number {
    return this.todos.filter((t) => t.isCompleted).length;
  }
  get pendingCount(): number {
    return this.todos.filter((t) => !t.isCompleted).length;
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.editingTodo = null;
    this.todoForm.reset();
    this.isModalVisible = true;
  }

  openEditModal(todo: Todo): void {
    this.isEditMode = true;
    this.editingTodo = todo;
    this.todoForm.setValue({
      title: todo.title,
      description: todo.description || null,
      dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
    });
    this.isModalVisible = true;
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.todoForm.reset();
  }

  handleSubmit(): void {
    if (this.todoForm.invalid) {
      Object.values(this.todoForm.controls).forEach((control) => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      return;
    }

    const { title, description, dueDate } = this.todoForm.value;
    const formattedDate = dueDate instanceof Date ? dueDate.toISOString().split('T')[0] : dueDate;

    if (this.isEditMode && this.editingTodo) {
      this.todoService
        .update(this.editingTodo.id, { title, description, dueDate: formattedDate })
        .subscribe({
          next: (updated) => {
            this.ngZone.run(() => {
              const index = this.todos.findIndex((t) => t.id === this.editingTodo!.id);
              this.todos[index] = updated;
              this.todos = [...this.todos];
              this.isModalVisible = false;
              this.message.success('Task updated successfully!');
            });
          },
          error: () => this.message.error('Failed to update task.'),
        });
    } else {
      this.todoService.create({ title, description, dueDate: formattedDate }).subscribe({
        next: (todo) => {
          this.ngZone.run(() => {
            this.todos = [...this.todos, todo];
            this.isModalVisible = false;
            this.message.success('Task created successfully!');
          });
        },
        error: () => this.message.error('Failed to create task.'),
      });
    }
  }

  toggleComplete(todo: Todo): void {
    this.todoService.update(todo.id, { isCompleted: !todo.isCompleted }).subscribe({
      next: (updated) => {
        this.ngZone.run(() => {
          const index = this.todos.findIndex((t) => t.id === todo.id);
          this.todos[index] = updated;
          this.todos = [...this.todos];
          this.message.success(
            updated.isCompleted ? 'Task marked as complete!' : 'Task marked as incomplete.',
          );
        });
      },
      error: () => this.message.error('Failed to update task.'),
    });
  }

  deleteTodo(id: number): void {
    this.todoService.delete(id).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.todos = this.todos.filter((t) => t.id !== id);
          this.message.success('Task deleted successfully!');
        });
      },
      error: () => this.message.error('Failed to delete task.'),
    });
  }

  isOverdue(dueDate: string): boolean {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date(new Date().toDateString());
  }

  disablePastDates = (current: Date): boolean => {
    return current < new Date(new Date().toDateString());
  };
}
