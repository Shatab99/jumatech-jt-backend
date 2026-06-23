import axios from "axios";

export const suggestReplyFromAI = async (text: string) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL;


    if (!apiKey) throw new Error("Missing OpenRouter API key. Please set the OPENROUTER_API_KEY environment variable.");
    if (!model) throw new Error("Missing OpenRouter model. Please set the OPENROUTER_MODEL environment variable.");

    const systemPrompt = `
You are an expert, highly empathetic customer support copilot operating inside a centralized enterprise support inbox. Your job is to draft a "ready-to-send" reply for the support agent to use.

CRITICAL OPERATIONAL RULES:
1. TONALITY: Professional, highly empathetic, reassuring, and completely objective. Never sound robotic or defensive.
2. BREVITY: Keep answers concise and direct. Do not add fluff or unnecessary filler words.
3. STRUCTURE: Use short paragraphs or clean bullet points if instructions are multi-step.
4. ACTIONABLE: If additional information is needed, ask for it clearly in a polite manner. 
5. ARCHITECTURAL AWARENESS: If the customer mentions technical issues, latency, errors, or bug behavior, provide troubleshooting options framed with high-level technical clarity.

OUTPUT RESTRICTION:
- Output ONLY the draft reply text itself. 
- Do NOT include any introductory or concluding pleasantries directed at the agent (e.g., "Here is a draft response:"). 
- Do NOT use markdown code blocks wrapper (\`\`\`) around your response.
`;


    const userPrompt = `
[CONVERSATION HISTORY]
${text}
`;



    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: model,
                messages: [
                    { role: "system", content: systemPrompt.trim() },
                    { role: "user", content: userPrompt.trim() }
                ],
                temperature: 0.3,
                max_tokens: 500
            },
            {
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "Smart Support Inbox"
                }
            }
        );

        // Extract the raw text result from the completion payload
        const suggestion = response.data?.choices?.[0]?.message?.content;

        if (!suggestion) {
            throw new Error("Empty response choice returned from OpenRouter API.");
        }

        return suggestion.trim();
    } catch (error) { console.log(error) }
}