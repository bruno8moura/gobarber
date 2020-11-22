import IMailTemplateProvider from '../models/IMailTemplateProvider';

class FakeIMailTemplateProvider implements IMailTemplateProvider {
    public async parse(): Promise<string> {
        return 'Mail template';
    }
}

export default FakeIMailTemplateProvider;
