import { getRepository, Repository } from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

export default class UsersRepository implements IUsersRepository {
    private ormRepository: Repository<User>;

    constructor() {
        this.ormRepository = getRepository(User);
    }

    async findById(id: string): Promise<User | undefined> {
        const foundUser = await this.ormRepository.findOne(id);

        return foundUser;
    }

    async save(user: User): Promise<User> {
        return this.ormRepository.save(user);
    }

    public async create(data: ICreateUserDTO): Promise<User> {
        const newUser = this.ormRepository.create(data);
        await this.ormRepository.save(newUser);

        return newUser;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const foundUser = await this.ormRepository.findOne({
            where: { email },
        });

        return foundUser;
    }
}
