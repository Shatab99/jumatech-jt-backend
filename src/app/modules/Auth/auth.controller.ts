import catchAsync from "../../../shared/catchAsync";
import ApiError from "../../error/ApiErrors";
import { jwtHelpers } from "../../helper/jwtHelpers";
import { userRepo } from "../../interface/repos";
import sendResponse from "../../middleware/sendResponse";
import bcrypt from "bcryptjs";

const accessToken = catchAsync(async (req, res) => {
    const payload = { access: true };
    const accessToken = jwtHelpers.generateToken(payload, { expiresIn: '5s' });


    sendResponse(res, 200, "Access token generated successfully", {
        accessToken
    });
})


const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await userRepo.findOne({ where: { email } });
    if (!user) throw new ApiError(404, "User not found");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new ApiError(401, "Invalid password");

    const token = jwtHelpers.generateToken({ id: user.id, email: user.email, role: user.role }, { expiresIn: '30d' });

    const { password: _, ...userData } = user;

    sendResponse(res, 200, "Login successful", { token, userData });
})


export const AuthController = {
    accessToken, login
};