import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Todo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ default: false })
    isCompleted: boolean;

    @Column({ nullable: true })
    dueDate: string;

    @CreateDateColumn()
    createdAt: Date;
}