import { NextFunction, Request, Response } from "express";
import { jwtHelpers } from "../helper/jwtHelpers";


export const checkClient = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (process.env.ENV === 'dev') return next();
        const internalKey = req.headers['x-internal-key'];
        const { access } = jwtHelpers.verifyToken(internalKey as string);

        if (!access) throw new Error("Unauthorized");

        next();
    }
    catch (error) {
        res.status(400).json({ message: "Unauthorized !!" });
    }
}