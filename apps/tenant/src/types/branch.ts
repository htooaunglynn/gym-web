export interface Branch {
    id: string;
    name: string;
    description?: string;
    city?: string;
    township?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBranchInput {
    name: string;
    description?: string;
    city?: string;
    township?: string;
}

export interface UpdateBranchInput extends Partial<CreateBranchInput> {}
