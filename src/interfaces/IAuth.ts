import { Request } from "express";

export interface AuthRequest extends Request {
    user?: UserRequestInterface;
}

interface UserRequestInterface { id: number, role: string }