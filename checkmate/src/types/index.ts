export type QuestionType = 'true-false' | 'short-answer';

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: Option[];
  correctAnswer: string | string[]; // option id or array of option ids
}

export interface Test {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: number;
  lastModified: number;
}

export interface TestResult {
  testId: string;
  score: number;
  totalQuestions: number;
  completedAt: number;
  answers: Record<string, string | string[]>; // questionId -> answerId
} 