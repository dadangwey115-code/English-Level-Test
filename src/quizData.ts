import { EnglishLevel } from "./types";

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: EnglishLevel;
  skill: "Reading" | "Writing" | "Listening" | "Speaking";
  explanation: string;
}

export const quizQuestions: QuizQuestion[] = [
  // --- A1 (Beginner) ---
  {
    id: 1,
    question: "Reading: Choose the best word. 'The cat is _____ on the mat.'",
    options: ["sit", "sitting", "sits", "sat"],
    correctIndex: 1,
    difficulty: "A1",
    skill: "Reading",
    explanation: "We use the present continuous 'is sitting' to describe an action happening now."
  },
  {
    id: 2,
    question: "Writing: Which sentence is grammatically correct?",
    options: ["She don't like apples.", "She doesn't likes apples.", "She doesn't like apples.", "She not like apples."],
    correctIndex: 2,
    difficulty: "A1",
    skill: "Writing",
    explanation: "In the third person singular (she), we use 'doesn't' + base form of the verb."
  },
  {
    id: 3,
    question: "Listening: You hear: 'I'd like a cup of coffee, please.' What does the person want?",
    options: ["Tea", "Water", "Coffee", "Juice"],
    correctIndex: 2,
    difficulty: "A1",
    skill: "Listening",
    explanation: "The speaker explicitly asks for 'coffee'."
  },
  {
    id: 4,
    question: "Reading: 'I _____ a student.'",
    options: ["is", "am", "are", "be"],
    correctIndex: 1,
    difficulty: "A1",
    skill: "Reading",
    explanation: "With the subject 'I', the correct form of the verb 'to be' is 'am'."
  },
  {
    id: 5,
    question: "Speaking: How do you say hello in the morning?",
    options: ["Good night", "Good afternoon", "Good morning", "Good evening"],
    correctIndex: 2,
    difficulty: "A1",
    skill: "Speaking",
    explanation: "'Good morning' is the standard greeting before noon."
  },
  {
    id: 6,
    question: "Writing: 'They _____ to school every day.'",
    options: ["goes", "go", "going", "gone"],
    correctIndex: 1,
    difficulty: "A1",
    skill: "Writing",
    explanation: "With plural subjects like 'They', we use the base form of the verb in present simple."
  },
  {
    id: 7,
    question: "Listening: You hear: 'My name is John.' What is his name?",
    options: ["Jack", "John", "Joe", "James"],
    correctIndex: 1,
    difficulty: "A1",
    skill: "Listening",
    explanation: "The speaker clearly states his name is 'John'."
  },
  {
    id: 8,
    question: "Reading: 'There _____ a book on the table.'",
    options: ["is", "are", "am", "be"],
    correctIndex: 0,
    difficulty: "A1",
    skill: "Reading",
    explanation: "We use 'There is' for singular nouns like 'a book'."
  },
  {
    id: 9,
    question: "Speaking: What is the correct response to 'How are you?'",
    options: ["I am 5 years old.", "I am fine, thank you.", "I am from London.", "I am a teacher."],
    correctIndex: 1,
    difficulty: "A1",
    skill: "Speaking",
    explanation: "'I am fine, thank you' is a standard response to 'How are you?'."
  },
  {
    id: 10,
    question: "Writing: 'He _____ a red car.'",
    options: ["have", "has", "having", "haves"],
    correctIndex: 1,
    difficulty: "A1",
    skill: "Writing",
    explanation: "With singular subjects (he, she, it), we use 'has' for possession."
  },
  {
    id: 11,
    question: "Reading: 'What time is it?' - 'It is _____ o'clock.' (10:00)",
    options: ["nine", "ten", "eleven", "twelve"],
    correctIndex: 1,
    difficulty: "A1",
    skill: "Reading",
    explanation: "10:00 is 'ten o'clock'."
  },
  {
    id: 12,
    question: "Listening: You hear: 'I have two sisters.' How many sisters does the speaker have?",
    options: ["One", "Two", "Three", "Four"],
    correctIndex: 1,
    difficulty: "A1",
    skill: "Listening",
    explanation: "The speaker says 'two sisters'."
  },
  {
    id: 13,
    question: "Speaking: How do you ask for the price of something?",
    options: ["How many is it?", "How much is it?", "What price is it?", "How cost is it?"],
    correctIndex: 1,
    difficulty: "A1",
    skill: "Speaking",
    explanation: "'How much is it?' is the standard way to ask for a price."
  },
  {
    id: 14,
    question: "Writing: 'We _____ pizza for dinner yesterday.'",
    options: ["eat", "eats", "ate", "eating"],
    correctIndex: 2,
    difficulty: "A1",
    skill: "Writing",
    explanation: "The past tense of 'eat' is 'ate'."
  },
  {
    id: 15,
    question: "Reading: 'Where _____ you from?'",
    options: ["is", "am", "are", "be"],
    correctIndex: 2,
    difficulty: "A1",
    skill: "Reading",
    explanation: "With the subject 'you', we use 'are'."
  },

  // --- A2 (Elementary) ---
  {
    id: 16,
    question: "Speaking: How would you politely ask for directions?",
    options: ["Tell me where the station is.", "Where is station?", "Excuse me, could you tell me the way to the station?", "Station, please."],
    correctIndex: 2,
    difficulty: "A2",
    skill: "Speaking",
    explanation: "Using 'Excuse me' and 'could you' makes the request polite and formal."
  },
  {
    id: 17,
    question: "Speaking: Which response is most appropriate for 'How have you been?'",
    options: ["I am 20 years old.", "I've been doing well, thank you.", "I am from Myanmar.", "Yes, I have."],
    correctIndex: 1,
    difficulty: "A2",
    skill: "Speaking",
    explanation: "'How have you been?' asks about your well-being over a period of time."
  },
  {
    id: 18,
    question: "Writing: Choose the correct prefix to make 'happy' negative.",
    options: ["In-", "Dis-", "Un-", "Mis-"],
    correctIndex: 2,
    difficulty: "A2",
    skill: "Writing",
    explanation: "The negative form of 'happy' is 'unhappy'."
  },
  {
    id: 19,
    question: "Reading: 'I am _____ than my brother.'",
    options: ["tall", "taller", "tallest", "more tall"],
    correctIndex: 1,
    difficulty: "A2",
    skill: "Reading",
    explanation: "We use the comparative form 'taller' when comparing two people."
  },
  {
    id: 20,
    question: "Writing: 'I have _____ to London three times.'",
    options: ["be", "was", "been", "being"],
    correctIndex: 2,
    difficulty: "A2",
    skill: "Writing",
    explanation: "The present perfect uses 'have' + past participle ('been')."
  },
  {
    id: 21,
    question: "Listening: You hear: 'I'm going to the supermarket to buy some bread.' Where is the person going?",
    options: ["Bank", "Library", "Supermarket", "Park"],
    correctIndex: 2,
    difficulty: "A2",
    skill: "Listening",
    explanation: "The speaker says they are going to the 'supermarket'."
  },
  {
    id: 22,
    question: "Reading: 'If it _____, we will stay at home.'",
    options: ["rain", "rains", "raining", "rained"],
    correctIndex: 1,
    difficulty: "A2",
    skill: "Reading",
    explanation: "In the first conditional, we use present simple in the 'if' clause."
  },
  {
    id: 23,
    question: "Speaking: How do you invite someone to a party?",
    options: ["You come to my party.", "Would you like to come to my party?", "Do you come to my party?", "Come party."],
    correctIndex: 1,
    difficulty: "A2",
    skill: "Speaking",
    explanation: "'Would you like to...' is a polite way to invite someone."
  },
  {
    id: 24,
    question: "Writing: 'She _____ her homework when the phone rang.'",
    options: ["is doing", "was doing", "did", "does"],
    correctIndex: 1,
    difficulty: "A2",
    skill: "Writing",
    explanation: "We use past continuous for an action in progress when another action happened."
  },
  {
    id: 25,
    question: "Listening: You hear: 'I usually wake up at 7 AM, but today I woke up at 8 AM.' What time did they wake up today?",
    options: ["7 AM", "8 AM", "6 AM", "9 AM"],
    correctIndex: 1,
    difficulty: "A2",
    skill: "Listening",
    explanation: "The speaker says 'today I woke up at 8 AM'."
  },
  {
    id: 26,
    question: "Reading: 'This is the _____ movie I have ever seen.'",
    options: ["good", "better", "best", "most good"],
    correctIndex: 2,
    difficulty: "A2",
    skill: "Reading",
    explanation: "We use the superlative form 'best' for comparisons involving more than two things."
  },
  {
    id: 27,
    question: "Speaking: How do you offer help to someone?",
    options: ["Help you?", "Can I help you?", "I help you.", "You need help."],
    correctIndex: 1,
    difficulty: "A2",
    skill: "Speaking",
    explanation: "'Can I help you?' is a common and polite way to offer assistance."
  },
  {
    id: 28,
    question: "Writing: 'I _____ play the piano when I was five.'",
    options: ["can", "could", "can't", "couldn't"],
    correctIndex: 1,
    difficulty: "A2",
    skill: "Writing",
    explanation: "'Could' is the past tense of 'can', used for past ability."
  },
  {
    id: 29,
    question: "Listening: You hear: 'The weather is very hot and sunny today.' What is the weather like?",
    options: ["Cold and rainy", "Hot and sunny", "Cloudy and windy", "Snowy"],
    correctIndex: 1,
    difficulty: "A2",
    skill: "Listening",
    explanation: "The speaker describes the weather as 'hot and sunny'."
  },
  {
    id: 30,
    question: "Reading: 'I don't have _____ money.'",
    options: ["many", "much", "a lot", "some"],
    correctIndex: 1,
    difficulty: "A2",
    skill: "Reading",
    explanation: "We use 'much' with uncountable nouns like 'money' in negative sentences."
  },

  // --- B1 (Intermediate) ---
  {
    id: 31,
    question: "Writing: Choose the correct formal closing for a business letter.",
    options: ["See ya later!", "Yours sincerely,", "Best wishes,", "Cheers,"],
    correctIndex: 1,
    difficulty: "B1",
    skill: "Writing",
    explanation: "'Yours sincerely' is a standard formal closing when you know the recipient's name."
  },
  {
    id: 32,
    question: "Reading: 'Despite the challenges, the project was a success.' What does 'Despite' mean?",
    options: ["Because of", "In spite of", "Instead of", "According to"],
    correctIndex: 1,
    difficulty: "B1",
    skill: "Reading",
    explanation: "'Despite' and 'In spite of' are used to show contrast."
  },
  {
    id: 33,
    question: "Writing: Identify the passive voice sentence.",
    options: ["The chef cooked the meal.", "The meal was cooked by the chef.", "The chef is cooking.", "The chef will cook."],
    correctIndex: 1,
    difficulty: "B1",
    skill: "Writing",
    explanation: "Passive voice uses 'be' + past participle (was cooked)."
  },
  {
    id: 34,
    question: "Listening: You hear: 'I'm feeling a bit under the weather today.' How is the person feeling?",
    options: ["Happy", "Sick", "Excited", "Angry"],
    correctIndex: 1,
    difficulty: "B1",
    skill: "Listening",
    explanation: "'Under the weather' is an idiom meaning feeling sick or unwell."
  },
  {
    id: 35,
    question: "Speaking: What is the best way to interrupt someone politely?",
    options: ["Stop talking!", "I have something to say.", "Sorry to interrupt, but...", "Listen to me."],
    correctIndex: 2,
    difficulty: "B1",
    skill: "Speaking",
    explanation: "Starting with an apology ('Sorry to interrupt') is the most polite way to break into a conversation."
  },
  {
    id: 36,
    question: "Reading: 'I wish I _____ more time to study.'",
    options: ["have", "has", "had", "am having"],
    correctIndex: 2,
    difficulty: "B1",
    skill: "Reading",
    explanation: "After 'wish', we use the past simple to express a desire for a different present situation."
  },
  {
    id: 37,
    question: "Writing: 'By the time he arrived, the meeting _____.'",
    options: ["started", "has started", "had started", "was starting"],
    correctIndex: 2,
    difficulty: "B1",
    skill: "Writing",
    explanation: "We use past perfect for an action that happened before another action in the past."
  },
  {
    id: 38,
    question: "Listening: You hear: 'I'd rather stay home than go out tonight.' What does the speaker prefer?",
    options: ["Going out", "Staying home", "Working", "Sleeping"],
    correctIndex: 1,
    difficulty: "B1",
    skill: "Listening",
    explanation: "'I'd rather' expresses a preference for 'staying home'."
  },
  {
    id: 39,
    question: "Speaking: How do you express a strong opinion?",
    options: ["Maybe it's good.", "I strongly believe that...", "I don't know.", "It is okay."],
    correctIndex: 1,
    difficulty: "B1",
    skill: "Speaking",
    explanation: "'I strongly believe that...' is a way to express a firm opinion."
  },
  {
    id: 40,
    question: "Reading: 'The movie was so _____ that I fell asleep.'",
    options: ["bored", "boring", "bore", "bores"],
    correctIndex: 1,
    difficulty: "B1",
    skill: "Reading",
    explanation: "We use '-ing' adjectives to describe the thing that causes the feeling."
  },
  {
    id: 41,
    question: "Writing: 'I'm looking forward to _____ you soon.'",
    options: ["see", "seeing", "saw", "seen"],
    correctIndex: 1,
    difficulty: "B1",
    skill: "Writing",
    explanation: "The phrase 'looking forward to' is followed by a gerund (-ing form)."
  },
  {
    id: 42,
    question: "Listening: You hear: 'You should have told me earlier.' What is the speaker doing?",
    options: ["Giving advice", "Expressing regret/criticism", "Asking a question", "Making a promise"],
    correctIndex: 1,
    difficulty: "B1",
    skill: "Listening",
    explanation: "'Should have + past participle' is used to criticize a past action or express regret."
  },
  {
    id: 43,
    question: "Speaking: How do you ask for someone's opinion?",
    options: ["What do you think about...?", "You like it?", "Tell me now.", "Is it good?"],
    correctIndex: 0,
    difficulty: "B1",
    skill: "Speaking",
    explanation: "'What do you think about...?' is a standard way to solicit an opinion."
  },
  {
    id: 44,
    question: "Reading: 'He is the man _____ car was stolen.'",
    options: ["who", "whom", "whose", "which"],
    correctIndex: 2,
    difficulty: "B1",
    skill: "Reading",
    explanation: "'Whose' is a relative pronoun used to show possession."
  },
  {
    id: 45,
    question: "Writing: 'I _____ my keys. Have you seen them?'",
    options: ["lost", "have lost", "had lost", "am losing"],
    correctIndex: 1,
    difficulty: "B1",
    skill: "Writing",
    explanation: "Present perfect is used for a past action with a result in the present."
  },
  {
    id: 46,
    question: "Listening: You hear: 'It's been ages since we last met.' What does this mean?",
    options: ["We met recently.", "We haven't met for a long time.", "We are meeting now.", "We will meet soon."],
    correctIndex: 1,
    difficulty: "B1",
    skill: "Listening",
    explanation: "'It's been ages' is an idiom meaning a very long time."
  },
  {
    id: 47,
    question: "Speaking: How do you apologize for being late?",
    options: ["I am late.", "I'm sorry for keeping you waiting.", "Wait for me.", "Why are you here?"],
    correctIndex: 1,
    difficulty: "B1",
    skill: "Speaking",
    explanation: "'I'm sorry for keeping you waiting' is a polite way to apologize for lateness."
  },
  {
    id: 48,
    question: "Reading: 'Unless you _____ hard, you won't pass.'",
    options: ["study", "studies", "studied", "will study"],
    correctIndex: 0,
    difficulty: "B1",
    skill: "Reading",
    explanation: "'Unless' means 'if not', and is followed by the present simple in first conditional contexts."
  },
  {
    id: 49,
    question: "Writing: 'I'm not used to _____ up so early.'",
    options: ["get", "getting", "got", "gets"],
    correctIndex: 1,
    difficulty: "B1",
    skill: "Writing",
    explanation: "'Be used to' is followed by a gerund (-ing form)."
  },
  {
    id: 50,
    question: "Listening: You hear: 'I'll get back to you as soon as possible.' What is the speaker promising?",
    options: ["To leave", "To return a call/message", "To arrive late", "To buy something"],
    correctIndex: 1,
    difficulty: "B1",
    skill: "Listening",
    explanation: "'Get back to someone' means to contact them again with information."
  },

  // --- B2 (Upper Intermediate) ---
  {
    id: 51,
    question: "Reading: What does 'procrastinate' mean?",
    options: ["To do something early", "To delay doing something", "To finish a task", "To work hard"],
    correctIndex: 1,
    difficulty: "B2",
    skill: "Reading",
    explanation: "Procrastinate means to delay or postpone action; put off doing something."
  },
  {
    id: 52,
    question: "Listening: You hear: 'The flight was delayed due to inclement weather.' Why was it late?",
    options: ["Technical issues", "Bad weather", "Pilot was late", "Too much traffic"],
    correctIndex: 1,
    difficulty: "B2",
    skill: "Listening",
    explanation: "'Inclement weather' is a formal way to say bad or unpleasant weather."
  },
  {
    id: 53,
    question: "Reading: 'The apple doesn't fall far from the tree.' This idiom means:",
    options: ["Apples are heavy.", "Children are often similar to their parents.", "Trees grow near houses.", "Nature is beautiful."],
    correctIndex: 1,
    difficulty: "B2",
    skill: "Reading",
    explanation: "This idiom suggests that children inherit traits or behaviors from their parents."
  },
  {
    id: 54,
    question: "Writing: 'Hardly _____ the house when it started to pour.'",
    options: ["I had left", "had I left", "I left", "did I leave"],
    correctIndex: 1,
    difficulty: "B2",
    skill: "Writing",
    explanation: "When a sentence starts with a negative adverb like 'Hardly', we use inversion (auxiliary before subject)."
  },
  {
    id: 55,
    question: "Reading: 'The company's profits have _____ significantly this year.'",
    options: ["raised", "risen", "rose", "arisen"],
    correctIndex: 1,
    difficulty: "B2",
    skill: "Reading",
    explanation: "'Rise' (past participle 'risen') is an intransitive verb used for something going up on its own."
  },
  {
    id: 56,
    question: "Listening: You hear: 'I can't make head or tail of this instruction manual.' What is the problem?",
    options: ["The manual is missing.", "The manual is too long.", "The speaker doesn't understand it at all.", "The manual is torn."],
    correctIndex: 2,
    difficulty: "B2",
    skill: "Listening",
    explanation: "'Can't make head or tail of something' means to be unable to understand it at all."
  },
  {
    id: 57,
    question: "Speaking: How do you tactfully disagree with someone?",
    options: ["You are wrong.", "I see your point, but I'm not sure I agree.", "That's stupid.", "No way."],
    correctIndex: 1,
    difficulty: "B2",
    skill: "Speaking",
    explanation: "'I see your point, but...' is a polite and tactful way to introduce a disagreement."
  },
  {
    id: 58,
    question: "Writing: 'I'd rather you _____ tell anyone about this.'",
    options: ["don't", "didn't", "not", "won't"],
    correctIndex: 1,
    difficulty: "B2",
    skill: "Writing",
    explanation: "When 'would rather' has a different subject, we use the past simple to refer to the present or future."
  },
  {
    id: 59,
    question: "Reading: 'The new policy is _____ to improve efficiency.'",
    options: ["aimed", "intended", "supposed", "bound"],
    correctIndex: 1,
    difficulty: "B2",
    skill: "Reading",
    explanation: "'Intended to' expresses the purpose or plan behind something."
  },
  {
    id: 60,
    question: "Listening: You hear: 'We need to cut down on our expenses.' What is the goal?",
    options: ["To increase spending", "To reduce spending", "To stop spending", "To record spending"],
    correctIndex: 1,
    difficulty: "B2",
    skill: "Listening",
    explanation: "'Cut down on' means to reduce the amount or quantity of something."
  },
  {
    id: 61,
    question: "Speaking: How do you summarize a discussion?",
    options: ["To sum up, we have decided to...", "The end.", "I am finished.", "That's all."],
    correctIndex: 0,
    difficulty: "B2",
    skill: "Speaking",
    explanation: "'To sum up...' is a formal way to begin a summary."
  },
  {
    id: 62,
    question: "Writing: 'If I _____ you, I would take the job.'",
    options: ["am", "was", "were", "be"],
    correctIndex: 2,
    difficulty: "B2",
    skill: "Writing",
    explanation: "In second conditional, we use 'were' for all subjects in the 'if' clause."
  },
  {
    id: 63,
    question: "Reading: 'The situation is _____ out of control.'",
    options: ["fast", "quickly", "rapidly", "soon"],
    correctIndex: 2,
    difficulty: "B2",
    skill: "Reading",
    explanation: "'Rapidly' is often used to describe a quick change in a situation."
  },
  {
    id: 64,
    question: "Listening: You hear: 'I'm swamped with work at the moment.' How busy is the speaker?",
    options: ["Not busy", "A little busy", "Extremely busy", "Looking for work"],
    correctIndex: 2,
    difficulty: "B2",
    skill: "Listening",
    explanation: "'Swamped' is an idiom meaning having too much to deal with; extremely busy."
  },
  {
    id: 65,
    question: "Speaking: How do you ask for clarification in a meeting?",
    options: ["What?", "Could you elaborate on that point?", "I don't get it.", "Speak louder."],
    correctIndex: 1,
    difficulty: "B2",
    skill: "Speaking",
    explanation: "'Could you elaborate on that point?' is a professional way to ask for more detail."
  },
  {
    id: 66,
    question: "Writing: 'Despite _____ the map, we got lost.'",
    options: ["have", "having", "had", "we had"],
    correctIndex: 1,
    difficulty: "B2",
    skill: "Writing",
    explanation: "'Despite' is followed by a noun or a gerund (-ing form)."
  },
  {
    id: 67,
    question: "Reading: 'The evidence _____ to the conclusion that he is innocent.'",
    options: ["points", "leads", "shows", "directs"],
    correctIndex: 1,
    difficulty: "B2",
    skill: "Reading",
    explanation: "'Leads to the conclusion' is a common collocation."
  },
  {
    id: 68,
    question: "Listening: You hear: 'It's a long shot, but it might work.' What is the probability?",
    options: ["Very high", "Certain", "Very low", "Impossible"],
    correctIndex: 2,
    difficulty: "B2",
    skill: "Listening",
    explanation: "A 'long shot' is something that has a very small chance of succeeding."
  },
  {
    id: 69,
    question: "Speaking: How do you handle an interruption during your presentation?",
    options: ["Be quiet!", "If I could just finish this point, I'll take questions at the end.", "Go away.", "What do you want?"],
    correctIndex: 1,
    difficulty: "B2",
    skill: "Speaking",
    explanation: "This is a professional way to manage interruptions and maintain flow."
  },
  {
    id: 70,
    question: "Writing: 'No sooner _____ than the rain started.'",
    options: ["we had arrived", "had we arrived", "did we arrive", "we arrived"],
    correctIndex: 1,
    difficulty: "B2",
    skill: "Writing",
    explanation: "'No sooner' at the beginning of a sentence requires inversion."
  },

  // --- C1 (Advanced) ---
  {
    id: 71,
    question: "Reading: Which word is a synonym for 'Abundant'?",
    options: ["Scarce", "Plentiful", "Rare", "Small"],
    correctIndex: 1,
    difficulty: "C1",
    skill: "Reading",
    explanation: "'Abundant' and 'Plentiful' both mean existing in large quantities."
  },
  {
    id: 72,
    question: "Writing: 'The report _____ the need for urgent action.'",
    options: ["highlights", "underlines", "emphasizes", "all of the above"],
    correctIndex: 3,
    difficulty: "C1",
    skill: "Writing",
    explanation: "All three verbs are commonly used in academic/professional writing to stress importance."
  },
  {
    id: 73,
    question: "Reading: 'The candidate's performance was _____.' (Extremely impressive)",
    options: ["mediocre", "stellar", "adequate", "subpar"],
    correctIndex: 1,
    difficulty: "C1",
    skill: "Reading",
    explanation: "'Stellar' means exceptionally good or outstanding."
  },
  {
    id: 74,
    question: "Listening: You hear: 'The results are somewhat ambiguous.' What is the problem?",
    options: ["The results are clear.", "The results are confusing or have multiple meanings.", "The results are wrong.", "The results are missing."],
    correctIndex: 1,
    difficulty: "C1",
    skill: "Listening",
    explanation: "'Ambiguous' means open to more than one interpretation; not having one obvious meaning."
  },
  {
    id: 75,
    question: "Speaking: How do you introduce a counter-argument in a debate?",
    options: ["You are wrong.", "Conversely, one could argue that...", "But wait.", "I don't think so."],
    correctIndex: 1,
    difficulty: "C1",
    skill: "Speaking",
    explanation: "'Conversely...' is a formal transition used to introduce an opposing idea."
  },
  {
    id: 76,
    question: "Writing: 'It is imperative that he _____ the deadline.'",
    options: ["meets", "meet", "meeting", "will meet"],
    correctIndex: 1,
    difficulty: "C1",
    skill: "Writing",
    explanation: "After adjectives like 'imperative', 'essential', or 'vital', we use the subjunctive mood (base form)."
  },
  {
    id: 77,
    question: "Reading: 'The new law has _____ mixed reactions from the public.'",
    options: ["provoked", "elicited", "caused", "made"],
    correctIndex: 1,
    difficulty: "C1",
    skill: "Reading",
    explanation: "'Elicit' means to evoke or draw out a reaction or response."
  },
  {
    id: 78,
    question: "Listening: You hear: 'We need to mitigate the risks involved.' What is the action?",
    options: ["To ignore the risks", "To increase the risks", "To make the risks less severe", "To find new risks"],
    correctIndex: 2,
    difficulty: "C1",
    skill: "Listening",
    explanation: "'Mitigate' means to make something less severe, serious, or painful."
  },
  {
    id: 79,
    question: "Speaking: How do you express nuanced agreement?",
    options: ["I agree.", "I agree with you in principle, but I have reservations about the implementation.", "Yes.", "Sure."],
    correctIndex: 1,
    difficulty: "C1",
    skill: "Speaking",
    explanation: "This expresses agreement with the main idea while noting specific concerns."
  },
  {
    id: 80,
    question: "Writing: 'The findings _____ the theory that was proposed earlier.'",
    options: ["corroborate", "support", "validate", "all of the above"],
    correctIndex: 3,
    difficulty: "C1",
    skill: "Writing",
    explanation: "All these verbs are used to say that new evidence confirms a theory."
  },
  {
    id: 81,
    question: "Reading: 'Her speech was _____ with metaphors.'",
    options: ["full", "filled", "replete", "crowded"],
    correctIndex: 2,
    difficulty: "C1",
    skill: "Reading",
    explanation: "'Replete' is a formal word meaning well-supplied or filled with something."
  },
  {
    id: 82,
    question: "Listening: You hear: 'The project has been put on the back burner.' What is the status?",
    options: ["It is finished.", "It is a top priority.", "It is being delayed or given lower priority.", "It is cancelled."],
    correctIndex: 2,
    difficulty: "C1",
    skill: "Listening",
    explanation: "'On the back burner' means not receiving immediate attention; postponed."
  },
  {
    id: 83,
    question: "Speaking: How do you conclude a high-level presentation?",
    options: ["In conclusion, the data suggests that...", "Bye.", "I'm done.", "Thanks for listening."],
    correctIndex: 0,
    difficulty: "C1",
    skill: "Speaking",
    explanation: "'In conclusion...' is a standard formal way to wrap up a presentation."
  },
  {
    id: 84,
    question: "Writing: 'The city's infrastructure is _____.' (Falling into a state of repair)",
    options: ["dilapidated", "modern", "sturdy", "pristine"],
    correctIndex: 0,
    difficulty: "C1",
    skill: "Writing",
    explanation: "'Dilapidated' describes a building or object in a state of disrepair or neglect."
  },
  {
    id: 85,
    question: "Reading: 'The author's tone is quite _____.' (Showing a lack of respect)",
    options: ["reverent", "irreverent", "solemn", "earnest"],
    correctIndex: 1,
    difficulty: "C1",
    skill: "Reading",
    explanation: "'Irreverent' means showing a lack of respect for people or things that are generally taken seriously."
  },

  // --- C2 (Proficient) ---
  {
    id: 86,
    question: "Reading: 'The politician's rhetoric was _____.' (Intended to persuade but lacking sincerity)",
    options: ["eloquent", "meretricious", "profound", "cogent"],
    correctIndex: 1,
    difficulty: "C2",
    skill: "Reading",
    explanation: "'Meretricious' means apparently attractive but having in reality no value or integrity."
  },
  {
    id: 87,
    question: "Writing: 'The judge's ruling was _____.' (Based on a whim rather than reason)",
    options: ["arbitrary", "judicious", "equitable", "impartial"],
    correctIndex: 0,
    difficulty: "C2",
    skill: "Writing",
    explanation: "'Arbitrary' means based on random choice or personal whim, rather than any reason or system."
  },
  {
    id: 88,
    question: "Listening: You hear: 'He's a bit of a dark horse.' What does this mean?",
    options: ["He is dangerous.", "He has hidden talents or interests.", "He is very fast.", "He is gloomy."],
    correctIndex: 1,
    difficulty: "C2",
    skill: "Listening",
    explanation: "A 'dark horse' is a person about whom little is known, especially one who unexpectedly wins or succeeds."
  },
  {
    id: 89,
    question: "Speaking: How do you articulate a highly complex philosophical point?",
    options: ["It's like this...", "The ontological implications of this premise suggest...", "I think...", "Basically..."],
    correctIndex: 1,
    difficulty: "C2",
    skill: "Speaking",
    explanation: "This uses advanced academic vocabulary appropriate for C2 level discourse."
  },
  {
    id: 90,
    question: "Reading: 'The atmosphere was _____ with tension.'",
    options: ["full", "thick", "palpable", "heavy"],
    correctIndex: 2,
    difficulty: "C2",
    skill: "Reading",
    explanation: "'Palpable' means so intense as to seem almost tangible."
  },
  {
    id: 91,
    question: "Writing: 'The company's downfall was _____.' (Unavoidable)",
    options: ["inevitable", "elusive", "contingent", "precarious"],
    correctIndex: 0,
    difficulty: "C2",
    skill: "Writing",
    explanation: "'Inevitable' means certain to happen; unavoidable."
  },
  {
    id: 92,
    question: "Listening: You hear: 'She has an axe to grind.' What is her motivation?",
    options: ["She is helpful.", "She has a private reason for being involved or complaining.", "She is a carpenter.", "She is angry."],
    correctIndex: 1,
    difficulty: "C2",
    skill: "Listening",
    explanation: "'To have an axe to grind' means to have a private reason for being involved in something or for arguing for a particular cause."
  },
  {
    id: 93,
    question: "Speaking: How do you deliver a sophisticated critique of a literary work?",
    options: ["I didn't like it.", "The narrative structure is intentionally fragmented to mirror the protagonist's psyche.", "It was okay.", "The book is long."],
    correctIndex: 1,
    difficulty: "C2",
    skill: "Speaking",
    explanation: "This demonstrates the ability to use complex language to analyze abstract concepts."
  },
  {
    id: 94,
    question: "Reading: 'The silence was _____.' (Extremely loud or intense)",
    options: ["quiet", "deafening", "peaceful", "calm"],
    correctIndex: 1,
    difficulty: "C2",
    skill: "Reading",
    explanation: "'Deafening' is used figuratively to describe a silence that is very noticeable or overwhelming."
  },
  {
    id: 95,
    question: "Writing: 'His argument was _____.' (Clear, logical, and convincing)",
    options: ["vague", "cogent", "convoluted", "specious"],
    correctIndex: 1,
    difficulty: "C2",
    skill: "Writing",
    explanation: "'Cogent' means clear, logical, and convincing."
  },
  {
    id: 96,
    question: "Listening: You hear: 'It's the thin end of the wedge.' What is the concern?",
    options: ["Something is too small.", "A small change will lead to much more serious changes.", "The tool is broken.", "It's a good start."],
    correctIndex: 1,
    difficulty: "C2",
    skill: "Listening",
    explanation: "'The thin end of the wedge' is an idiom used to warn that a small, seemingly unimportant change will lead to something much larger and more serious."
  },
  {
    id: 97,
    question: "Speaking: How do you express profound irony?",
    options: ["That's funny.", "It is deeply ironic that the very measures intended to save the company led to its demise.", "I am joking.", "How strange."],
    correctIndex: 1,
    difficulty: "C2",
    skill: "Speaking",
    explanation: "This demonstrates the ability to use complex sentence structures to convey subtle meanings."
  },
  {
    id: 98,
    question: "Reading: 'The landscape was _____.' (Extremely beautiful and impressive)",
    options: ["nice", "sublime", "pretty", "okay"],
    correctIndex: 1,
    difficulty: "C2",
    skill: "Reading",
    explanation: "'Sublime' means of such excellence, grandeur, or beauty as to inspire great admiration."
  },
  {
    id: 99,
    question: "Writing: 'The treaty was _____.' (No longer valid)",
    options: ["null and void", "active", "binding", "provisional"],
    correctIndex: 0,
    difficulty: "C2",
    skill: "Writing",
    explanation: "'Null and void' is a legal term meaning having no legal force; invalid."
  },
  {
    id: 100,
    question: "Listening: You hear: 'He's a man of many parts.' What does this mean?",
    options: ["He is a mechanic.", "He has many different skills and talents.", "He is very old.", "He is complicated."],
    correctIndex: 1,
    difficulty: "C2",
    skill: "Listening",
    explanation: "A 'man of many parts' is a person with many different skills and abilities."
  }
];

export function calculateLevel(score: number, total: number): EnglishLevel {
  const percentage = (score / total) * 100;
  if (percentage <= 20) return "A1";
  if (percentage <= 40) return "A2";
  if (percentage <= 60) return "B1";
  if (percentage <= 80) return "B2";
  if (percentage <= 95) return "C1";
  return "C2";
}
