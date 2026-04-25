export type ValidationErrors = Record<string, string>;
/** Used when creating a new card — password is auto-generated server-side */
export declare function validateCreate(body: Record<string, unknown>): ValidationErrors;
/** Used when updating an existing card */
export declare function validateUpdate(body: Record<string, unknown>): ValidationErrors;
export declare function validateContactUs(body: Record<string, unknown>): ValidationErrors;
//# sourceMappingURL=validation.d.ts.map