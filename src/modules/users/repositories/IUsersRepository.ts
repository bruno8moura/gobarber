import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IGetUserDTO from '../dtos/IGetUserDTO';
import User from '../infra/typeorm/entities/User';

export default interface IUsersRepository {
    findById(id: string): Promise<IGetUserDTO | undefined>;
    findByEmail(email: string): Promise<IGetUserDTO | undefined>;
    create(data: ICreateUserDTO): Promise<IGetUserDTO>;
    save(user: User): Promise<User>;
}
