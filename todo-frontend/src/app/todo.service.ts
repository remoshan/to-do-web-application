import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from './todo.model';

@Injectable({
    providedIn: 'root'
})
export class TodoService {
    private apiUrl = 'http://localhost:3000/todos';

    constructor(private http: HttpClient) { }

    getAll(): Observable<Todo[]> {
        return this.http.get<Todo[]>(this.apiUrl);
    }

    create(todo: { title: string; description: string; dueDate: string }): Observable<Todo> {
        return this.http.post<Todo>(this.apiUrl, todo);
    }

    update(id: number, changes: Partial<Todo>): Observable<Todo> {
        return this.http.patch<Todo>(`${this.apiUrl}/${id}`, changes);
    }

    delete(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
    }
}