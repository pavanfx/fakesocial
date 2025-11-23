import { GoogleGenAI, Type } from "@google/genai";
import { AppType, ThemeType, Message } from "../types";

// Use EXPO_PUBLIC_API_KEY for Expo
const apiKey = process.env.EXPO_PUBLIC_API_KEY || process.env.API_KEY;

const ai = new GoogleGenAI({ apiKey: apiKey });

export const generateConversation = async (
    app: AppType,
    theme: ThemeType,
    themName: string
): Promise<Message[]> => {
    const systemInstruction = `You are a creative writer designed to generate realistic text message conversations for social media screenshots. 
  Generate a short conversation (5-8 messages) between two people using the specific slang and style typical for the platform '${app}'.
  The conversation should strictly follow the theme: '${theme}'.
  The participants are 'me' (the user taking the screenshot) and 'them' (the person named ${themName}).
  
  Platform Styles:
  - If 'Instagram': Use GenZ casual slang, lowercase usually, 'u' instead of 'you'.
  - If 'Tinder': Flirty, direct, or awkward depending on theme.
  - If 'WhatsApp': Slightly more formal or casual depending on relationship, uses emojis often.
  - If 'TikTok': Very short, brainrot slang (cooked, ate, real), trends.

  Theme Guidelines:
  - 'Flirty': Playful, romantic interest, emojis, teasing.
  - 'Crush': Nervous, excited, subtle hints, trying to impress.
  - 'Dating': Planning a date, discussing logistics, "getting to know you" phase.
  - 'Friendly': Casual, checking in, making plans, low stakes.
  - 'Bestie': High energy, inside jokes, slang, gossip, "tea", CAPS LOCK for emphasis.
  - 'Professional': Polite, work-related, formal grammar, no slang, "Per my last email" energy.
  - 'Stranger': Awkward, "who is this?", marketplace inquiry, or wrong number.
  - 'Ignore': 'them' is dry/short replies (one word), 'me' is trying too hard or double texting.
  - 'Red Flag': 'them' is love bombing, controlling, weirdly aggressive, or narcissistic.
  - 'Toxic': Manipulative, gaslighting, mean, playing victim.
  - 'Argument': Conflict, angry, defensive, short snappy sentences.
  - 'Breakup': Sad, serious, "we need to talk", closure or lack thereof.
  - 'Ex': Nostalgic, bitter, "miss you" texts at 2am, or awkward reconnecting.
  - 'Gossip': Sharing secrets, "did you hear about...", shocked reactions.
  
  Ensure the conversation flows naturally and feels authentic to the selected theme and platform.
  IMPORTANT: The conversation MUST end with a message from 'them'.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a ${theme} conversation for ${app}.`,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        messages: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    sender: {
                                        type: Type.STRING,
                                        enum: ["me", "them"],
                                    },
                                    content: {
                                        type: Type.STRING,
                                    },
                                    time: {
                                        type: Type.STRING,
                                        description: "Time string like '10:30 AM' or 'Now'",
                                    },
                                },
                                required: ["sender", "content"],
                            },
                        },
                    },
                },
            },
        });

        if (response.text) {
            const data = JSON.parse(response.text);
            return data.messages.map((msg: any, index: number) => ({
                ...msg,
                id: `msg-${index}`,
            }));
        }
        return [];
    } catch (error) {
        console.error("Error generating conversation:", error);
        // Fallback in case of error
        return [
            { id: 'err1', sender: 'them', content: 'Hey, did you get my message?', time: 'Now' },
            { id: 'err2', sender: 'me', content: 'Sorry, connection error. Try again!', time: 'Now' },
            { id: 'err3', sender: 'them', content: 'No worries!', time: 'Now' },
        ];
    }
};

export const generateReply = async (
    app: AppType,
    theme: ThemeType,
    history: Message[],
    userMessage: string
): Promise<Message> => {
    const systemInstruction = `You are roleplaying as 'them' in a chat on ${app}. 
  The theme of the chat is '${theme}'.
  The user ('me') just sent a message: "${userMessage}".
  
  Your goal is to reply with a POSITIVE attitude, regardless of the previous mood.
  You should act like you LIKED the last message from 'me'.
  Keep the reply short and consistent with the platform style (${app}).
  `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a reply to "${userMessage}"`,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        content: {
                            type: Type.STRING,
                        },
                        time: {
                            type: Type.STRING,
                        },
                    },
                    required: ["content"],
                },
            },
        });

        if (response.text) {
            const data = JSON.parse(response.text);
            return {
                id: `msg-reply-${Date.now()}`,
                sender: 'them',
                content: data.content,
                time: data.time || 'Now',
            };
        }
        throw new Error("No response text");
    } catch (error) {
        console.error("Error generating reply:", error);
        return {
            id: `err-reply-${Date.now()}`,
            sender: 'them',
            content: 'Haha, nice one! ❤️',
            time: 'Now',
        };
    }
};
