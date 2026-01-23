import { User } from "../../models/types.js";

export interface IUserRepository {
    findByIdGoogle(idGoogle: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
    create(user: Omit<User, 'id' | 'password'>): Promise<void>;
    update(idGoogle: string, user: Partial<User>): Promise<void>;
}
