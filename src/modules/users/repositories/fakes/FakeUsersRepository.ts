import { uuid } from 'uuidv4';
import User from '@modules/users/infra/typeorm/entities/User';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

export default class FakeUsersRepository implements IUsersRepository {
    users: User[] = [];

    async findById(id: string): Promise<User | undefined> {
        const foundUser = this.users.find(el => el.id === id);
        if (!foundUser) return undefined;

        return foundUser;
    }

    async save(user: User): Promise<User> {
        const foundIndex = this.users.findIndex(
            foundUser => foundUser.id === user.id,
        );

        this.users[foundIndex] = user;

        return user;
    }

    public async create(data: ICreateUserDTO): Promise<User> {
        const newUser = new User();
        const createdAt = new Date();
        Object.assign(
            newUser,
            {
                id: uuid(),
                createdAt,
                updatedAt: createdAt,
            },
            data,
        );

        this.users.push(newUser);

        return newUser;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const foundUser = this.users.find(el => el.email === email);
        if (!foundUser) return undefined;

        return foundUser;
    }
}
