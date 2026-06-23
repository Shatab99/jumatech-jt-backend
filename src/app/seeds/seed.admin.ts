
import { userRepo } from "../interface/repos";
import bcrypt from "bcryptjs";

const adminSeed = async () => {
    try {
        const adminData = {
            email: "admin@test.com",
            password: "admin123",
            role: "admin",
            name: "Admin",
        }

        const existingAdmin = await userRepo.findOne({ where: { email: adminData.email } });

        if (existingAdmin) return console.log("admin created already !")

        adminData.password = await bcrypt.hash(adminData.password, 10);

        await userRepo.save(adminData);

        console.log("[Seed] Admin Created successfully !")
    } catch (error) {
        console.error("[Seed] Admin creation failed:", error);
    }
}

adminSeed();