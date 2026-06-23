

import * as bcrypt from "bcryptjs";
import { AppDataSource } from "../DB/database.config";
import { User } from "../entities/User";
import { Conversation } from "../entities/Conversation";
import { Message } from "../entities/Message";

const seedDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Database connected for seeding...");

        const userRepository = AppDataSource.getRepository(User);
        const conversationRepo = AppDataSource.getRepository(Conversation);
        const messageRepo = AppDataSource.getRepository(Message);

        const adminEmail = "admin@test.com";
        const existingAdmin = await userRepository.findOneBy({ email: adminEmail });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            const adminUser = userRepository.create({
                email: adminEmail,
                password: hashedPassword,
            });
            await userRepository.save(adminUser);
            console.log("✅ Admin user seeded (admin@test.com / admin123).");
        } else {
            console.log("⚠️ Admin user already exists. Skipping.");
        }

        const mockCustomers = [
            "Alice Smith", "Bob Jones", "Charlie Brown", "Diana Prince",
            "Evan Wright", "Fiona Gallagher", "George Clark", "Hannah Abbott",
            "Ian Malcolm", "Jane Doe"
        ];

        const statuses = ["open", "pending", "closed", "open", "open", "pending", "closed", "open", "pending", "open"];


        for (let i = 0; i < 10; i++) {
            const conversation = conversationRepo.create({
                customerName: mockCustomers[i],
                status: statuses[i],
            });

            const savedConvo = await conversationRepo.save(conversation);


            const isRefund = i % 2 === 0;
            const issueText = isRefund
                ? "I want a refund, the item arrived broken."
                : "I cannot login to my account, the portal is very slow.";

            const msg1 = messageRepo.create({
                conversationId: savedConvo.conversationId,
                sender: "customer",
                text: `Hi, I need some help regarding order #${1000 + i}.`,
            });

            const msg2 = messageRepo.create({
                conversationId: savedConvo.conversationId,
                sender: "admin",
                text: `Hello ${mockCustomers[i]}, I would be happy to help! What seems to be the issue?`,
            });

            const msg3 = messageRepo.create({
                conversationId: savedConvo.conversationId,
                sender: "customer",
                text: issueText,
            });

            await messageRepo.save([msg1, msg2, msg3]);
        }

        console.log("✅ 10 Conversations and 30 Messages seeded successfully!");

    } catch (error) {
        console.error("❌ Error seeding database:", error);
    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
            console.log("Database connection closed.");
        }
    }
};


seedDatabase();