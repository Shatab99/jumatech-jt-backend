import client from "../../../config/redis.config";
import catchAsync from "../../../shared/catchAsync";
import ApiError from "../../error/ApiErrors";
import { dynamicQueryBuilder } from "../../helper/queryBuilder";
import { suggestReplyFromAI } from "../../helper/suggestReply";
import { conRepo, messageRepo } from "../../interface/repos";
import sendResponse from "../../middleware/sendResponse";
import { cacheCleanUpQueue } from "../../queues/cleanupConvMsgs.queue";
import { replyQueue, replyQueueEvent } from "../../queues/replyWorker.queue";

const sendCustomerMessage = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;

    const conversation = await conRepo.findOne({ where: { conversationId: Number(id) } });

    if (!conversation) throw new ApiError(404, "Conversation not found");

    await client.del(`suggestion:${id}`);

    await messageRepo.save({
        conversationId: Number(id),
        sender: "customer",
        text: text,
    });

    await cacheCleanUpQueue.add("cache-cleanup", { conversationId: Number(id) });

    sendResponse(res, 200, "Message sent successfully", { message: `Message sent for conversation ${id}: ${text}` });
})

const getAllConversations = catchAsync(async (req, res) => {

    const cacheKey = `conversations::${JSON.stringify(req.query)}`;
    const cachedConversations = await client.get(cacheKey);

    if (cachedConversations) return sendResponse(res, 200, "Conversations fetched from cache", JSON.parse(cachedConversations));

    const conversations = await dynamicQueryBuilder({
        repository: conRepo,
        query: req.query,
        searchableFields: ["subject", "status", "userId"],
    })

    await client.set(cacheKey, JSON.stringify(conversations), { EX: 60 * 60 * 24 });
    sendResponse(res, 200, "Conversations fetched successfully", conversations)
})


const getConversationById = catchAsync(async (req, res) => {
    const { id } = req.params;

    const conId = Number(id);

    const cachekey = `conversation:${conId}:${JSON.stringify(req.query)}`;
    const cachedConversation = await client.get(cachekey);

    if (cachedConversation) return sendResponse(res, 200, "Conversation fetched from cache", JSON.parse(cachedConversation));

    const msgs = await dynamicQueryBuilder({
        repository: messageRepo,
        query: req.query,
        searchableFields: ["text"],
        forcedFilters: { conversationId: conId },
    })

    await client.set(cachekey, JSON.stringify(msgs), { EX: 60 * 60 * 24 });
    sendResponse(res, 200, "Conversation fetched successfully", msgs);
})

const suggestReply = catchAsync(async (req, res) => {
    const { id } = req.params;

    const conversation = await conRepo.findOne({ where: { conversationId: Number(id) } });

    if (!conversation) throw new ApiError(404, "Conversation not found");

    const cacheKey = `suggestion:${id}`;
    const cachedSuggestion = await client.get(cacheKey);

    if (cachedSuggestion) return sendResponse(res, 200, "AI Suggestion fetched from cache", { suggestion: cachedSuggestion });

    const messages = await messageRepo.find({ where: { conversationId: Number(id) }, take: 10, order: { createdAt: "DESC" } });

    const job = await replyQueue.add("ai-reply-suggestions", {
        conversationId: Number(id),
        text: messages.map(msg => msg.text).join("\n")
    });



    sendResponse(res, 200, "AI Suggestion is processing...", {
        jobId: job.id,
    });

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

    await cacheCleanUpQueue.add("cache-cleanup", { conversationId: Number(id) });

    sendResponse(res, 200, "Reply sent successfully", { reply: `Reply sent for conversation ${id}: ${text}` });
})


export const supportController = {
    getAllConversations,
    getConversationById,
    suggestReply,
    sendReply,
    sendCustomerMessage
}