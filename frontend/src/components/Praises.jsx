import React from 'react';

/**
 * Praises Component
 * 
 * Displays a list of top customer praises with frequency information
 * and example quotes highlighting what customers love.
 */
const Praises = ({ praises }) => {
  if (!praises || praises.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🟢 Top Praises</h3>
        <p className="text-gray-500 text-center py-8">
          No specific praises detected in the reviews.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">🟢 Top Praises</h3>
        <span className="text-sm text-gray-500">
          {praises.length} {praises.length === 1 ? 'strength' : 'strengths'} identified
        </span>
      </div>

      <div className="space-y-4">
        {praises.map((praise, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 hover:border-success-300 hover:shadow-md transition-all duration-200 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">✨</span>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900 text-base">
                    {praise.strength}
                  </h4>
                  <span className="badge bg-success-100 text-success-800 flex-shrink-0">
                    Strength
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-gray-600">
                    📊 {praise.frequency}
                  </span>
                </div>

                {praise.example_quote && (
                  <blockquote className="border-l-4 border-success-300 pl-4 py-2 bg-success-50 rounded-r">
                    <p className="text-sm text-gray-700 italic">
                      "{praise.example_quote}"
                    </p>
                  </blockquote>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {praises.length > 0 && (
        <div className="mt-6 p-4 bg-success-50 border border-success-200 rounded-lg">
          <p className="text-sm text-success-800">
            <strong>💡 Marketing Tip:</strong> These are your competitive advantages. 
            Consider highlighting them in your marketing materials and product descriptions.
          </p>
        </div>
      )}
    </div>
  );
};

export default Praises;

// Made with Bob
