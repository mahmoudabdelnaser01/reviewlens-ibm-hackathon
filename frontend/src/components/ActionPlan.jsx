import React from 'react';

/**
 * ActionPlan Component
 * 
 * Displays a prioritized list of actionable recommendations
 * based on the review analysis, with expected impact for each action.
 */
const ActionPlan = ({ actionPlan }) => {
  if (!actionPlan || actionPlan.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 AI Action Plan</h3>
        <p className="text-gray-500 text-center py-8">
          No specific actions recommended at this time.
        </p>
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    if (priority === 1) return 'bg-danger-500';
    if (priority === 2) return 'bg-warning-500';
    if (priority === 3) return 'bg-primary-500';
    return 'bg-gray-500';
  };

  const getPriorityLabel = (priority) => {
    if (priority === 1) return 'Critical';
    if (priority === 2) return 'High';
    if (priority === 3) return 'Medium';
    return 'Low';
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">📋 AI Action Plan</h3>
        <span className="text-sm text-gray-500">
          {actionPlan.length} {actionPlan.length === 1 ? 'action' : 'actions'} recommended
        </span>
      </div>

      <div className="space-y-4">
        {actionPlan.map((action, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-5 hover:border-primary-300 hover:shadow-md transition-all duration-200 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start gap-4">
              {/* Priority indicator */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={`w-10 h-10 rounded-full ${getPriorityColor(action.priority)} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                  {action.priority}
                </div>
                <span className="text-xs text-gray-500 mt-1 font-medium">
                  {getPriorityLabel(action.priority)}
                </span>
              </div>

              {/* Action content */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-base mb-3">
                  {action.action}
                </h4>

                <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <span className="text-primary-600 flex-shrink-0 mt-0.5">💡</span>
                    <div>
                      <p className="text-xs font-semibold text-primary-900 mb-1">
                        Expected Impact:
                      </p>
                      <p className="text-sm text-primary-800">
                        {action.expected_impact}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-success-50 border border-primary-200 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🎯</span>
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">
              Implementation Tip
            </p>
            <p className="text-sm text-gray-700">
              Start with priority 1 actions for maximum impact. Track results over 2-4 weeks 
              before moving to lower priority items. Consider A/B testing when possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionPlan;

// Made with Bob
