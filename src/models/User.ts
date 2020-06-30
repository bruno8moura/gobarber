import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export default class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column(/* varchar is parttern */)
    name: string;

    @Column(/* varchar is parttern */)
    password: string;

    @Column(/* varchar is parttern */)
    email: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column(/* varchar is parttern */)
    avatar: string;
}
