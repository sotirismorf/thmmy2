import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm'

import { User } from './User'
import { Comment } from './comment.entity'

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn({ type: 'date' })
  created: Date

  @Column({ unique: true })
  body: string

  @ManyToOne(() => User, user => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: User

  @OneToMany(() => Comment, comment => comment.post)
  //@JoinColumn({ name: 'post_id' })
  comments: Comment[]
}
