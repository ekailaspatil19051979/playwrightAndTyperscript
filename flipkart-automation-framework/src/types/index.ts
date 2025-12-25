export interface Product {
    id: string;
    name: string;
    price: number;
    rating: number;
    imageUrl: string;
}

export interface Filter {
    category: string;
    brand: string[];
    priceRange: [number, number];
    rating: number;
}

export interface AuthCredentials {
    username: string;
    password: string;
}

export interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
}

export interface TestContext {
    authToken: string;
    userId: string;
    browserContextId: string;
}