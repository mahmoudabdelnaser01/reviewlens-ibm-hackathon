import React, { useState } from 'react';
import SentimentGauge from './SentimentGauge';
import PainPoints from './PainPoints';
import Praises from './Praises';
import ActionPlan from './ActionPlan';
import { exportToPDF } from '../utils/pdfExport';

/**
 * Dashboard Component
 * 
 * Main results dashboard that displays all analysis insights.
 * Composes all the leaf components (SentimentGauge, PainPoints, Praises, ActionPlan).
 */
const Dashboard = ({ analysisData }) => {
  const [isExporting, setIsExporting] = useState(false);

  if (!analysisData) {
    return null;
  }

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportToPDF(analysisData);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const {
    summary,
    sentiment_score,
    total_reviews_detected,
    pain_points,
    top_praises,
    action_plan
  } = analysisData;

  return (
    <div className="animate-fade-in">
      {/* Summary Section */}
      <div className="card mb-6 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
        <div className="flex items-start gap-3">
          <span className="text-3xl">📊</span>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Analysis Summary</h2>
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </div>
        </div>
      </div>

      {/* Sentiment Gauge */}
      <div className="mb-6">
        <SentimentGauge 
          score={sentiment_score} 
          totalReviews={total_reviews_detected} 
        />
      </div>

      {/* Two-column layout for Pain Points and Praises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PainPoints painPoints={pain_points} />
        <Praises praises={top_praises} />
      </div>

      {/* Action Plan */}
      <div className="mb-6">
        <ActionPlan actionPlan={action_plan} />
      </div>

      {/* Export/Share Section */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💾</span>
            <div>
              <h3 className="font-semibold text-gray-900">Save Your Analysis</h3>
              <p className="text-sm text-gray-600">
                Export this report as a professional PDF or JSON file
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="btn btn-primary text-sm"
              onClick={handleExportPDF}
              disabled={isExporting}
            >
              {isExporting ? '⏳ Generating...' : '📄 Export PDF'}
            </button>
            <button
              className="btn btn-secondary text-sm"
              onClick={() => {
                const dataStr = JSON.stringify(analysisData, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `reviewlens-analysis-${Date.now()}.json`;
                link.click();
                URL.revokeObjectURL(url);
              }}
            >
              📥 Export JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// Made with Bob
