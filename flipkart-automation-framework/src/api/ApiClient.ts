export class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async get(endpoint: string, headers: Record<string, string> = {}): Promise<Response> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        });
        this.handleErrors(response);
        return response;
    }

    async post(endpoint: string, body: Record<string, any>, headers: Record<string, string> = {}): Promise<Response> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: JSON.stringify(body),
        });
        this.handleErrors(response);
        return response;
    }

    async put(endpoint: string, body: Record<string, any>, headers: Record<string, string> = {}): Promise<Response> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: JSON.stringify(body),
        });
        this.handleErrors(response);
        return response;
    }

    async delete(endpoint: string, headers: Record<string, string> = {}): Promise<Response> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        });
        this.handleErrors(response);
        return response;
    }

    private handleErrors(response: Response): void {
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
        }
    }
}