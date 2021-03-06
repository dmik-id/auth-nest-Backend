import { ApiProperty } from '@nestjs/swagger';
import { Note } from 'src/notes/models/note';
import { Role } from 'src/roles/roles.model';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';

interface UserCreationAttrs{
    email : string,
    password : string
}

@Entity()
export class User{

    @ApiProperty({example: '1', description: 'id'})    
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({example: 'tron@gmail.ru', description: 'email'})    
    @Column()
    email: string;

    @ApiProperty({example: '123123123', description: 'password'})    
    @Column()
    password: string;

    @ManyToMany(() => Role)
    @JoinTable()
    UserRoles : Role[]

    @OneToMany(() => Note, note => note.id)
    @JoinTable()
    UserNote : Note[]





}