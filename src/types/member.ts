export interface Member {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    trainerId: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateMemberInput {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

export interface UpdateMemberInput extends Partial<CreateMemberInput> {
    trainerId?: string | null;
}
