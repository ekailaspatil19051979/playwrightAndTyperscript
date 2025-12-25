import { request } from 'playwright';

export class DataFixture {
    private apiClient: any;

    constructor(apiClient: any) {
        this.apiClient = apiClient;
    }

    async setupTestData() {
        // Example API calls to set up test data
        await this.createProductCategory();
        await this.createSampleProducts();
    }

    private async createProductCategory() {
        const response = await this.apiClient.post('/api/categories', {
            data: {
                name: 'Test Category',
                description: 'A category for testing purposes'
            }
        });
        return response;
    }

    private async createSampleProducts() {
        const products = [
            { name: 'Test Product 1', price: 100, category: 'Test Category' },
            { name: 'Test Product 2', price: 200, category: 'Test Category' }
        ];

        for (const product of products) {
            await this.apiClient.post('/api/products', { data: product });
        }
    }
}