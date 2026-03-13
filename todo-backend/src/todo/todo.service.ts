import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(Todo)
        private todoRepository: Repository<Todo>,
    ) { }

    findAll(): Promise<Todo[]> {
        return this.todoRepository.find();
    }

    async findOne(id: number): Promise<Todo> {
        const todo = await this.todoRepository.findOne({ where: { id } });
        if (!todo) throw new NotFoundException(`Todo with id ${id} not found.`);
        return todo;
    }

    create(createTodoDto: CreateTodoDto): Promise<Todo> {
        const todo = this.todoRepository.create(createTodoDto);
        return this.todoRepository.save(todo);
    }

    async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
        const todo = await this.findOne(id);
        Object.assign(todo, updateTodoDto);
        return this.todoRepository.save(todo);
    }

    async remove(id: number): Promise<{ message: string }> {
        const todo = await this.findOne(id);
        await this.todoRepository.remove(todo);
        return { message: `Todo with id ${id} deleted successfully.` };
    }
}