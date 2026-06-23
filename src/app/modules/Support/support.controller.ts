import catchAsync from "../../../shared/catchAsync";
import ApiError from "../../error/ApiErrors";
import { dynamicQueryBuilder } from "../../helper/queryBuilder";
import { conRepo, messageRepo } from "../../interface/repos";
import sendResponse from "../../middleware/sendResponse";

const getAllConversations = catchAsync(async (req, res) => {
    const conversations = await dynamicQueryBuilder({
        repository: conRepo,
        query: req.query,
        searchableFields: ["subject", "status", "userId"],
    })

    sendResponse(res, 200, "Conversations fetched successfully", conversations)
})


const getConversationById = catchAsync(async (req, res) => {
    const { id } = req.params;

    const conId = Number(id);

    const msgs = await dynamicQueryBuilder({
        repository: messageRepo,
        query: req.query,
        searchableFields: ["text"],
        forcedFilters: { conversationId: conId },
    })

    sendResponse(res, 200, "Conversation fetched successfully", msgs);
})

const suggestReply = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;

    const conversation = await conRepo.findOne({ where: { conversationId: Number(id) } });

    if (!conversation) throw new ApiError(404, "Conversation not found");

    

    sendResponse(res, 200, "Suggested reply fetched successfully", { suggestedReply: `Suggested reply for conversation ${id}: ${text}` });

})

const sendReply = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;

    const conversation = await conRepo.findOne({ where: { conversationId: Number(id) } });

    if (!conversation) throw new ApiError(404, "Conversation not found");

    await messageRepo.save({
        conversationId: Number(id),
        sender: "admin",
        text: text,
    });

    sendResponse(res, 200, "Reply sent successfully", { reply: `Reply sent for conversation ${id}: ${text}` });
})


export const supportController = {
    getAllConversations,
    getConversationById,
    suggestReply,
    sendReply
}