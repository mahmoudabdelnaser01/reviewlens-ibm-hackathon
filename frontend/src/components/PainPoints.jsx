import React from 'react';

/**
 * PainPoints Component
 * 
 * Displays a list of customer pain points with severity indicators,
 * frequency information, and example quotes.
 */
const PainPoints = ({ painPoints }) => {
  if (!painPoints || painPoints.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔴 Pain Points</h3>
        <p className="text-gray-500 text-center py-8">
          No significant pain points detected. Great job! 🎉
        </p>
      </div>
    );
  }

  const getSeverityBadge = (severity) => {
    const severityLower = severity.toLowerCase();
    if (severityLower === 'high') {
      return <span className="badge badge-high">High Priority</span>;
    }
    if (severityLower === 'medium') {
      return <span className="badge badge-medium">Medium Priority</span>;
    }
    return <span className="badge badge-low">Low Priority</span>;
  };

  const getSeverityIcon = (severity) => {
    const severityLower = severity.toLowerCase();
    if (severityLower === 'high') return '🔴';
    if (severityLower === 'medium') return '🟡';
    return '🟢';
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">🔴 Pain Points</h3>
        <span className="text-sm text-gray-500">
          {painPoints.length} {painPoints.length === 1 ? 'issue' : 'issues'} identified
        </span>
      </div>

      <div className="space-y-4">
        {painPoints.map((point, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 hover:border-danger-300 hover:shadow-md transition-all duration-200 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">
                {getSeverityIcon(point.severity)}
              </span>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900 text-base">
                    {point.issue}
                  </h4>
                  {getSeverityBadge(point.severity)}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-gray-600">
                    📊 {point.frequency}
                  </span>
                </div>

                {point.example_quote && (
                  <blockquote className="border-l-4 border-danger-300 pl-4 py-2 bg-gray-50 rounded-r">
                    <p className="text-sm text-gray-700 italic">
                      "{point.example_quote}"
                    </p>
                  </blockquote>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {painPoints.length > 0 && (
        <div className="mt-6 p-4 bg-danger-50 border border-danger-200 rounded-lg">
          <p className="text-sm text-danger-800">
            <strong>⚠️ Action Required:</strong> These pain points require attention. 
            Check the Action Plan below for specific recommendations.
          </p>
        </div>
      )}
    </div>
  );
};

export default PainPoints;

// Made with Bob
