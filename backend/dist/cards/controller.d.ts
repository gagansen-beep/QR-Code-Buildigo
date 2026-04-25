import { Response, NextFunction, Request } from "express";
type Req = Request & {
    file?: Express.Multer.File;
};
export declare class CardController {
    static create(req: Req, res: Response, next: NextFunction): Promise<void>;
    static publicGetAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    static update(req: Req, res: Response, next: NextFunction): Promise<void>;
    static remove(req: Request, res: Response, next: NextFunction): Promise<void>;
    static adminGetAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    static adminUpdate(req: Req, res: Response, next: NextFunction): Promise<void>;
    static adminRemove(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare class ContactController {
    static createContact(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAllContact(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getByIdContact(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteContact(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export {};
//# sourceMappingURL=controller.d.ts.map