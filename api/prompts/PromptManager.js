import { DEFAULT_PROMPT, PERSONALIZED_PROMPT } from './templates';

/**
 * PromptManager class handles the generation and management of prompts for the style recommendation system.
 * It manages different prompt templates and handles the context validation and prompt generation.
 */
class PromptManager {
  /**
   * Initializes the PromptManager with available prompt templates.
   */
  constructor() {
    this.templates = new Map();
    this.templates.set(DEFAULT_PROMPT.id, DEFAULT_PROMPT);
    this.templates.set(PERSONALIZED_PROMPT.id, PERSONALIZED_PROMPT);
  }

  /**
   * Generates a prompt based on the template ID and provided context.
   * @param {string} templateId - The ID of the template to use
   * @param {Object} context - The context object containing required fields
   * @returns {string} The generated prompt with placeholders replaced
   * @throws {Error} If template is not found or required context is missing
   */
  generatePrompt(templateId, context) {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    // Validate required context
    this.validateContext(template, context);

    // Replace placeholders in template
    let prompt = template.template;
    
    // Replace simple string placeholders
    Object.entries(context).forEach(([key, value]) => {
      if (typeof value === 'string') {
        prompt = prompt.replace(`{${key}}`, value);
      }
    });

    // Handle nested objects (like userHistory)
    if (context.userHistory) {
      prompt = prompt.replace('{userHistory.likes}', context.userHistory.likes.join(', '));
      prompt = prompt.replace('{userHistory.dislikes}', context.userHistory.dislikes.join(', '));
    }

    // Handle arrays
    if (context.userPreferences) {
      prompt = prompt.replace('{userPreferences}', context.userPreferences.join(', '));
    }
    if (context.previousRecommendations) {
      prompt = prompt.replace('{previousRecommendations}', context.previousRecommendations.join(', '));
    }

    return prompt;
  }

  /**
   * Validates that all required context fields are present.
   * @param {Object} template - The prompt template to validate against
   * @param {Object} context - The context object to validate
   * @throws {Error} If any required fields are missing
   */
  validateContext(template, context) {
    const missingFields = template.requiredContext.filter(
      field => !context[field]
    );

    if (missingFields.length > 0) {
      throw new Error(
        `Missing required context fields: ${missingFields.join(', ')}`
      );
    }
  }

  /**
   * Parses the OpenAI response into a structured format.
   * @param {string} response - The raw response from OpenAI
   * @returns {Object} The parsed response object
   * @throws {Error} If the response cannot be parsed as JSON
   */
  parseResponse(response) {
    try {
      return JSON.parse(response);
    } catch (error) {
      throw new Error('Failed to parse OpenAI response as JSON');
    }
  }
}

export default PromptManager; 