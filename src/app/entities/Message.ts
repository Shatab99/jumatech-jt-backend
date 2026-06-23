import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Conversation } from "./Conversation";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  msgId: number;

  @Column()
  conversationId: number;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, { onDelete: "CASCADE" })
  @JoinColumn({ name: "conversationId" })
  conversation: Conversation;

  @Column()
  sender: string; // "customer" or "agent"

  @Column("text")
  text: string;

  @CreateDateColumn()
  createdAt: Date;
}