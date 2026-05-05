export interface Trainer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialization: string;
    city?: string;
    township?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTrainerInput {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialization: string;
    city?: string;
    township?: string;
}

export interface UpdateTrainerInput extends Partial<CreateTrainerInput> {}
