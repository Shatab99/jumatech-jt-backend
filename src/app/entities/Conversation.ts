import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Message } from "./Message";

@Entity()
export class Conversation {
    @PrimaryGeneratedColumn()
    conversationId: number;

    @Column()
    customerName: string;

    @Column({ default: "open" }) // open, closed, pending
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Message, (message) => message.conversation)
    messages: Message[];
}