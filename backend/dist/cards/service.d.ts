export declare class AppError extends Error {
    readonly statusCode: number;
    constructor(message: string, statusCode: number);
}
export declare class AuthError extends AppError {
    constructor(message?: string);
}
export declare class NotFoundError extends AppError {
    constructor(message?: string);
}
export interface QrCard {
    id: string;
    name: string;
    designation: string | null;
    image_url: string | null;
    email: string;
    phone: string | null;
    whatsapp: string | null;
    website: string | null;
    location: string | null;
    bio: string | null;
    company: string | null;
    facebook: string | null;
    instagram: string | null;
    twitter: string | null;
    linkedin: string | null;
    qr_code: string | null;
    created_at: string;
    updated_at: string;
}
export interface CardCreateInput {
    name: string;
    designation?: string;
    image_url?: string;
    email: string;
    phone?: string;
    whatsapp?: string;
    website?: string;
    location?: string;
    bio?: string;
    company?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
}
export interface CardUpdateInput {
    name: string;
    designation?: string;
    phone?: string;
    whatsapp?: string;
    website?: string;
    location?: string;
    bio?: string;
    company?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
}
export declare class CardService {
    /** Create a new card. Password is auto-generated server-side (user never logs in). */
    static create(input: CardCreateInput, frontendBase: string): Promise<QrCard>;
    /** Public — get all cards with optional email/phone search and pagination. */
    static publicGetAll(page?: number, limit?: number, search?: {
        email?: string;
        phone?: string;
    }): Promise<{
        data: QrCard[];
        total: number;
        page: number;
        limit: number;
    }>;
    static findById(id: string): Promise<QrCard | null>;
    /** Public update (no auth) */
    static publicUpdate(id: string, input: CardUpdateInput, newImageUrl?: string): Promise<QrCard>;
    /** Public delete (no auth) */
    static publicDelete(id: string): Promise<void>;
}
export interface ContactUsInput {
    product?: string;
    subject: string;
    email: string;
    message: string;
}
export interface ContactUs {
    id: string;
    email: string;
    product: string | null;
    subject: string;
    message: string | null;
    created_at: string;
    updated_at: string;
}
export declare class contactUsService {
    static create(input: ContactUsInput): Promise<ContactUs>;
    static getAll(page?: number, limit?: number, search?: {
        email?: string;
    }): Promise<{
        data: ContactUs[];
        total: number;
        page: number;
        limit: number;
    }>;
    static findById(id: string): Promise<ContactUs | null>;
    static delete(id: string): Promise<void>;
}
//# sourceMappingURL=service.d.ts.map