export type EnglishLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Beginner' | 'Intermediate' | 'Advanced';

export type Goal = 'Professional' | 'Academic' | 'Travel' | 'Social';

export type Skill = 'Speaking' | 'Listening' | 'Reading' | 'Writing';

export type Dialect = 'American' | 'British';

export interface UserProfile {
  id?: number;
  level: EnglishLevel;
  goals: Goal[];
  prioritySkills: Skill[];
  dailyCommitment: number;
  preferredDialect: Dialect;
  name: string;
  nativeLanguage: 'Burmese';
  customApiKey?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  type?: 'correction' | 'lesson' | 'assessment' | 'reading';
}

export interface Correction {
  original: string;
  natural: string;
  why: string;
  tip?: string;
}
