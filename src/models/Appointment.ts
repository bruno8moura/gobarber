import { uuid } from 'uuidv4';

export default class Appointment {
    id = uuid();

    provider: string;

    date: Date;

    constructor({ provider, date }: Omit<Appointment, 'id'>) {
        this.provider = provider;
        this.date = date;
    }
}
