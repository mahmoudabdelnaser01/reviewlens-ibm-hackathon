import React, { useState } from 'react';
import axios from 'axios';
import PasteInput from './components/PasteInput';
import Dashboard from './components/Dashboard';

/**
 * Main App Component
 * 
 * Orchestrates the entire application flow:
 * 1. User pastes reviews in PasteInput
 * 2. App sends request to backend API
 * 3. Dashboard displays the analysis results
 */
function App() {
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (reviewText) => {
    setIsLoading(true);
    setError(null);
    setAnalysisData(null);

    try {
      // Call the backend API
      const response = await axios.post('/api/analyze', {
        reviewText: reviewText
      }, {
        timeout: 60000, // 60 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setAnalysisData(response.data.data);
        // Scroll to results
        setTimeout(() => {
          document.getElementById('results')?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
      } else {
        setError(response.data.error || 'Analysis failed. Please try again.');
      }

    } catch (err) {
      console.error('Analysis error:', err);
      
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. The analysis is taking too long. Please try with fewer reviews.');
      } else if (err.response) {
        // Server responded with error
        setError(err.response.data?.error || 'Server error. Please try again.');
      } else if (err.request) {
        // Request made but no response
        setError('Cannot connect to server. Please ensure the backend is running.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setAnalysisData(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                🔍 ReviewLens
              </h1>
              <p className="text-gray-600 mt-1">
                Your reviews are talking. We translate.
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Powered by</div>
              <div className="text-lg font-semibold text-primary-600">IBM Bob</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Input Section */}
        <div className="mb-8">
          <PasteInput onAnalyze={handleAnalyze} isLoading={isLoading} />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 animate-slide-up">
            <div className="card bg-danger-50 border-danger-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl">❌</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-danger-900 mb-1">
                    Analysis Failed
                  </h3>
                  <p className="text-danger-800">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="mt-3 text-sm text-danger-700 hover:text-danger-900 font-medium"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="mb-8 animate-pulse">
            <div className="card text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <svg className="animate-spin h-8 w-8 text-primary-600" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Analyzing Your Reviews...
              </h3>
              <p className="text-gray-600">
                IBM Bob is processing your reviews and extracting insights. This may take a few moments.
              </p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {analysisData && !isLoading && (
          <div id="results">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                📊 Analysis Results
              </h2>
              <button
                onClick={handleNewAnalysis}
                className="btn btn-secondary"
              >
                ← New Analysis
              </button>
            </div>
            <Dashboard analysisData={analysisData} />
          </div>
        )}

        {/* Empty State */}
        {!analysisData && !isLoading && !error && (
          <div className="card text-center py-12 bg-gradient-to-br from-primary-50 to-success-50 border-dashed">
            <span className="text-6xl mb-4 block">🎯</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ready to Analyze Your Reviews
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Paste your customer reviews above and click "Analyze Reviews" to get instant insights 
              powered by IBM Bob AI.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>
              Built for <strong>IBM Bob Dev Day Hackathon 2026</strong>
            </p>
            <p className="mt-1">
              ReviewLens transforms unstructured customer feedback into actionable business intelligence
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

// Made with Bob
