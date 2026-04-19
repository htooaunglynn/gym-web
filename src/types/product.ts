export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProductInput {
    name: string;
    description: string;
    price: number;
    quantity: number;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}
