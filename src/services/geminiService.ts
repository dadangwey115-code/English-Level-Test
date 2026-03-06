import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { UserProfile, Message } from "../types";

function getAI(profile?: UserProfile) {
  const apiKey = profile?.customApiKey || process.env.GEMINI_API_KEY || "";
  return new GoogleGenAI({ apiKey });
}

const SYSTEM_INSTRUCTION = (profile: UserProfile) => `
Role: Expert ESL Teacher & Language Coach specialized in coaching adult learners whose native language is Burmese.
Learner Profile:
- Name: ${profile.name}
- Level: ${profile.level}
- Goals: ${profile.goals.join(", ")}
- Priority Skills: ${profile.prioritySkills.join(", ")}
- Preferred Dialect: ${profile.preferredDialect}
- Daily Commitment: ${profile.dailyCommitment} minutes

Interaction Framework:
1. Act as a "Helper" and "Collaborator".
2. Keep responses under 100 words in Speaking/Listening mode.
3. Correction Style for Speaking:
   - Your sentence: [User's original]
   - Natural version: [Corrected version]
   - Why: [Simple explanation]
4. Writing Correction (4-part):
   - Positive reinforcement.
   - Error correction (Before → After).
   - Natural expressions/Collocations.
   - Model Version (+1 level higher).
5. Burmese Context: Focus on ending sounds (/s/, /t/, /d/), subject-verb agreement, and absence of articles.
6. Safety Net: Include "Note: While this is a common rule, language usage varies; feel free to verify with a dictionary" for complex facts.
7. Reading: Provide level-appropriate texts with "Key Vocabulary" (English - Definition - Burmese Translation).

Always be encouraging, professional, and patient.
`;

export async function getChatResponse(profile: UserProfile, history: Message[], message: string) {
  const model = "gemini-3.1-pro-preview";
  const ai = getAI(profile);
  
  const contents = [
    ...history.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    })),
    { role: 'user', parts: [{ text: message }] }
  ];

  const response: GenerateContentResponse = await ai.models.generateContent({
    model,
    contents: contents as any,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION(profile),
    }
  });

  return response.text || "I'm sorry, I couldn't generate a response.";
}

export async function getWordMeaning(word: string, profile?: UserProfile) {
  const model = "gemini-3-flash-preview";
  const ai = getAI(profile);
  
  const prompt = `Translate the English word "${word}" into Myanmar (Burmese). 
  Provide a very short definition and the Myanmar translation. 
  Format: [Myanmar Translation] - [Short English Definition]
  Example for "Apple": ပန်းသီး - A round fruit with red or green skin.`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });

  return response.text || "Meaning not found.";
}

export async function getWrongAnswerExplanation(question: string, chosenOption: string, options: string[], profile?: UserProfile) {
  const model = "gemini-3-flash-preview";
  const ai = getAI(profile);
  
  const prompt = `Question: ${question}
  Options: ${options.join(", ")}
  The user chose: "${chosenOption}"
  
  Explain why this choice is incorrect in a helpful, encouraging way for an English learner. 
  IMPORTANT: Do NOT reveal which of the other options is the correct one. 
  Focus only on why the chosen option doesn't fit the context or grammar rules.
  Keep it under 40 words.`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });

  return response.text || "That's not quite right. Try looking at the grammar or context again!";
}
