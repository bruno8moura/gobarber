import path from 'path';
import fs from 'fs';
import uploadConfig from '@config/upload.files';
import IStorageProvider from '../models/IStorageProvider';

export default class DiskStorageProvider implements IStorageProvider {
    public async saveFile(file: string): Promise<string> {
        await fs.promises.rename(
            path.resolve(uploadConfig.tmpFolder, file),
            path.resolve(uploadConfig.uploadsFolder, file),
        );

        return file;
    }

    public async deleteFile(file: string): Promise<void> {
        const filePath = path.resolve(uploadConfig.uploadsFolder, file);

        try {
            await fs.promises.stat(filePath);
        } catch {
            // como não vou utilizar o err para nada, então eu omito ele.
            // eslint-disable-next-line no-useless-return
            return; // Não encontrou o arquivo, então encerra a função aqui.
        }

        await fs.promises.unlink(filePath);
    }
}
