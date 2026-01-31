import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Adventure, Geolocation, ImageSize, GroundingSource, User } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const USER_PROFILE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: 'A unique ID for the user' },
        name: { type: Type.STRING },
        avatarUrl: { type: Type.STRING, description: "A realistic placeholder image URL from picsum.photos using a unique seed." },
        bio: { type: Type.STRING, description: "A short, engaging bio that reveals their personality and adventurous spirit." },
        interests: { type: Type.ARRAY, items: { type: Type.STRING } },
        skillLevel: { type: Type.STRING, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] }
    },
    required: ['id', 'name', 'avatarUrl', 'bio', 'interests', 'skillLevel']
};

const ADVENTURE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: 'A unique ID for the adventure' },
        title: { type: Type.STRING },
        description: { type: Type.STRING, description: "Detailed description as if sourced from AllTrails or a travel blog." },
        activityType: { type: Type.STRING },
        difficulty: { type: Type.STRING, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] },
        location: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: "Specific name of the trail, park, or spot." },
                coordinates: { type: Type.OBJECT, properties: { latitude: { type: Type.NUMBER }, longitude: { type: Type.NUMBER } }, required: ['latitude', 'longitude'] }
            },
            required: ['name', 'coordinates']
        },
        dateTime: { type: Type.STRING, description: 'A specific upcoming date and time.' },
        capacity: { type: Type.NUMBER },
        price: { type: Type.NUMBER, description: 'Optional cost in USD. Omit if free.' },
        itinerary: { type: Type.ARRAY, items: { type: Type.STRING } },
        gearList: { type: Type.ARRAY, items: { type: Type.STRING } },
        attendees: { type: Type.ARRAY, items: USER_PROFILE_SCHEMA, description: 'A list of 0-2 other plausible mock attendees.' }
    },
    required: ['id', 'title', 'description', 'activityType', 'difficulty', 'location', 'dateTime', 'capacity', 'itinerary', 'gearList', 'attendees']
};

const FULL_USER_SCHEMA_WITH_ADVENTURE = {
    ...USER_PROFILE_SCHEMA,
    properties: {
        ...USER_PROFILE_SCHEMA.properties,
        pitchedAdventure: {
            ...ADVENTURE_SCHEMA,
            description: "An optional adventure this person is planning or pitching to others."
        }
    }
};

const PEOPLE_SCHEMA = {
    type: Type.ARRAY,
    items: FULL_USER_SCHEMA_WITH_ADVENTURE
};

export const findAdventurousPeople = async (location: Geolocation, currentUser: User | null): Promise<User[]> => {
  try {
    const prompt = `Based on my location at lat ${location.latitude}, long ${location.longitude}, generate a list of 10 diverse and interesting adventurous people nearby.
    My profile for context (optional): ${currentUser ? `Interests: ${currentUser.interests.join(', ')}, Skill Level: ${currentUser.skillLevel}` : 'Not provided'}.
    For each person, create a compelling, platonic profile suitable for finding adventure buddies.
    - Give them a unique name, a cool bio, interests, and a skill level.
    - For about half of the profiles, invent a detailed "pitched adventure" they are planning. This adventure should be a real-world activity that is plausible for the given location.
    - When creating adventure details, act as an expert travel guide with access to data from Google Earth, satellite imagery, and AllTrails. Provide rich, evocative descriptions for locations and itineraries.
    - Ensure all data is mock data suitable for a demo. Do not use real people's information.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: PEOPLE_SCHEMA,
        tools: [{googleSearch: {}}],
      },
    });
    
    const jsonString = response.text.trim();
    let profiles: User[] = [];
    try {
        profiles = JSON.parse(jsonString);
    } catch (e) {
        console.error("Failed to parse profiles JSON:", e);
        throw new Error("The AI returned an unexpected format. Please try again.");
    }
    
    // The host of a pitched adventure is the user pitching it.
    return profiles.map(p => {
        if (p.pitchedAdventure) {
            p.pitchedAdventure.host = p;
        }
        return p;
    });

  } catch (error) {
    console.error("Error finding people:", error);
    throw new Error("Could not fetch profiles from Gemini API.");
  }
};

export const askAI = async (prompt: string, history: { role: string, parts: {text: string}[] }[]): Promise<string> => {
    try {
        const chat = ai.chats.create({ model: 'gemini-3-pro-preview', history });
        const response: GenerateContentResponse = await chat.sendMessage({ message: prompt });
        return response.text;
    } catch (error) {
        console.error("Error asking AI:", error);
        throw new Error("Could not get a response from the AI assistant.");
    }
};

export const generateImage = async (prompt: string, size: ImageSize): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: { parts: [{ text: `A vibrant, exciting, professional photo of: ${prompt}` }] },
            config: { imageConfig: { aspectRatio: "16:9", imageSize: size } },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
        }
        throw new Error("No image data found in response.");
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Could not generate image.");
    }
};
