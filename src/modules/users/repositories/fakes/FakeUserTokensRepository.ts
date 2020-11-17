import { uuid } from 'uuidv4';
import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import IUserTokensRepository from '../IUserTokensRepository';

export default class FakeUserTokensRepository implements IUserTokensRepository {
    private tokens: UserToken[] = [];

    public async findByToken(token: string): Promise<UserToken | undefined> {
        return this.tokens.find(user => user.token === token);
    }

    public async generate(userId: string): Promise<UserToken> {
        const userToken = new UserToken();
        Object.assign(userToken, {
            id: uuid(),
            token: uuid(),
            userId,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        this.tokens.push(userToken);

        return userToken;
    }
}
