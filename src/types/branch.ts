export interface Branch {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBranchInput {
    name: string;
    address: string;
    phone: string;
    email: string;
}

export interface UpdateBranchInput extends Partial<CreateBranchInput> {}
