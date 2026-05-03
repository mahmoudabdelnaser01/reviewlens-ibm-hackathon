/**
 * Review Analysis API Routes
 * 
 * Handles POST /api/analyze endpoint for review analysis
 */

import express from 'express';
import { body, validationResult } from 'express-validator';
import { analyzeReviews } from '../services/bobService.js';
import { validateReviewInput } from '../prompts/reviewAnalyst.js';

const router = express.Router();

/**
 * POST /api/analyze
 * Analyzes customer reviews and returns structured insights
 * 
 * Request body:
 * {
 *   "reviewText": "Raw review text to analyze"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "summary": "...",
 *     "sentiment_score": 7.5,
 *     "total_reviews_detected": 15,
 *     "pain_points": [...],
 *     "top_praises": [...],
 *     "action_plan": [...]
 *   }
 * }
 */
router.post(
  '/analyze',
  [
    body('reviewText')
      .exists().withMessage('reviewText is required')
      .isString().withMessage('reviewText must be a string')
      .trim()
      .notEmpty().withMessage('reviewText cannot be empty')
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { reviewText } = req.body;

      // Validate review input (length, format, etc.)
      const inputValidation = validateReviewInput(reviewText);
      if (!inputValidation.valid) {
        return res.status(400).json({
          success: false,
          error: inputValidation.error
        });
      }

      // Log request (without full text for privacy)
      console.log(`[${new Date().toISOString()}] Analysis request received (${reviewText.length} characters)`);

      // Call IBM Bob service to analyze reviews
      const result = await analyzeReviews(inputValidation.text);

      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: result.error || 'Analysis failed'
        });
      }

      // Return successful analysis
      return res.status(200).json({
        success: true,
        data: result.data
      });

    } catch (error) {
      console.error('Error in /api/analyze:', error);
      
      return res.status(500).json({
        success: false,
        error: 'An unexpected error occurred during analysis. Please try again.'
      });
    }
  }
);

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ReviewLens API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;

// Made with Bob
