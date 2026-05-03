import React from 'react';

/**
 * SentimentGauge Component
 * 
 * Displays a visual gauge showing the sentiment score (1-10)
 * with color-coded indicators and descriptive text.
 */
const SentimentGauge = ({ score, totalReviews }) => {
  // Determine color based on score
  const getColor = (score) => {
    if (score >= 8) return 'text-success-600';
    if (score >= 6) return 'text-primary-600';
    if (score >= 4) return 'text-warning-600';
    return 'text-danger-600';
  };

  const getBgColor = (score) => {
    if (score >= 8) return 'bg-success-500';
    if (score >= 6) return 'bg-primary-500';
    if (score >= 4) return 'bg-warning-500';
    return 'bg-danger-500';
  };

  const getSentimentLabel = (score) => {
    if (score >= 9) return 'Excellent';
    if (score >= 8) return 'Very Positive';
    if (score >= 7) return 'Positive';
    if (score >= 6) return 'Mostly Positive';
    if (score >= 5) return 'Mixed';
    if (score >= 4) return 'Mostly Negative';
    if (score >= 3) return 'Negative';
    return 'Very Negative';
  };

  const percentage = (score / 10) * 100;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Overall Sentiment</h3>
        <span className="text-sm text-gray-500">
          {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'} analyzed
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Circular gauge */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="10"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${percentage * 3.14} 314`}
              className={`${getBgColor(score)} transition-all duration-1000 ease-out`}
              style={{ stroke: 'currentColor' }}
            />
          </svg>
          {/* Score text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${getColor(score)}`}>
              {score.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500">out of 10</span>
          </div>
        </div>

        {/* Sentiment description */}
        <div className="flex-1">
          <div className={`text-2xl font-bold mb-2 ${getColor(score)}`}>
            {getSentimentLabel(score)}
          </div>
          <p className="text-sm text-gray-600">
            {score >= 7 
              ? 'Customers are generally satisfied with your product or service.'
              : score >= 5
              ? 'Customer sentiment is mixed. Review pain points for improvement areas.'
              : 'Customer sentiment is concerning. Immediate action recommended.'}
          </p>
          
          {/* Score bar */}
          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${getBgColor(score)} transition-all duration-1000 ease-out`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>Negative</span>
              <span>Neutral</span>
              <span>Positive</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentGauge;

// Made with Bob
