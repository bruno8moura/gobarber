import { getRepository } from 'typeorm';
import User from '../models/User';

interface Request {
    name: string;
    email: string;
    password: string;
}

class CreateUserService {
    public async execute({ name, email, password }: Request): Promise<User> {
        const usersRepository = getRepository(User);

        const checkUsersExists = await usersRepository.findOne({
            where: { email },
        });

        if (checkUsersExists) {
            throw Error('Email address already used.');
        }

        const newUser = usersRepository.create({
            name,
            email,
            password,
        });

        await usersRepository.save(newUser);

        return newUser;
    }
}

export default CreateUserService;
