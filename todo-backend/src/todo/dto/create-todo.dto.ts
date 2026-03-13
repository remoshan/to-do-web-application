import { IsString, IsNotEmpty, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class CreateTodoDto {
    @IsString()
    @IsNotEmpty({ message: 'Title is required.' })
    @MinLength(3, { message: 'Title must be at least 3 characters.' })
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsNotEmpty({ message: 'Due date is required.' })
    dueDate: string;
}