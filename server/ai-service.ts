import axios from 'axios';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `You are CRYPTUS AI, a helpful coding assistant for a Data Structures and Algorithms learning platform called CRYPTUS.

Your role is to:
1. Help users understand DSA concepts and problems
2. Guide users when they're stuck on their code (give hints, NOT full solutions)
3. Help navigate the platform features
4. Encourage learning through doing

IMPORTANT RULES:
- If a user asks for the full solution or complete code, politely decline and suggest they:
  • Try solving it step by step
  • Look at the "Worked Example" tab for guidance
  • Break down the problem into smaller parts
- When reviewing code, point out specific issues and give hints, not fixes
- Be encouraging and supportive
- Keep responses concise but helpful
- Use emojis sparingly to be friendly

Platform features you can help with:
- Dashboard: Shows user progress, XP, solved problems, streak
- Topics: DSA topics with problems organized by difficulty
- Problem View: Has Guide tab (problem description, submission format), Worked Example tab (detailed walkthrough)
- Code Editor: Users can write code in C++, Python, Java, JavaScript, C
- Run button: Tests code against visible test cases
- Submit button: Tests against all test cases (including hidden ones)
- Leaderboard: Rankings based on Streak > XP > Problems Solved
- Console: Shows test results after running/submitting code

When responding:
- Be concise and focused (max 150 words)
- Use code blocks for any code snippets
- Format with bullet points when listing things
- Always encourage the user to keep learning`;

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export async function generateAIResponse(
    userMessage: string,
    conversationHistory: ChatMessage[] = []
): Promise<string> {
    if (!GROQ_API_KEY) {
        return getFallbackResponse(userMessage);
    }

    try {
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...conversationHistory.slice(-6).map(msg => ({
                role: msg.role,
                content: msg.content
            })),
            { role: 'user', content: userMessage }
        ];

        const response = await axios.post(
            GROQ_URL,
            {
                model: 'llama-3.1-8b-instant',
                messages,
                temperature: 0.7,
                max_tokens: 400,
            },
            {
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                timeout: 15000,
            }
        );

        const text = response.data?.choices?.[0]?.message?.content;
        if (text) {
            return text;
        }

        return getFallbackResponse(userMessage);
    } catch (error: any) {
        console.error('Groq API error:', error.response?.data || error.message);

        // Handle rate limit errors gracefully
        if (error.response?.status === 429 || error.response?.data?.error?.code === 'rate_limit_exceeded') {
            return "⏱️ You've reached the AI assistant usage limit for now.\n\nPlease wait a few minutes for the limit to reset, or consider upgrading to **Premium** for unlimited AI assistance!\n\nIn the meantime, check out the **Worked Example** tab for detailed problem walkthroughs.";
        }

        // Handle quota exceeded
        if (error.response?.status === 402 || error.response?.data?.error?.type === 'insufficient_quota') {
            return "⏱️ The daily AI assistant limit has been reached.\n\nPlease try again tomorrow, or upgrade to **Premium** for unlimited access!\n\nYou can still use the **Worked Example** tab for guidance.";
        }

        // Other errors - use fallback
        return getFallbackResponse(userMessage);
    }
}

// Smart fallback for when AI is not configured or has errors
export function getFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    // Code solution requests
    if (lowerMessage.includes('full code') || lowerMessage.includes('complete solution') ||
        lowerMessage.includes('give me the code') || lowerMessage.includes('write the code') ||
        lowerMessage.includes('solve this') || lowerMessage.includes('solution')) {
        return "I encourage you to try solving it yourself first! 💪\n\nHere's what you can do:\n• Break the problem into smaller steps\n• Check the **Worked Example** tab for a detailed walkthrough\n• Look at the submission format for the expected function signature\n\nLearning happens when you struggle a bit. You've got this!";
    }

    // Help with code/debugging
    if (lowerMessage.includes('stuck') || lowerMessage.includes('help') || lowerMessage.includes('hint') ||
        lowerMessage.includes('wrong') || lowerMessage.includes('error') || lowerMessage.includes('not working')) {
        return "I'd love to help! 🤔\n\nTo give you a useful hint, could you:\n1. Tell me which problem you're working on\n2. Share the approach you've tried\n3. Describe where you're getting stuck\n\nThat way I can point you in the right direction without giving away the solution!";
    }

    // Leaderboard
    if (lowerMessage.includes('leaderboard') || lowerMessage.includes('ranking') || lowerMessage.includes('rank')) {
        return "The **Leaderboard** shows rankings of all users! 🏆\n\nRankings are based on:\n• Streak (highest priority) 🔥\n• XP earned from solving problems\n• Total problems solved\n\nKeep solving daily to maintain your streak!";
    }

    // XP
    if (lowerMessage.includes('xp') || lowerMessage.includes('points') || lowerMessage.includes('experience')) {
        return "You earn XP by solving problems! 🎯\n\n• Easy problems: 50 XP\n• Medium problems: 100 XP\n• Hard problems: 200 XP\n\nXP helps determine your rank on the leaderboard!";
    }

    // Streak
    if (lowerMessage.includes('streak')) {
        return "Your **streak** counts consecutive days you've solved at least one problem! 🔥\n\nStreak is the most important ranking factor on the leaderboard. Try to solve at least one problem every day to keep it going!";
    }

    // Run vs Submit
    if (lowerMessage.includes('run') || lowerMessage.includes('submit') || lowerMessage.includes('test')) {
        return "Here's the difference between Run and Submit:\n\n**Run** ▶️\n• Tests your code against visible test cases\n• Quick feedback for debugging\n\n**Submit** 📤\n• Tests against ALL test cases (including hidden ones)\n• Only counts if you pass everything\n• Gives you XP when you pass!";
    }

    // Topic/Problem related
    if (lowerMessage.includes('topic') || lowerMessage.includes('problem') || lowerMessage.includes('curriculum')) {
        return "Our curriculum covers essential DSA topics! 📚\n\n• Each topic has multiple problems\n• Problems are sorted by difficulty (Easy → Medium → Hard)\n• Start with easier problems and work your way up\n\nClick on any topic in the sidebar to see its problems!";
    }

    // Greeting
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return "Hello! 👋 Welcome to CRYPTUS!\n\nI'm here to help you:\n• Understand DSA concepts\n• Get hints when you're stuck\n• Navigate the platform\n\nHow can I assist you today?";
    }

    // Default response
    return "I'm here to help! 🙂\n\nYou can ask me about:\n• DSA concepts and problem-solving approaches\n• Getting hints when you're stuck (not full solutions!)\n• How to use the platform features\n• Understanding test case results\n\nWhat would you like to know?";
}
