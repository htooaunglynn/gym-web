export interface Member {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city?: string;
    township?: string;
    trainerId: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateMemberInput {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city?: string;
    township?: string;
}

export interface UpdateMemberInput extends Partial<CreateMemberInput> {
    trainerId?: string | null;
}
