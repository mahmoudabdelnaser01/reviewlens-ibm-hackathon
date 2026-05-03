/**
 * IBM watsonx.ai API Service
 *
 * Handles all communication with the IBM watsonx.ai API for review analysis.
 * Includes error handling, JSON extraction, and response validation.
 */

import axios from 'axios';
import { createReviewAnalysisPrompt } from '../prompts/reviewAnalyst.js';

/**
 * Expected schema for IBM Bob response
 */
const EXPECTED_SCHEMA = {
  summary: 'string',
  sentiment_score: 'number',
  total_reviews_detected: 'number',
  pain_points: 'array',
  top_praises: 'array',
  action_plan: 'array'
};

/**
 * Extracts JSON from IBM Bob response
 * Handles cases where Bob returns markdown-wrapped JSON or extra text
 */
const extractJSON = (responseText) => {
  try {
    // First, try direct JSON parse
    return JSON.parse(responseText);
  } catch (e) {
    // If that fails, try to extract JSON from markdown or text
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e2) {
        throw new Error('Failed to parse JSON from response');
      }
    }
    throw new Error('No valid JSON found in response');
  }
};

/**
 * Validates that the response matches expected schema
 */
const validateResponse = (data) => {
  const errors = [];

  for (const [key, expectedType] of Object.entries(EXPECTED_SCHEMA)) {
    if (!(key in data)) {
      errors.push(`Missing required field: ${key}`);
      continue;
    }

    const actualType = Array.isArray(data[key]) ? 'array' : typeof data[key];
    if (actualType !== expectedType) {
      errors.push(`Field '${key}' should be ${expectedType}, got ${actualType}`);
    }
  }

  // Validate sentiment_score range
  if (typeof data.sentiment_score === 'number') {
    if (data.sentiment_score < 1 || data.sentiment_score > 10) {
      errors.push('sentiment_score must be between 1 and 10');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Get IAM access token from API key
 */
const getIAMToken = async (apiKey) => {
  try {
    const response = await axios.post(
      'https://iam.cloud.ibm.com/identity/token',
      `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${apiKey}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Failed to get IAM token:', error.message);
    throw new Error('Failed to authenticate with IBM Cloud IAM');
  }
};

/**
 * Calls IBM watsonx.ai API with retry logic
 */
const callWatsonxAPI = async (prompt, retries = 3) => {
  const apiKey = process.env.IBM_WATSONX_API_KEY;
  const projectId = process.env.IBM_WATSONX_PROJECT_ID;
  let apiUrl = process.env.IBM_WATSONX_API_URL;

  if (!apiKey || !apiUrl) {
    throw new Error('IBM watsonx.ai API credentials not configured');
  }

  if (!projectId) {
    throw new Error('IBM watsonx.ai project ID not configured');
  }

  // Add version parameter if not present
  if (!apiUrl.includes('?version=')) {
    apiUrl = `${apiUrl}?version=2023-05-29`;
  }

  // Get IAM access token
  const accessToken = await getIAMToken(apiKey);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Use only hackathon-approved models (excluding mistral-medium-2502, mistral-small, llama-405b)
      const availableModels = [
        'ibm/granite-3-8b-instruct',                // IBM Granite - Best for hackathon
        'meta-llama/llama-3-3-70b-instruct',        // Llama 3.3 70B
        'meta-llama/llama-3-2-11b-vision-instruct', // Llama 3.2 11B
        'ibm/granite-8b-code-instruct',             // IBM Granite Code
        'ibm/granite-guardian-3-8b',                // IBM Granite Guardian
        'openai/gpt-oss-120b'                       // GPT OSS
      ];
      const modelId = availableModels[0]; // Use IBM Granite 3 8B
      
      
      const requestBody = {
        input: prompt,
        parameters: {
          decoding_method: "greedy",
          max_new_tokens: 2000,
          min_new_tokens: 0,
          temperature: 0.3,
          repetition_penalty: 1.0
        },
        model_id: modelId,
        project_id: projectId
      };
      
      const response = await axios.post(
        apiUrl,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 60000, // 60 second timeout for AI processing
        }
      );

      // Extract the generated text from watsonx.ai response
      const responseText = response.data.results?.[0]?.generated_text || '';
      
      if (!responseText) {
        throw new Error('Empty response from watsonx.ai API');
      }
      
      return responseText;

    } catch (error) {
      if (attempt === retries) {
        // Last attempt failed
        if (error.response) {
          const errorMsg = error.response.data?.error || error.response.data?.message || error.response.statusText;
          const fullError = JSON.stringify(error.response.data, null, 2);
          throw new Error(`watsonx.ai API error: ${error.response.status} - ${errorMsg}\nFull error: ${fullError}`);
        } else if (error.request) {
          throw new Error('watsonx.ai API is not responding. Please check your connection and API URL.');
        } else {
          throw new Error(`Failed to call watsonx.ai API: ${error.message}`);
        }
      }

      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};

/**
 * Main function to analyze reviews using IBM watsonx.ai
 */
export const analyzeReviews = async (reviewText) => {
  try {
    // Step 1: Create the prompt
    const prompt = createReviewAnalysisPrompt(reviewText);

    // Step 2: Call watsonx.ai API
    const rawResponse = await callWatsonxAPI(prompt);

    // Step 3: Extract JSON from response
    const parsedData = extractJSON(rawResponse);

    // Step 4: Validate response structure
    const validation = validateResponse(parsedData);
    
    if (!validation.valid) {
      throw new Error(`Invalid response structure: ${validation.errors.join(', ')}`);
    }

    // Step 5: Return validated data
    return {
      success: true,
      data: parsedData
    };

  } catch (error) {
    console.error('Error in analyzeReviews:', error);
    
    return {
      success: false,
      error: error.message || 'An unexpected error occurred during analysis'
    };
  }
};

/**
 * Health check for IBM watsonx.ai API connection
 */
export const checkWatsonxConnection = async () => {
  try {
    const testPrompt = 'Return only this JSON: {"status": "ok"}';
    await callWatsonxAPI(testPrompt, 1);
    return { connected: true };
  } catch (error) {
    return {
      connected: false,
      error: error.message
    };
  }
};
