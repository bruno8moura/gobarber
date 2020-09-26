import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class UserAvatarController {
    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const {
            user: { id },
            file: { filename },
        } = request;

        const service = container.resolve(UpdateUserAvatarService);
        const user = await service.execute({
            userId: id,
            avartarFileName: filename,
        });

        delete user.password;

        return response.json({ user });
    }
}
