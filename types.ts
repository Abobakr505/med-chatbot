
export enum Role {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export interface Message {
  role: Role;
  content: string;
  isReport?: boolean;
}

export interface AssessmentReport {
  analysis: string;
  possibilities: string[];
  riskLevel: 'منخفضة' | 'متوسطة' | 'عالية';
  advice: string[];
  whenToSeeDoctor: string;
}
