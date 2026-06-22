import { NextFunction, Request, Response } from "express";
import { JwtPayload, Secret } from "jsonwebtoken";
import ApiError from "../error/ApiErrors";
import { StatusCodes } from "http-status-codes";
import { jwtHelpers } from "../helper/jwtHelpers";
import { userRepo } from "../interface/repos";


const auth = (...roles: string[]) => {
    return async (
        req: Request & { user?: any },
        res: Response,
        next: NextFunction
    ) => {
        try {
            const token = req.headers.authorization;

            if (!token || !token.startsWith("Bearer ")) {
                throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized!");
            }
            const accessToken = token.split("Bearer ")[1];

            const verifiedUser = jwtHelpers.verifyToken(accessToken) as JwtPayload;

            const { email, iat } = verifiedUser;

            const user = await userRepo.findOne({
                where: { email },
            });

            if (!user) {
                throw new ApiError(StatusCodes.UNAUTHORIZED, "User not found!");
            }
            if (user.passwordChangedAt) {
                // convert passwordChangedAt (Date) to seconds
                const changedTimestamp = Math.floor(
                    new Date(user.passwordChangedAt).getTime() / 1000
                );

                if (iat! < changedTimestamp) {
                    throw new ApiError(
                        StatusCodes.UNAUTHORIZED,
                        "Token expired, please log in again!"
                    );
                }
            }

            req.user = verifiedUser;

            if (roles.length && !roles.includes(verifiedUser.role)) {
                throw new ApiError(
                    StatusCodes.FORBIDDEN,
                    "Forbidden, You are not authorized!"
                );
            }
            next();
        } catch (err) {
            next(err);
        }
    };
};

export default auth;