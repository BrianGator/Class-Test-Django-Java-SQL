export interface Course {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  modulesCount: number;
  durationMinutes: number;
}

export interface Question {
  id: string;
  courseId: string;
  questionText: string;
  grade: number; // point value, default is 1
}

export interface Choice {
  id: string;
  questionId: string;
  choiceText: string;
  isCorrect: boolean;
}

export interface ExamSubmission {
  id: string;
  courseId: string;
  answers: Record<string, string>; // questionId -> choiceId
  score: number; // Percentage, e.g., 80
  scoreAchieved: number; // points correct
  scoreTotal: number; // total points
  passed: boolean; // boolean if score >= 80% or custom percentage
  submittedAt: string;
}
