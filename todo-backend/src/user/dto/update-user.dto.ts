import { IsString, IsOptional, IsEmail, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(2, { message: 'Name must be at least 2 characters.' })
  name?: string;

  @IsEmail({}, { message: 'Please provide a valid email address.' })
  @IsOptional()
  email?: string;
}
