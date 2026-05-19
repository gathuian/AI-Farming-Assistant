export interface FarmProfile {
  ventureType: 'plants' | 'animals' | 'both';
  landSize: string; // e.g., "1 acre", "0.5 hectares"
  goals: string; // e.g., "raising sheep", "growing cabbage"
  budget: number;
  hasEquipment: boolean;
  knowledgeLevel: 'none' | 'beginner' | 'expert';
  location: string; // City and/or region
  climate: string; // e.g., "warm wet", "semi-arid"
}

export interface FinanceRecord {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
}

export interface FarmActivityRecord {
  id: string;
  date: string;
  type: 'crop' | 'livestock' | 'general';
  title: string;
  details: string;
  quantity?: string; // yields or stocks
}

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  content: string;
  category: 'crop' | 'livestock' | 'business' | 'other';
  image: string;
  likes: number;
  comments: BlogComment[];
  createdAt: string;
}

export interface BlogComment {
  id: string;
  author: string;
  comment: string;
  createdAt: string;
}

export interface CommunityQuestion {
  id: string;
  topic: string;
  question: string;
  author: string;
  answers: CommunityAnswer[];
  createdAt: string;
}

export interface CommunityAnswer {
  id: string;
  author: string;
  answer: string;
  likes: number;
  createdAt: string;
}

export interface WeatherData {
  temp: string;
  condition: string;
  humidity: string;
  precipChance: string;
  advice: string;
  location: string;
  forecast: Array<{ day: string; temp: string; condition: string }>;
}

export interface FarmingNews {
  title: string;
  summary: string;
  source: string;
  link?: string;
}

export interface AIResponse {
  guide: {
    title: string;
    introduction: string;
    stepByStepProcess: string[];
    diseasesAndPrevention: Array<{ name: string; symptoms: string; prevention: string }>;
    harvestingAndStoring: string;
    marketingAdvice: string;
    valueAdditionAgribusiness: string;
    vulnerabilitiesAndTrends?: string;
  };
  businessPlan?: {
    title: string;
    overview: string;
    marketAnalysis: string;
    costEstimates: { item: string; cost: number }[];
    marketingStrategy: string;
  };
}
