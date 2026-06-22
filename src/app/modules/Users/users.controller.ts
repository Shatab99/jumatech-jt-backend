import catchAsync from "../../../shared/catchAsync";
import ApiError from "../../error/ApiErrors";
import { dynamicQueryBuilder } from "../../helper/queryBuilder";
import { TImageFiles } from "../../interface";
import sendResponse from "../../middleware/sendResponse";
import bcrypt from "bcryptjs";
import { userRepo } from "../../interface/repos";
import { getImageUrl } from "../../helper/uploadFile";



const createUser = catchAsync(async (req, res) => {

    const data = req.body;
    const files = req.files as TImageFiles;
    const isUserExists = await userRepo.findOne({ where: { email: req.body.email } });

    if (isUserExists) {
        throw new ApiError(400, "User with this email already exists");
    }

    if (files && files.profileImage) {
        data.profileImage = await getImageUrl(files.profileImage[0], req);
    }

    data.isActive = 1;

    data.password = await bcrypt.hash(data.password, 10);

    await userRepo.save(data);

    sendResponse(res, 201, "User created successfully");
})

const getAllUsers = catchAsync(async (req, res) => {
    // const users = await userRepo.find();

    const users = await dynamicQueryBuilder({
        repository: userRepo,
        query: req.query,
        searchableFields: ["name", "email"],
        excludeSelects: ["password"],
        // includeSelects: ["id", "email", "name", "isActive", "role", "createdAt"]
    });

    sendResponse(res, 200, "Users fetched successfully", users);
})

const getMe = catchAsync(async (req, res) => {
    const userId = req.user?.id;
    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) throw new ApiError(404, "User not found");
    sendResponse(res, 200, "User fetched successfully", user);
});

const updateMe = catchAsync(async (req, res) => {
    const data = req.body;
    const id = req.user?.id;
    const files = req.files as TImageFiles;
    if (data.password) throw new ApiError(400, "Password update is not allowed here");
    const user = await userRepo.findOne({ where: { id } });
    if (!user) throw new ApiError(404, "User not found");
    if (files && files.profileImage) {
        data.profileImage = await getImageUrl(files.profileImage[0], req);
    }
    console.log("id", id)
    console.log("user : ", user)
    await userRepo.update(id, data);
    sendResponse(res, 200, "User updated successfully");
})

const updatePassword = catchAsync(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id;
    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) throw new ApiError(404, "User not found");
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) throw new ApiError(401, "Current password is incorrect");
    if (currentPassword === newPassword) throw new ApiError(400, "New password must be different from the current password");
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await userRepo.update(userId, { password: hashedNewPassword });
    sendResponse(res, 200, "Password updated successfully");
})

export const UsersController = {
    createUser,
    getAllUsers,
    getMe,
    updateMe,
    updatePassword
}