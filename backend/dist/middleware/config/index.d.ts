export declare const config: {
    readonly app: {
        readonly env: string;
        readonly port: number;
        readonly apiPrefix: string;
        readonly name: string;
    };
    readonly db: {
        readonly host: string;
        readonly port: number;
        readonly database: string;
        readonly user: string;
        readonly password: string;
        readonly poolMin: number;
        readonly poolMax: number;
        readonly ssl: boolean;
    };
    readonly cors: {
        readonly origins: string[];
    };
    readonly rateLimit: {
        readonly windowMs: number;
        readonly maxRequests: number;
    };
    readonly storage: {
        readonly basePath: string;
        readonly maxFileSizeMb: number;
    };
    readonly logging: {
        readonly level: string;
    };
};
export type Config = typeof config;
//# sourceMappingURL=index.d.ts.map