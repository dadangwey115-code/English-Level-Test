import { UserProfile, Message } from "../types";

async function callGeminiBackend(payload: any) {
  const response = await fetch("/api/ai/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to get AI response");
  }

  const data = await response.json();
  return data.text;
}

async function callOpenRouter(profile: UserProfile, systemInstruction: string, history: Message[], message: string) {
  const apiKey = profile.openRouterApiKey;
  if (!apiKey) throw new Error("OpenRouter API Key not found");

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,
      "X-Title": "Mingalar ESL Coach",
    },
    body: JSON.stringify({
      model: "google/gemini-2.0-flash-001", // Good default for OpenRouter
      messages: [
        { role: "system", content: systemInstruction },
        ...history.map(m => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.text
        })),
        { role: "user", content: message }
      ],
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "OpenRouter API error");
  }

  const data = await response.json();
  return data.choices[0].message.content;
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
  // Use OpenRouter if key is provided
  if (profile.openRouterApiKey) {
    try {
      return await callOpenRouter(profile, SYSTEM_INSTRUCTION(profile), history, message);
    } catch (err) {
      console.error("OpenRouter error, falling back to Gemini:", err);
      // Fallback to Gemini if OpenRouter fails
    }
  }

  return await callGeminiBackend({
    type: "chat",
    profile,
    history,
    message,
    systemInstruction: SYSTEM_INSTRUCTION(profile)
  });
}

export async function getWordMeaning(word: string, profile?: UserProfile) {
  const prompt = `Translate the English word "${word}" into Myanmar (Burmese). 
  Provide a very short definition and the Myanmar translation. 
  Format: [Myanmar Translation] - [Short English Definition]
  Example for "Apple": ပန်းသီး - A round fruit with red or green skin.`;

  if (profile?.openRouterApiKey) {
    try {
      return await callOpenRouter(profile, "You are a helpful translation assistant.", [], prompt);
    } catch (err) {
      console.error("OpenRouter error for word meaning:", err);
    }
  }

  return await callGeminiBackend({
    type: "prompt",
    profile,
    message: prompt
  }) || "Meaning not found.";
}

export async function getWrongAnswerExplanation(question: string, chosenOption: string, options: string[], profile?: UserProfile) {
  const prompt = `Question: ${question}
  Options: ${options.join(", ")}
  The user chose: "${chosenOption}"
  
  Explain why this choice is incorrect in a helpful, encouraging way for an English learner. 
  IMPORTANT: Do NOT reveal which of the other options is the correct one. 
  Focus only on why the chosen option doesn't fit the context or grammar rules.
  Keep it under 40 words.`;

  if (profile?.openRouterApiKey) {
    try {
      return await callOpenRouter(profile, "You are a helpful ESL teacher.", [], prompt);
    } catch (err) {
      console.error("OpenRouter error for explanation:", err);
    }
  }

  return await callGeminiBackend({
    type: "prompt",
    profile,
    message: prompt
  }) || "That's not quite right. Try looking at the grammar or context again!";
}
