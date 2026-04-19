export interface Place {
  id: string;
  name: string;
  type: 'popup' | 'food' | 'cafe';
  description: string;
  time: string;
  lat: number;
  lng: number;
  icon?: string;
}

export interface Course {
  id: string;
  title: string;
  places: Place[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  options?: { label: string; value: string; icon?: string }[];
  type?: 'text' | 'selection' | 'course_preview';
  course?: Course;
}

export interface UserPreferences {
  mood?: string;
  activityType?: string;
  foodType?: string;
  cafeType?: string;
}
