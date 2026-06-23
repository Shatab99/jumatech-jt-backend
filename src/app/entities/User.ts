import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";


@Entity("users")
@Index(["role"])
export class User {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    type: "varchar",
    length: 255,
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
  })
  password: string;

  @Column({
    type: "varchar",
    length: 50,
    default: "USER",
    nullable: false,
  })
  role: string;

  @Column({
    type: "boolean",
    default: false,
    nullable: false,
  })
  isActive: boolean;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  profileImage?: string;

  @CreateDateColumn({
    type: "timestamp",
  })
  createdAt: Date;

  @Column({
    type: "timestamp",
    nullable: true,
  })
  loggedAt: Date;

  @Column({
    type: "timestamp",
    nullable: true,
  })
  passwordChangedAt: Date;
}

