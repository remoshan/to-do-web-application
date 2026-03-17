import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../user.model';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzBadgeModule } from 'ng-zorro-antd/badge';

@Component({
  selector: 'app-users',
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
    NzTagModule,
    NzPopconfirmModule,
    NzSpinModule,
    NzTypographyModule,
    NzDividerModule,
    NzIconModule,
    NzSpaceModule,
    NzCardModule,
    NzStatisticModule,
    NzGridModule,
    NzBadgeModule,
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [NzMessageService],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading = false;

  isModalVisible = false;
  isEditMode = false;
  editingUser: User | null = null;

  userForm!: FormGroup;

  constructor(
    private userService: UserService,
    private ngZone: NgZone,
    private fb: FormBuilder,
    private message: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
  }

  initForm(): void {
    this.userForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(2)]],
      email: [null, [Validators.required, Validators.email]],
    });
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          this.users = data;
          this.loading = false;
        });
      },
      error: () => {
        this.ngZone.run(() => {
          this.message.error('Failed to load users.');
          this.loading = false;
        });
      },
    });
  }

  get totalUsers(): number {
    return this.users.length;
  }
  get totalTodos(): number {
    return this.users.reduce((sum, u) => sum + (u.todos?.length || 0), 0);
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.editingUser = null;
    this.userForm.reset();
    this.isModalVisible = true;
  }

  openEditModal(user: User): void {
    this.isEditMode = true;
    this.editingUser = user;
    this.userForm.setValue({ name: user.name, email: user.email });
    this.isModalVisible = true;
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.userForm.reset();
  }

  handleSubmit(): void {
    if (this.userForm.invalid) {
      Object.values(this.userForm.controls).forEach((control) => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      return;
    }

    const { name, email } = this.userForm.value;

    if (this.isEditMode && this.editingUser) {
      this.userService.update(this.editingUser.id, { name, email }).subscribe({
        next: (updated) => {
          this.ngZone.run(() => {
            const index = this.users.findIndex((u) => u.id === this.editingUser!.id);
            this.users[index] = updated;
            this.users = [...this.users];
            this.isModalVisible = false;
            this.message.success('User updated successfully!');
          });
        },
        error: () => this.message.error('Failed to update user. Email may already be in use.'),
      });
    } else {
      this.userService.create({ name, email }).subscribe({
        next: (user) => {
          this.ngZone.run(() => {
            this.users = [...this.users, user];
            this.isModalVisible = false;
            this.message.success('User created successfully!');
          });
        },
        error: () => this.message.error('Failed to create user. Email may already be in use.'),
      });
    }
  }

  deleteUser(id: number): void {
    this.userService.delete(id).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.users = this.users.filter((u) => u.id !== id);
          this.message.success('User deleted successfully!');
        });
      },
      error: () => this.message.error('Failed to delete user.'),
    });
  }
}
 