import { OpenAI } from 'openai';
import PromptManager from './prompts/PromptManager';

// Initialize the prompt manager for handling style recommendation prompts
const promptManager = new PromptManager();

/**
 * API endpoint for analyzing images and providing style recommendations.
 * This endpoint:
 * 1. Analyzes the uploaded image using OpenAI's Vision API
 * 2. Generates style recommendations based on the image analysis
 * 3. Optionally incorporates user preferences and history for personalized recommendations
 * 
 * @param {Object} req - The HTTP request object
 * @param {Object} req.body - The request body containing:
 *   - image: Base64 encoded image data
 *   - userPreferences: Optional array of user style preferences
 *   - previousRecommendations: Optional array of previous recommendations
 *   - userHistory: Optional object containing liked and disliked items
 * @param {Object} res - The HTTP response object
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Initialize OpenAI client with API key from environment variables
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is set as an environment variable
  });

  try {
    // Extract request parameters
    // Assuming the image data is sent in the request body,
    // potentially as a base64 encoded string or form data.
    // You'll need to adjust this based on how the image is sent.
    const { image, userPreferences, previousRecommendations, userHistory } = req.body;
    
    // Validate required image data
    if (!image) {
      return res.status(400).json({ error: 'Image data is missing' });
    }

    // Format image data for OpenAI Vision API
    // For base64, it might look like: `data:image/jpeg;base64,${imageData}`
    const formattedImage = typeof image === 'string' && !image.startsWith('data:')
      ? `data:image/jpeg;base64,${image}`
      : image;

    // Step 1: Get detailed image description using Vision API
    const visionResponse = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Describe this image in detail, focusing on the clothing, style, and fashion elements of the main person:" },
            {
              type: "image_url",
              image_url: {
                url: formattedImage,
              },
            },
          ],
        },
      ],
    });

    const imageDescription = visionResponse.choices[0].message.content;

    // Step 2: Prepare context for style recommendations
    const context = {
      imageDescription,
      ...(userPreferences && { userPreferences }),
      ...(previousRecommendations && { previousRecommendations }),
      ...(userHistory && { userHistory })
    };

    // Step 3: Generate appropriate prompt based on available context
    const templateId = (userPreferences || previousRecommendations || userHistory)
      ? 'personalized'
      : 'default';
    
    const prompt = promptManager.generatePrompt(templateId, context);

    // Step 4: Get style recommendations using the generated prompt
    const recommendationsResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
    });

    // Parse and structure the recommendations
    const recommendations = promptManager.parseResponse(
      recommendationsResponse.choices[0].message.content
    );

    // Return both the image description and recommendations
    res.status(200).json({
      imageDescription,
      recommendations
    });

  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).json({ 
      error: 'Error analyzing image',
      details: error.message 
    });
  }
}