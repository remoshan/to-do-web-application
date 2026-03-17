import {
  IsString,
  IsOptional,
  MinLength,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class UpdateTodoDto {
  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'Title must be at least 3 characters.' })
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  dueDate?: string;

  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;

  @IsNumber()
  @IsOptional()
  userId?: number;
}
