import { uuid } from 'uuidv4';
import User from '@modules/users/infra/typeorm/entities/User';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IGetUserDTO from '@modules/users/dtos/IGetUserDTO';

export default class FakeUsersRepository implements IUsersRepository {
    users: User[] = [];

    async findById(id: string): Promise<IGetUserDTO | undefined> {
        const foundUser = this.users.find(el => el.id === id);
        if (!foundUser) return undefined;

        return {
            id: foundUser?.id,
            name: foundUser.name,
            email: foundUser.email,
        };
    }

    async save(user: User): Promise<User> {
        const foundIndex = this.users.findIndex(
            foundUser => foundUser.id === user.id,
        );

        this.users[foundIndex] = user;

        return user;
    }

    public async create(data: ICreateUserDTO): Promise<IGetUserDTO> {
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

        return { id: newUser.id, name: newUser.name, email: newUser.email };
    }

    public async findByEmail(email: string): Promise<IGetUserDTO | undefined> {
        const foundUser = this.users.find(el => el.email === email);
        if (!foundUser) return undefined;

        return {
            id: foundUser?.id,
            name: foundUser.name,
            email: foundUser.email,
        };
    }
}
