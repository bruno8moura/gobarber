import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const tmpDirectory = path.resolve(__dirname, '..', '..', 'tmp');

export default {
    directory: tmpDirectory,
    storage: multer.diskStorage({
        destination: tmpDirectory,
        filename(request, file, callback) {
            const fileHash = crypto.randomBytes(10).toString('hex');
            const fileName = `${fileHash}-${file.originalname}`;

            callback(null, fileName);
        },
    }),
};
