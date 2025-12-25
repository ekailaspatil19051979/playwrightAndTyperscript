import { ApiClient } from '../ApiClient';

export class AuthApi {
    private client: ApiClient;

    constructor() {
        this.client = new ApiClient();
    }

    async login(username: string, password: string): Promise<any> {
        const response = await this.client.post('/auth/login', {
            username,
            password
        });
        return response.data;
    }

    async getToken(): Promise<string> {
        const response = await this.client.get('/auth/token');
        return response.data.token;
    }

    async logout(): Promise<void> {
        await this.client.post('/auth/logout');
    }
}