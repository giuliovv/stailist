/**
 * Prompt templates for the style recommendation system.
 * Each template defines a structured prompt for different use cases.
 */

export const DEFAULT_PROMPT = {
  id: 'default',
  template: `You are a fashion and style expert. Based on the following image description: "{imageDescription}"

Please provide:
1. 3 specific style recommendations for the following areas: a. improve your style, b. elevate your look, c. look for different occasions
2. A brief explanation of why these recommendations would work well
3. A confidence score (0-1) for your recommendations

Format your response as a JSON object with the following structure:
{
  "recommendations": ["rec1", "rec2", "rec3"],
  "explanation": "your explanation",
  "confidence": 0.8
}`,
  description: 'Default prompt for basic image-based recommendations',
  requiredContext: ['imageDescription'] // Only requires the image description
};

export const PERSONALIZED_PROMPT = {
  id: 'personalized',
  template: `You are a fashion and style expert. Based on the following information:

Image Description: "{imageDescription}"
User Preferences: {userPreferences}
Previous Recommendations: {previousRecommendations}
User History:
- Liked: {userHistory.likes}
- Disliked: {userHistory.dislikes}

Please provide:
1. 3 specific style recommendations for the following areas: a. improve your style, b. elevate your look, c. look for different occasions
2. A detailed explanation of why these recommendations would work well
3. A confidence score (0-1) for your recommendations

Format your response as a JSON object with the following structure:
{
  "recommendations": ["rec1", "rec2", "rec3"],
  "explanation": "your explanation",
  "confidence": 0.8
}`,
  description: 'Personalized prompt that takes into account user preferences and history',
  requiredContext: ['imageDescription', 'userPreferences', 'previousRecommendations', 'userHistory']
}; 