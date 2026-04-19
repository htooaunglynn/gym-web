export interface Trainer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialization: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTrainerInput {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialization: string;
}

export interface UpdateTrainerInput extends Partial<CreateTrainerInput> {}
