export interface Geolocation {
  latitude: number;
  longitude: number;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface Adventure {
  id: string;
  title: string;
  description: string;
  activityType: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  location: {
    name: string;
    coordinates: Geolocation;
  };
  dateTime: string;
  capacity: number;
  price?: number;
  itinerary: string[];
  gearList: string[];
  host: User; 
  attendees: User[];
  sources?: GroundingSource[];
}

export interface User {
  id: string;
  name:string;
  avatarUrl: string;
  bio: string;
  interests: string[];
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  pitchedAdventure?: Adventure;
}

export enum ImageSize {
    ONE_K = "1K",
    TWO_K = "2K",
    FOUR_K = "4K",
}
