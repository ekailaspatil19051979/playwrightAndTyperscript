export const fetchProductDetails = async (productId: string, apiClient: any) => {
    const response = await apiClient.get(`/products/${productId}`);
    return response.data;
};

export const searchProducts = async (query: string, apiClient: any) => {
    const response = await apiClient.get(`/products/search`, {
        params: { q: query }
    });
    return response.data;
};